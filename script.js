/**
 * RepairBridge Platform - JavaScript Controller (Bootstrap)
 * Loads UI + data + search modules
 */

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeApp().catch((err) => console.error("Initialization failed", err));
});

/**
 * Main application initialization function
 * Sets up event listeners and initializes components
 */
async function initializeApp() {
  console.log("RepairBridge Platform initializing...");

  if (window.RepairBridgeAuth?.initializeAuth) {
    await window.RepairBridgeAuth.initializeAuth();
  }

  // Initialize navigation system
  window.initializeNavigation?.();

  // Initialize interactive components
  window.initializeInteractiveComponents?.();

  // Initialize data refresh mechanisms
  window.initializeDataRefresh?.();

  // Initialize search functionality
  window.initializeSearch?.();

  // Load saved report history
  window.loadSavedReports?.();

  // Initialize AR controls
  window.initializeARControls?.();

  // Initialize marketplace functionality
  window.initializeMarketplace?.();

  // Initialize compliance tools
  window.initializeCompliance?.();

  // Initialize competitive features
  window.initializeCompetitiveFeatures?.();

  // Setup voice commands context tracking
  window.setupVoiceContextTracking?.();

  // Show welcome message
  window.showWelcomeMessage?.();

  // Load demo data and hydrate UI
  window.loadAppData?.();

  console.log("RepairBridge Platform initialized successfully!");
}
