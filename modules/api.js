/**
 * API + Caching Layer
 * Lightweight wrapper for fetch with in-memory TTL cache + rate limiting.
 */

const RepairBridgeAPI = (() => {
  const cache = new Map();
  const defaultTTL = 5 * 60 * 1000;

  const rateLimiter = (() => {
    const queue = [];
    let active = 0;
    let lastStart = 0;
    let settings = {
      minIntervalMs: 350,
      maxConcurrent: 1,
    };

    function setRateLimit(next = {}) {
      settings = { ...settings, ...next };
      return { ...settings };
    }

    function getRateLimit() {
      return { ...settings };
    }

    function schedule(task, overrides = {}) {
      const minIntervalMs = Number.isFinite(overrides.rateLimitMs)
        ? overrides.rateLimitMs
        : settings.minIntervalMs;

      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject, minIntervalMs, timer: null });
        pump();
      });
    }

    function pump() {
      if (active >= settings.maxConcurrent) return;
      if (queue.length === 0) return;

      const job = queue[0];
      const wait = Math.max(0, job.minIntervalMs - (Date.now() - lastStart));

      if (wait > 0) {
        if (!job.timer) {
          job.timer = setTimeout(() => {
            job.timer = null;
            pump();
          }, wait);
        }
        return;
      }

      queue.shift();
      active += 1;
      lastStart = Date.now();

      Promise.resolve()
        .then(job.task)
        .then(job.resolve)
        .catch(job.reject)
        .finally(() => {
          active -= 1;
          pump();
        });
    }

    return {
      schedule,
      setRateLimit,
      getRateLimit,
    };
  })();

  function getCacheEntry(key, ttlMs) {
    if (!cache.has(key)) return null;
    const entry = cache.get(key);
    if (!entry) return null;
    if (ttlMs <= 0) return null;
    if (Date.now() - entry.ts > ttlMs) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  }

  function setCacheEntry(key, data) {
    cache.set(key, { ts: Date.now(), data });
  }

  async function getJson(url, options = {}) {
    const {
      ttlMs = defaultTTL,
      cacheKey = url,
      fetchOptions = { cache: "no-store" },
      rateLimitMs,
    } = options;

    const cached = getCacheEntry(cacheKey, ttlMs);
    if (cached !== null) return cached;

    const res = await rateLimiter.schedule(() => fetch(url, fetchOptions), { rateLimitMs });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (ttlMs > 0) setCacheEntry(cacheKey, data);
    return data;
  }

  async function getText(url, options = {}) {
    const {
      ttlMs = defaultTTL,
      cacheKey = url,
      fetchOptions = { cache: "no-store" },
      rateLimitMs,
    } = options;

    const cached = getCacheEntry(cacheKey, ttlMs);
    if (cached !== null) return cached;

    const res = await rateLimiter.schedule(() => fetch(url, fetchOptions), { rateLimitMs });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.text();
    if (ttlMs > 0) setCacheEntry(cacheKey, data);
    return data;
  }

  function clearCache(prefix) {
    if (!prefix) {
      cache.clear();
      return;
    }
    for (const key of cache.keys()) {
      if (String(key).startsWith(prefix)) cache.delete(key);
    }
  }

  return {
    getJson,
    getText,
    clearCache,
    setRateLimit: rateLimiter.setRateLimit,
    getRateLimit: rateLimiter.getRateLimit,
  };
})();

window.RepairBridgeAPI = RepairBridgeAPI;
