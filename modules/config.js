/**
 * App Configuration
 * Allows override of API endpoints via localStorage.
 */

const RepairBridgeConfig = (() => {
  const defaultEndpoints = {
    backendBase: "http://localhost:5050",
    vinDecodeBase: "http://localhost:5050/api/v1/nhtsa/vin",
    recallsBase: "http://localhost:5050/api/v1/nhtsa/recalls",
    complaintsBase: "http://localhost:5050/api/v1/nhtsa/complaints",
    tsbsBase: "http://localhost:5050/api/v1/nhtsa/tsbs",
    makesBase: "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes",
    modelsForMakeBase: "https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake",
    laborEstimatesBase: "http://localhost:5050/api/v1/labor-estimates",
  };

  const storageKey = "rb_api_endpoints";

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      console.warn("Failed to load API endpoint overrides", err);
      return {};
    }
  }

  function getEndpoint(name) {
    const overrides = loadOverrides();
    return overrides[name] || defaultEndpoints[name];
  }

  function getEndpoints() {
    const overrides = loadOverrides();
    return { ...defaultEndpoints, ...overrides };
  }

  function setEndpoints(next = {}, { persist = true } = {}) {
    const merged = { ...defaultEndpoints, ...loadOverrides(), ...next };
    if (persist) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(merged));
      } catch (err) {
        console.warn("Failed to persist API endpoint overrides", err);
      }
    }
    return merged;
  }

  function resetEndpoints() {
    localStorage.removeItem(storageKey);
    return { ...defaultEndpoints };
  }

  return {
    defaultEndpoints,
    getEndpoint,
    getEndpoints,
    setEndpoints,
    resetEndpoints,
  };
})();

window.RepairBridgeConfig = RepairBridgeConfig;
