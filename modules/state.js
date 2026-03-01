/**
 * Centralized app state store
 */

const RepairBridgeState = (() => {
  let state = {
    appData: null,
    cart: [],
    isARActive: false,
    lastVinReport: null,
  };

  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(patch) {
    const nextPatch = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...nextPatch };
    listeners.forEach((listener) => listener(state));
    return state;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
})();

if (typeof window !== "undefined") {
  window.RepairBridgeState = RepairBridgeState;
}
