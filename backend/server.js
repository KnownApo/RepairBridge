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
  nextReview: "2026-03-20"
};

function getComplianceStatus() {
  const row = db
    .prepare("SELECT rate, last_audit, open_findings, next_review FROM compliance_status WHERE id = ?")
    .get("default");
  if (row) {
    return {
      rate: row.rate,
      lastAudit: row.last_audit,
      openFindings: row.open_findings,
      nextReview: row.next_review
    };
  }
  db.prepare(
    "INSERT INTO compliance_status (id, rate, last_audit, open_findings, next_review) VALUES (?, ?, ?, ?, ?)"
  ).run("default", DEFAULT_COMPLIANCE.rate, DEFAULT_COMPLIANCE.lastAudit, DEFAULT_COMPLIANCE.openFindings, DEFAULT_COMPLIANCE.nextReview);
  return { ...DEFAULT_COMPLIANCE };
}

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "repairbridge-backend" });
});

app.get("/api/v1/users", (req, res) => {
  const rows = db.prepare("SELECT id, email, name, created_at FROM users ORDER BY created_at DESC").all();
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
  const rows = db.prepare("SELECT id, name, owner_user_id, created_at FROM shops ORDER BY created_at DESC").all();
  res.json({ data: rows });
});

app.post("/api/v1/shops", (req, res) => {
  const { name, ownerUserId } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO shops (id, name, owner_user_id) VALUES (?, ?, ?)").run(id, name, ownerUserId || null);
  res.status(201).json({ data: { id, name, ownerUserId: ownerUserId || null } });
});

app.get("/api/v1/vin-lookups", (req, res) => {
  const { vin } = req.query;
  let rows = [];
  if (vin) {
    rows = db
      .prepare("SELECT id, vin, source, payload_json, created_at FROM vin_lookups WHERE vin = ? ORDER BY created_at DESC")
      .all(String(vin));
  } else {
    rows = db.prepare("SELECT id, vin, source, payload_json, created_at FROM vin_lookups ORDER BY created_at DESC").all();
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
  const rows = db.prepare("SELECT id, vin_lookup_id, summary, created_at FROM reports ORDER BY created_at DESC").all();
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

app.get("/api/v1/compliance", (req, res) => {
  res.json({ data: getComplianceStatus() });
});

app.post("/api/v1/compliance", (req, res) => {
  const { rate, lastAudit, openFindings, nextReview } = req.body || {};
  if (!rate || !lastAudit || openFindings === undefined || !nextReview) {
    return res.status(400).json({ error: "rate, lastAudit, openFindings, and nextReview are required" });
  }
  db.prepare(
    "INSERT INTO compliance_status (id, rate, last_audit, open_findings, next_review, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now')) " +
      "ON CONFLICT(id) DO UPDATE SET rate=excluded.rate, last_audit=excluded.last_audit, open_findings=excluded.open_findings, next_review=excluded.next_review, updated_at=datetime('now')"
  ).run("default", rate, lastAudit, Number(openFindings), nextReview);
  res.status(200).json({ data: { rate, lastAudit, openFindings: Number(openFindings), nextReview } });
});

app.post("/api/v1/compliance/reports", (req, res) => {
  const { summary, payload } = req.body || {};
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO compliance_reports (id, status, summary, payload_json) VALUES (?, ?, ?, ?)").run(
    id,
    "generated",
    summary || "Compliance report generated",
    payload ? JSON.stringify(payload) : null
  );
  res.status(201).json({ data: { id, status: "generated", summary: summary || "Compliance report generated" } });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal server error" });
});

app.listen(port, () => {
  console.log(`RepairBridge backend listening on http://localhost:${port}`);
});
