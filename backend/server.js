import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import crypto from "node:crypto";
import db from "./db.js";

const app = express();
const port = Number(process.env.PORT || 5050);

const DEFAULT_COMPLIANCE = {
  rate: "99.2%",
  lastAudit: "2026-02-20",
  openFindings: 0,
  nextReview: "2026-03-20",
};

const LABOR_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const API_CACHE_TTL_MS = 15 * 60 * 1000;

function getComplianceStatus() {
  const row = db
    .prepare(
      "SELECT rate, last_audit, open_findings, next_review FROM compliance_status WHERE id = ?"
    )
    .get("default");
  if (row) {
    return {
      rate: row.rate,
      lastAudit: row.last_audit,
      openFindings: row.open_findings,
      nextReview: row.next_review,
    };
  }
  db.prepare(
    "INSERT INTO compliance_status (id, rate, last_audit, open_findings, next_review) VALUES (?, ?, ?, ?, ?)"
  ).run(
    "default",
    DEFAULT_COMPLIANCE.rate,
    DEFAULT_COMPLIANCE.lastAudit,
    DEFAULT_COMPLIANCE.openFindings,
    DEFAULT_COMPLIANCE.nextReview
  );
  return { ...DEFAULT_COMPLIANCE };
}

function buildLaborEstimate({ vinData, procedure, region, laborRate, mileage }) {
  const defaultRate = 135;
  const resolvedRate = Number(laborRate) || defaultRate;
  const baseHours = procedure ? 2.8 : 2.2;
  const vinYear = Number(vinData?.ModelYear || vinData?.modelYear || 0) || null;
  const ageFactor = vinYear ? Math.max(0.85, Math.min(1.2, (2026 - vinYear) / 12 + 0.9)) : 1;
  const mileageFactor = mileage ? Math.max(0.85, Math.min(1.15, mileage / 90000 + 0.9)) : 1;

  const laborHours = Number((baseHours * ageFactor * mileageFactor).toFixed(1));
  const laborHoursRange = [
    Number(Math.max(0.5, laborHours - 0.6).toFixed(1)),
    Number((laborHours + 0.8).toFixed(1)),
  ];

  const partsEstimate = Math.round(185 * ageFactor);
  const partsEstimateRange = [Math.round(partsEstimate * 0.75), Math.round(partsEstimate * 1.35)];

  const laborSubtotal = laborHours * resolvedRate;
  const miscFees = Math.round(laborSubtotal * 0.04);
  const totalEstimate = Math.round(laborSubtotal + partsEstimate + miscFees);

  return {
    laborHours,
    laborHoursRange,
    laborRate: resolvedRate,
    partsEstimate,
    partsEstimateRange,
    miscFees,
    totalEstimate,
    currency: "USD",
    confidence: procedure ? "medium" : "low",
    timeToComplete: `${Math.max(1, Math.round(laborHours))}-${Math.max(
      2,
      Math.round(laborHours + 1)
    )} hrs bay time`,
    warrantyTime: "12 mo / 12k mi (shop default)",
    insights: [
      "Estimate includes labor rate + parts range + shop fees.",
      "Add OEM labor guide for tighter confidence.",
    ],
    sourcesUsed: ["baseline-model", "shop-rate"],
    notes:
      "Baseline estimate. Connect a labor provider for OEM procedure times and parts catalogs.",
  };
}

function getLaborCacheKey({ vin, procedure, region }) {
  return [vin || "unknown", procedure || "general", region || "default"].join("::");
}

function getCachedLaborEstimate(cacheKey) {
  const row = db
    .prepare(
      "SELECT payload_json, created_at FROM labor_estimates WHERE cache_key = ? ORDER BY created_at DESC LIMIT 1"
    )
    .get(cacheKey);
  if (!row?.payload_json) return null;
  const createdAt = new Date(row.created_at).getTime();
  if (!createdAt || Date.now() - createdAt > LABOR_CACHE_TTL_MS) return null;
  try {
    return JSON.parse(row.payload_json);
  } catch (err) {
    console.warn("Failed to parse cached labor estimate", err);
    return null;
  }
}

function storeLaborEstimate(cacheKey, payload, { vin, procedure, region } = {}) {
  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO labor_estimates (id, cache_key, vin, procedure, region, payload_json) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, cacheKey, vin || null, procedure || null, region || null, JSON.stringify(payload));
}

function getCachedApiResponse(cacheKey) {
  const row = db
    .prepare(
      "SELECT payload_json, created_at FROM api_cache WHERE cache_key = ? ORDER BY created_at DESC LIMIT 1"
    )
    .get(cacheKey);
  if (!row?.payload_json) return null;
  const createdAt = new Date(row.created_at).getTime();
  if (!createdAt || Date.now() - createdAt > API_CACHE_TTL_MS) return null;
  try {
    return JSON.parse(row.payload_json);
  } catch (err) {
    console.warn("Failed to parse cached API response", err);
    return null;
  }
}

function storeApiCache(cacheKey, payload) {
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO api_cache (id, cache_key, payload_json) VALUES (?, ?, ?)").run(
    id,
    cacheKey,
    JSON.stringify(payload)
  );
}

function pruneCache() {
  try {
    db.prepare("DELETE FROM api_cache WHERE created_at < datetime('now', ?)").run(
      `-${Math.ceil(API_CACHE_TTL_MS / 60000)} minutes`
    );
    db.prepare("DELETE FROM labor_estimates WHERE created_at < datetime('now', ?)").run(
      `-${Math.ceil(LABOR_CACHE_TTL_MS / 60000)} minutes`
    );
  } catch (err) {
    console.warn("Cache prune failed", err);
  }
}

async function fetchWithCache({ cacheKey, url, ttlMs = API_CACHE_TTL_MS }) {
  const cached = getCachedApiResponse(cacheKey);
  if (cached) {
    return { data: cached, cached: true };
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  storeApiCache(cacheKey, data);
  return { data, cached: false };
}

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "repairbridge-backend" });
});

app.get("/api/v1/users", (req, res) => {
  const rows = db
    .prepare("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC")
    .all();
  res.json({ data: rows });
});

app.post("/api/v1/users", (req, res) => {
  const { email, name } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  const id = crypto.randomUUID();
  const stmt = db.prepare("INSERT INTO users (id, email, name) VALUES (?, ?, ?)");
  stmt.run(id, email, name || null);
  res.status(201).json({ data: { id, email, name: name || null } });
});

app.get("/api/v1/shops", (req, res) => {
  const rows = db
    .prepare("SELECT id, name, owner_user_id, created_at FROM shops ORDER BY created_at DESC")
    .all();
  res.json({ data: rows });
});

app.post("/api/v1/shops", (req, res) => {
  const { name, ownerUserId } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO shops (id, name, owner_user_id) VALUES (?, ?, ?)").run(
    id,
    name,
    ownerUserId || null
  );
  res.status(201).json({ data: { id, name, ownerUserId: ownerUserId || null } });
});

app.get("/api/v1/vin-lookups", (req, res) => {
  const { vin } = req.query;
  let rows = [];
  if (vin) {
    rows = db
      .prepare(
        "SELECT id, vin, source, payload_json, created_at FROM vin_lookups WHERE vin = ? ORDER BY created_at DESC"
      )
      .all(String(vin));
  } else {
    rows = db
      .prepare(
        "SELECT id, vin, source, payload_json, created_at FROM vin_lookups ORDER BY created_at DESC"
      )
      .all();
  }
  res.json({ data: rows });
});

app.post("/api/v1/vin-lookups", (req, res) => {
  const { vin, source, payload } = req.body || {};
  if (!vin || !source) {
    return res.status(400).json({ error: "vin and source are required" });
  }
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO vin_lookups (id, vin, source, payload_json) VALUES (?, ?, ?, ?)").run(
    id,
    vin,
    source,
    payload ? JSON.stringify(payload) : null
  );
  res.status(201).json({ data: { id, vin, source } });
});

app.get("/api/v1/reports", (req, res) => {
  const rows = db
    .prepare("SELECT id, vin_lookup_id, summary, created_at FROM reports ORDER BY created_at DESC")
    .all();
  res.json({ data: rows });
});

app.post("/api/v1/reports", (req, res) => {
  const { vinLookupId, summary } = req.body || {};
  if (!vinLookupId) {
    return res.status(400).json({ error: "vinLookupId is required" });
  }
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO reports (id, vin_lookup_id, summary) VALUES (?, ?, ?)").run(
    id,
    vinLookupId,
    summary || null
  );
  res.status(201).json({ data: { id, vinLookupId, summary: summary || null } });
});

app.post("/api/v1/labor-estimates", (req, res) => {
  const { vinData, procedure, region, laborRate, mileage } = req.body || {};
  const vin = vinData?.VIN || vinData?.vin || null;
  const cacheKey = getLaborCacheKey({ vin, procedure, region });
  const cached = getCachedLaborEstimate(cacheKey);
  if (cached) {
    return res.json({ data: cached, cached: true });
  }

  const payload = buildLaborEstimate({ vinData, procedure, region, laborRate, mileage });
  storeLaborEstimate(cacheKey, payload, { vin, procedure, region });
  res.json({ data: payload, cached: false });
});

app.get("/api/v1/nhtsa/vin/:vin", async (req, res) => {
  const vin = String(req.params.vin || "").trim();
  if (!vin) return res.status(400).json({ error: "vin is required" });
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${encodeURIComponent(
    vin
  )}?format=json`;
  try {
    const { data, cached } = await fetchWithCache({
      cacheKey: `vin:${vin}`,
      url,
    });
    res.json({ ...data, cached });
  } catch (err) {
    console.warn("VIN decode failed", err);
    res.status(502).json({ error: "vin decode failed" });
  }
});

app.get("/api/v1/nhtsa/recalls", async (req, res) => {
  const { make, model, modelYear } = req.query;
  if (!make || !model || !modelYear) {
    return res.status(400).json({ error: "make, model, modelYear required" });
  }
  const params = new URLSearchParams({ make, model, modelYear }).toString();
  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?${params}`;
  try {
    const { data, cached } = await fetchWithCache({
      cacheKey: `recalls:${make}:${model}:${modelYear}`,
      url,
    });
    res.json({ ...data, cached });
  } catch (err) {
    console.warn("Recalls fetch failed", err);
    res.status(502).json({ error: "recalls fetch failed" });
  }
});

app.get("/api/v1/nhtsa/complaints", async (req, res) => {
  const { make, model, modelYear } = req.query;
  if (!make || !model || !modelYear) {
    return res.status(400).json({ error: "make, model, modelYear required" });
  }
  const params = new URLSearchParams({ make, model, modelYear }).toString();
  const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?${params}`;
  try {
    const { data, cached } = await fetchWithCache({
      cacheKey: `complaints:${make}:${model}:${modelYear}`,
      url,
    });
    res.json({ ...data, cached });
  } catch (err) {
    console.warn("Complaints fetch failed", err);
    res.status(502).json({ error: "complaints fetch failed" });
  }
});

app.get("/api/v1/nhtsa/tsbs", async (req, res) => {
  const { make, model, modelYear } = req.query;
  if (!make || !model || !modelYear) {
    return res.status(400).json({ error: "make, model, modelYear required" });
  }
  const params = new URLSearchParams({ make, model, modelYear }).toString();
  const url = `https://api.nhtsa.gov/tsbs/tsbsByVehicle?${params}`;
  try {
    const { data, cached } = await fetchWithCache({
      cacheKey: `tsbs:${make}:${model}:${modelYear}`,
      url,
    });
    res.json({ ...data, cached });
  } catch (err) {
    console.warn("TSB fetch failed", err);
    res.status(502).json({ error: "tsb fetch failed" });
  }
});

app.get("/api/v1/cache/status", (req, res) => {
  const apiCount = db.prepare("SELECT COUNT(*) as count FROM api_cache").get();
  const laborCount = db.prepare("SELECT COUNT(*) as count FROM labor_estimates").get();
  const apiLatest = db
    .prepare("SELECT created_at FROM api_cache ORDER BY created_at DESC LIMIT 1")
    .get();
  const laborLatest = db
    .prepare("SELECT created_at FROM labor_estimates ORDER BY created_at DESC LIMIT 1")
    .get();

  res.json({
    data: {
      apiCache: { count: apiCount?.count || 0, latest: apiLatest?.created_at || null },
      laborEstimates: {
        count: laborCount?.count || 0,
        latest: laborLatest?.created_at || null,
      },
      ttlMinutes: {
        apiCache: Math.ceil(API_CACHE_TTL_MS / 60000),
        laborEstimates: Math.ceil(LABOR_CACHE_TTL_MS / 60000),
      },
    },
  });
});

app.get("/api/v1/compliance", (req, res) => {
  res.json({ data: getComplianceStatus() });
});

app.post("/api/v1/compliance", (req, res) => {
  const { rate, lastAudit, openFindings, nextReview } = req.body || {};
  if (!rate || !lastAudit || openFindings === undefined || !nextReview) {
    return res
      .status(400)
      .json({ error: "rate, lastAudit, openFindings, and nextReview are required" });
  }
  db.prepare(
    "INSERT INTO compliance_status (id, rate, last_audit, open_findings, next_review, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now')) " +
      "ON CONFLICT(id) DO UPDATE SET rate=excluded.rate, last_audit=excluded.last_audit, open_findings=excluded.open_findings, next_review=excluded.next_review, updated_at=datetime('now')"
  ).run("default", rate, lastAudit, Number(openFindings), nextReview);
  res
    .status(200)
    .json({ data: { rate, lastAudit, openFindings: Number(openFindings), nextReview } });
});

app.post("/api/v1/compliance/reports", (req, res) => {
  const { summary, payload } = req.body || {};
  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO compliance_reports (id, status, summary, payload_json) VALUES (?, ?, ?, ?)"
  ).run(
    id,
    "generated",
    summary || "Compliance report generated",
    payload ? JSON.stringify(payload) : null
  );
  res
    .status(201)
    .json({ data: { id, status: "generated", summary: summary || "Compliance report generated" } });
});

app.use((err, req, res) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(port, () => {
  console.log(`RepairBridge backend listening on http://localhost:${port}`);
  pruneCache();
  setInterval(pruneCache, 12 * 60 * 60 * 1000);
});
