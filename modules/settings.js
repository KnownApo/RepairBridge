/**
 * Settings Manager
 * Handles demo mode toggle and preferences.
 */

const settingsManager = (() => {
  const demoToggleId = "demo-mode-toggle";
  const demoStatusId = "demo-mode-status";
  const demoResetId = "demo-reset-btn";

  function getDemoToggle() {
    return document.getElementById(demoToggleId);
  }

  function getDemoStatus() {
    return document.getElementById(demoStatusId);
  }

  function getDemoResetButton() {
    return document.getElementById(demoResetId);
  }

  function getDemoModeState() {
    if (typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.isDemoMode) {
      return RepairBridgeConfig.isDemoMode();
    }
    return false;
  }

  function setDemoModeState(enabled) {
    if (typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.setDemoMode) {
      RepairBridgeConfig.setDemoMode(enabled);
    }
    if (typeof RepairBridgeState !== "undefined") {
      RepairBridgeState.setState({ demoMode: Boolean(enabled) });
    }
  }

  function updateDemoStatusLabel(enabled) {
    const status = getDemoStatus();
    if (!status) return;
    status.textContent = enabled ? "Demo mode active (mock data)" : "Live data enabled";
  }

  function updateToggleFromState() {
    const toggle = getDemoToggle();
    if (!toggle) return;
    const enabled = getDemoModeState();
    toggle.checked = enabled;
    updateDemoStatusLabel(enabled);
  }

  function handleDemoToggle(event) {
    const enabled = event.target.checked;
    setDemoModeState(enabled);
    updateDemoStatusLabel(enabled);

    if (typeof RepairBridgeAPI !== "undefined") {
      RepairBridgeAPI.clearCache("repairbridge");
    }

    if (typeof loadAppData === "function") {
      loadAppData();
    }

    if (typeof showNotification === "function") {
      showNotification(
        enabled ? "Demo mode enabled. Using mock vehicle data." : "Demo mode disabled. Using live data.",
        "info"
      );
    }
  }

  function bindToggle() {
    const toggle = getDemoToggle();
    if (!toggle || toggle.dataset.bound) return;
    toggle.dataset.bound = "true";
    toggle.addEventListener("change", handleDemoToggle);
  }

  function resetDemoData() {
    const confirmed = window.confirm(
      "Reset demo data? This clears cached demo info, saved reports, and search history."
    );
    if (!confirmed) return;

    if (typeof RepairBridgeAPI !== "undefined" && RepairBridgeAPI.clearCache) {
      RepairBridgeAPI.clearCache();
    }

    if (typeof clearSearchHistory === "function") {
      clearSearchHistory();
    } else {
      localStorage.removeItem("rb_search_history");
    }

    if (typeof clearSavedReports === "function") {
      clearSavedReports();
    } else {
      localStorage.removeItem("rb_saved_reports");
    }

    if (window.RepairBridgeServices?.cart?.clearCart) {
      window.RepairBridgeServices.cart.clearCart();
    } else {
      localStorage.removeItem("repairbridge_cart");
    }

    if (typeof loadAppData === "function") {
      loadAppData();
    }

    if (typeof showNotification === "function") {
      showNotification("Demo data cleared. Reloaded fresh mock data.", "success");
    }
  }

  function bindResetButton() {
    const resetButton = getDemoResetButton();
    if (!resetButton || resetButton.dataset.bound) return;
    resetButton.dataset.bound = "true";
    resetButton.addEventListener("click", resetDemoData);
  }

  function loadSettingsInterface() {
    updateToggleFromState();
    bindToggle();
    bindResetButton();
  }

  return {
    loadSettingsInterface,
  };
})();

window.settingsManager = settingsManager;
