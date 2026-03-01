/**
 * UI + Interaction Handlers (Facade)
 * Delegates to service-based modules under RepairBridgeServices.
 */

const RepairBridgeServices = window.RepairBridgeServices || {};

function initializeNavigation() {
    return RepairBridgeServices.navigation?.initializeNavigation();
}

function initializeInteractiveComponents() {
    return RepairBridgeServices.interaction?.initializeInteractiveComponents();
}

function initializeDataRefresh() {
    return RepairBridgeServices.dataRefresh?.initializeDataRefresh();
}

function initializeARControls() {
    return RepairBridgeServices.ar?.initializeARControls();
}

function initializeMarketplace() {
    return RepairBridgeServices.marketplace?.initializeMarketplace();
}

function initializeCompliance() {
    return RepairBridgeServices.compliance?.initializeCompliance();
}

function initializeCompetitiveFeatures() {
    return RepairBridgeServices.competitive?.initializeCompetitiveFeatures();
}

function setupVoiceContextTracking() {
    return RepairBridgeServices.voice?.setupVoiceContextTracking();
}

function showWelcomeMessage() {
    return RepairBridgeServices.navigation?.showWelcomeMessage();
}

function showSection(sectionId) {
    return RepairBridgeServices.section?.showSection(sectionId);
}

function quickAction(action) {
    return RepairBridgeServices.legacyActions?.quickAction(action);
}

function updateLiveData() {
    return RepairBridgeServices.legacyActions?.updateLiveData();
}

function refreshData() {
    return RepairBridgeServices.legacyActions?.refreshData();
}

function toggleAR() {
    return RepairBridgeServices.ar?.toggleAR();
}

function startARSession() {
    return RepairBridgeServices.ar?.startARSession();
}

function stopARSession() {
    return RepairBridgeServices.ar?.stopARSession();
}

function updateDataSources() {
    return RepairBridgeServices.dataRefresh?.updateDataSources();
}

function handleQuickAction(action) {
    return RepairBridgeServices.interaction?.handleQuickAction(action);
}

function showNotification(message, type) {
    return RepairBridgeServices.notification?.showNotification(message, type);
}

window.showSection = showSection;
window.startARSession = startARSession;
window.stopARSession = stopARSession;
window.quickAction = quickAction;
window.updateLiveData = updateLiveData;
window.refreshData = refreshData;
window.toggleAR = toggleAR;
