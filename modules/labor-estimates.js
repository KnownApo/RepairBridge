/**
 * Labor Estimate Provider Adapter Interface
 *
 * Adapter shape:
 * {
 *   id: 'provider-id',
 *   name: 'Provider Name',
 *   priority: 100, // lower = preferred
 *   isAvailable?: async () => boolean,
 *   getEstimate: async ({ vinData, procedure, region, laborRate }) => ({
 *     laborHours: number,
 *     partsEstimate: number,
 *     totalEstimate: number,
 *     currency: 'USD',
 *     notes?: string,
 *     sourceUrl?: string,
 *     confidence?: 'low'|'medium'|'high'
 *   })
 * }
 */

const RepairBridgeLabor = (() => {
  const adapters = [];

  function normalizeAdapter(adapter = {}) {
    if (!adapter || typeof adapter !== "object") {
      throw new Error("Labor adapter must be an object");
    }
    const { id, name, getEstimate } = adapter;
    if (!id || !name) {
      throw new Error("Labor adapter requires id and name");
    }
    if (typeof getEstimate !== "function") {
      throw new Error(`Labor adapter ${id} must define getEstimate()`);
    }
    return {
      priority: 100,
      ...adapter,
    };
  }

  function registerAdapter(adapter) {
    const normalized = normalizeAdapter(adapter);
    const exists = adapters.find((item) => item.id === normalized.id);
    if (exists) {
      console.warn(`Labor adapter '${normalized.id}' already registered.`);
      return;
    }
    adapters.push(normalized);
    adapters.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  }

  function listAdapters() {
    return adapters.map((adapter) => ({
      id: adapter.id,
      name: adapter.name,
      priority: adapter.priority ?? 100,
    }));
  }

  function hasAdapters() {
    return adapters.length > 0;
  }

  async function getEstimate(context = {}) {
    if (!adapters.length) {
      return { status: "unavailable", reason: "No labor estimate adapters registered." };
    }

    let lastError = null;
    for (const adapter of adapters) {
      try {
        if (typeof adapter.isAvailable === "function") {
          const available = await adapter.isAvailable(context);
          if (!available) continue;
        }
        const estimate = await adapter.getEstimate(context);
        if (!estimate) continue;
        return {
          status: "ok",
          provider: adapter.id,
          providerName: adapter.name,
          ...estimate,
        };
      } catch (err) {
        lastError = err;
        console.warn(`Labor adapter '${adapter.id}' failed`, err);
      }
    }

    return {
      status: "unavailable",
      reason: "No labor estimate providers returned data.",
      lastError: lastError ? String(lastError) : undefined,
    };
  }

  return {
    registerAdapter,
    listAdapters,
    hasAdapters,
    getEstimate,
  };
})();

function getLaborEndpoint() {
  if (typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.getEndpoint) {
    return RepairBridgeConfig.getEndpoint("laborEstimatesBase");
  }
  return "http://localhost:5050/api/v1/labor-estimates";
}

async function fetchBackendEstimate(context = {}) {
  const endpoint = getLaborEndpoint();
  const payload = {
    vinData: context.vinData || null,
    procedure: context.procedure || null,
    region: context.region || null,
    laborRate: context.laborRate || null,
    mileage: context.mileage || null,
  };
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Labor estimate request failed: ${response.status}`);
  }
  const data = await response.json();
  return data?.data || null;
}

function getFallbackEstimate(context = {}) {
  const baseHours = context.procedure ? 2.5 : 2.0;
  const laborRate = Number(context.laborRate) || 125;
  const laborHours = Number(baseHours.toFixed(1));
  const partsEstimate = 160;
  const miscFees = Math.round(laborHours * laborRate * 0.04);
  const totalEstimate = Math.round(laborHours * laborRate + partsEstimate + miscFees);

  return {
    laborHours,
    laborHoursRange: [Math.max(0.5, laborHours - 0.5), laborHours + 0.7],
    laborRate,
    partsEstimate,
    partsEstimateRange: [120, 240],
    miscFees,
    totalEstimate,
    currency: "USD",
    confidence: "low",
    timeToComplete: `${Math.max(1, Math.round(laborHours))}-${Math.max(
      2,
      Math.round(laborHours + 1)
    )} hrs bay time`,
    sourcesUsed: ["fallback"],
    notes: "Fallback estimate. Connect the backend for calibrated ranges.",
  };
}

RepairBridgeLabor.registerAdapter({
  id: "backend-labor-engine",
  name: "RepairBridge Labor Engine",
  priority: 10,
  isAvailable: async () => {
    try {
      const endpoint = getLaborEndpoint();
      return Boolean(endpoint);
    } catch (err) {
      console.warn("Labor endpoint unavailable", err);
      return false;
    }
  },
  getEstimate: fetchBackendEstimate,
});

RepairBridgeLabor.registerAdapter({
  id: "fallback-estimator",
  name: "Fallback Estimator",
  priority: 99,
  getEstimate: async (context) => getFallbackEstimate(context),
});

window.RepairBridgeLabor = RepairBridgeLabor;
