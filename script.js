/**
 * RepairBridge Platform - JavaScript Controller (Bootstrap)
 * Loads UI + data + search modules
 */

// Global state
let cartItems = 0;
let isARActive = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp().catch(err => console.error('Initialization failed', err));
});

/**
 * Main application initialization function
 * Sets up event listeners and initializes components
 */
async function initializeApp() {
    console.log('RepairBridge Platform initializing...');

    if (window.RepairBridgeAuth?.initializeAuth) {
        await window.RepairBridgeAuth.initializeAuth();
    }

    // Initialize navigation system
    initializeNavigation();

    // Initialize interactive components
    initializeInteractiveComponents();

    // Initialize data refresh mechanisms
    initializeDataRefresh();

    // Initialize search functionality
    initializeSearch();

    // Load saved report history
    loadSavedReports();

    // Initialize AR controls
    initializeARControls();

    // Initialize marketplace functionality
    initializeMarketplace();

    // Initialize compliance tools
    initializeCompliance();

    // Initialize competitive features
    initializeCompetitiveFeatures();

    // Setup voice commands context tracking
    setupVoiceContextTracking();

    // Show welcome message
    showWelcomeMessage();

    // Load demo data and hydrate UI
    loadAppData();

    console.log('RepairBridge Platform initialized successfully!');
}
