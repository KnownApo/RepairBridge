/**
 * Lightweight auth + persistence bridge
 * Creates a demo session, syncs with backend users/shops, and exposes session data.
 */

const RepairBridgeAuth = (() => {
  const STORAGE_KEY = "rb_auth_session";

  function getBackendBaseUrl() {
    if (typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.getEndpoint) {
      return RepairBridgeConfig.getEndpoint("backendBase");
    }
    return window.REPAIRBRIDGE_BACKEND_URL || "http://localhost:5050";
  }

  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("Auth session load failed", err);
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function buildDefaultSession() {
    const suffix =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10);
    return {
      email: `demo+${suffix}@repairbridge.local`,
      name: "Demo Shop Owner",
      shopName: "RepairBridge Demo Shop",
      plan: "Starter",
      status: "active",
      createdAt: new Date().toISOString(),
    };
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return response.json();
  }

  async function ensureBackendUser(session) {
    const baseUrl = getBackendBaseUrl();
    if (!baseUrl) return session;

    try {
      if (session.userId) return session;

      const list = await fetchJson(`${baseUrl}/api/v1/users`);
      const users = list?.data || [];
      const match = users.find(
        (user) => String(user.email).toLowerCase() === session.email.toLowerCase()
      );
      if (match) {
        session.userId = match.id;
        session.name = session.name || match.name || session.name;
        return session;
      }

      const created = await fetchJson(`${baseUrl}/api/v1/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.email, name: session.name }),
      });
      session.userId = created?.data?.id || session.userId;
    } catch (err) {
      console.warn("Backend user sync failed", err);
    }
    return session;
  }

  async function ensureBackendShop(session) {
    const baseUrl = getBackendBaseUrl();
    if (!baseUrl) return session;

    try {
      if (session.shopId) return session;

      const list = await fetchJson(`${baseUrl}/api/v1/shops`);
      const shops = list?.data || [];
      const match = shops.find((shop) => {
        if (session.userId && shop.owner_user_id === session.userId) return true;
        return shop.name && shop.name.toLowerCase() === session.shopName.toLowerCase();
      });
      if (match) {
        session.shopId = match.id;
        session.shopName = session.shopName || match.name;
        return session;
      }

      const created = await fetchJson(`${baseUrl}/api/v1/shops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: session.shopName, ownerUserId: session.userId || null }),
      });
      session.shopId = created?.data?.id || session.shopId;
    } catch (err) {
      console.warn("Backend shop sync failed", err);
    }

    return session;
  }

  function updateAccountPanel(session) {
    if (window.RepairBridgeData?.updateAccountData) {
      window.RepairBridgeData.updateAccountData({
        owner: session.name,
        shop: session.shopName,
        plan: session.plan,
        status: session.status,
      });
    }
  }

  let currentSession = null;

  async function initializeAuth() {
    currentSession = loadSession() || buildDefaultSession();
    saveSession(currentSession);

    currentSession = await ensureBackendUser(currentSession);
    currentSession = await ensureBackendShop(currentSession);
    saveSession(currentSession);
    updateAccountPanel(currentSession);

    return currentSession;
  }

  function getSession() {
    return currentSession || loadSession();
  }

  function updateSession(patch = {}) {
    currentSession = {
      ...(getSession() || {}),
      ...patch,
    };
    saveSession(currentSession);
    updateAccountPanel(currentSession);
    return currentSession;
  }

  return {
    initializeAuth,
    getSession,
    updateSession,
  };
})();

if (typeof window !== "undefined") {
  window.RepairBridgeAuth = RepairBridgeAuth;
}
