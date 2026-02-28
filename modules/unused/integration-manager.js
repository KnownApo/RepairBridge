/**
 * Cross-Module Integration System
 * Manages communication and data flow between all modules
 * Author: RepairBridge Development Team
 * Version: 1.0.0
 */

class IntegrationManager {
    constructor() {
        this.modules = new Map();
        this.eventBus = new EventTarget();
        this.dataSync = new Map();
        this.workflows = new Map();
        this.integrationCallbacks = new Map();
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventBus();
        this.setupDataSynchronization();
        this.setupWorkflowIntegration();
        this.setupCrossModuleCallbacks();
        this.setupRealTimeUpdates();
        this.registerModules();
        this.createIntegrationWorkflows();
        
        this.isInitialized = true;
        console.log('Integration Manager initialized successfully');
    }

    setupEventBus() {
        // Central event bus for module communication
        this.eventBus.addEventListener('module-action', (event) => {
            this.handleModuleAction(event.detail);
        });

        this.eventBus.addEventListener('data-updated', (event) => {
            this.handleDataUpdate(event.detail);
        });

        this.eventBus.addEventListener('workflow-trigger', (event) => {
            this.handleWorkflowTrigger(event.detail);
        });
    }

    setupDataSynchronization() {
        // Synchronize data between modules
        this.dataSync.set('vehicle-data', {
            sources: ['vehicle-lookup', 'diagnostics', 'fleet-manager'],
            targets: ['analytics', 'work-orders', 'inventory'],
            lastSync: null,
            syncInterval: 30000 // 30 seconds
        });

        this.dataSync.set('customer-data', {
            sources: ['user-manager', 'work-orders', 'marketplace'],
            targets: ['analytics', 'reporting', 'notifications'],
            lastSync: null,
            syncInterval: 60000 // 1 minute
        });

        this.dataSync.set('inventory-data', {
            sources: ['inventory-manager', 'marketplace'],
            targets: ['analytics', 'notifications', 'work-orders'],
            lastSync: null,
            syncInterval: 45000 // 45 seconds
        });

        this.dataSync.set('diagnostic-data', {
            sources: ['diagnostics', 'vehicle-lookup'],
            targets: ['analytics', 'work-orders', 'reporting', 'fleet-manager'],
            lastSync: null,
            syncInterval: 15000 // 15 seconds
        });

        // Start sync intervals
        this.dataSync.forEach((config, key) => {
            setInterval(() => {
                this.syncData(key);
            }, config.syncInterval);
        });
    }

    setupWorkflowIntegration() {
        // Define integrated workflows
        this.workflows.set('diagnostic-to-workorder', {
            trigger: 'diagnostic-complete',
            steps: [
                { module: 'diagnostics', action: 'get-diagnostic-data' },
                { module: 'work-orders', action: 'create-work-order' },
                { module: 'inventory', action: 'check-parts-availability' },
                { module: 'notifications', action: 'send-customer-notification' },
                { module: 'analytics', action: 'update-diagnostic-stats' }
            ]
        });

        this.workflows.set('marketplace-to-inventory', {
            trigger: 'order-placed',
            steps: [
                { module: 'marketplace', action: 'get-order-details' },
                { module: 'inventory', action: 'update-stock-levels' },
                { module: 'notifications', action: 'send-stock-alert' },
                { module: 'analytics', action: 'update-sales-stats' }
            ]
        });

        this.workflows.set('fleet-maintenance-workflow', {
            trigger: 'maintenance-due',
            steps: [
                { module: 'fleet-manager', action: 'get-maintenance-schedule' },
                { module: 'work-orders', action: 'create-maintenance-order' },
                { module: 'inventory', action: 'reserve-parts' },
                { module: 'notifications', action: 'notify-technicians' },
                { module: 'analytics', action: 'track-maintenance-metrics' }
            ]
        });

        this.workflows.set('compliance-reporting-workflow', {
            trigger: 'compliance-check',
            steps: [
                { module: 'audit-manager', action: 'collect-compliance-data' },
                { module: 'reporting', action: 'generate-compliance-report' },
                { module: 'notifications', action: 'send-compliance-alerts' },
                { module: 'backup-manager', action: 'backup-compliance-data' }
            ]
        });
    }

    setupCrossModuleCallbacks() {
        // Register callbacks for cross-module communication
        this.integrationCallbacks.set('vehicle-selected', [
            { module: 'diagnostics', callback: 'loadVehicleData' },
            { module: 'fleet-manager', callback: 'updateVehicleInfo' },
            { module: 'analytics', callback: 'trackVehicleAccess' }
        ]);

        this.integrationCallbacks.set('diagnostic-complete', [
            { module: 'work-orders', callback: 'createFromDiagnostic' },
            { module: 'inventory', callback: 'checkPartsAvailability' },
            { module: 'analytics', callback: 'updateDiagnosticStats' },
            { module: 'notifications', callback: 'sendCustomerUpdate' }
        ]);

        this.integrationCallbacks.set('order-placed', [
            { module: 'inventory', callback: 'updateStockLevels' },
            { module: 'analytics', callback: 'updateSalesStats' },
            { module: 'notifications', callback: 'sendOrderConfirmation' }
        ]);

        this.integrationCallbacks.set('inventory-low', [
            { module: 'notifications', callback: 'sendLowStockAlert' },
            { module: 'analytics', callback: 'trackStockLevels' },
            { module: 'marketplace', callback: 'updateAvailability' }
        ]);

        this.integrationCallbacks.set('user-action', [
            { module: 'audit-manager', callback: 'logUserAction' },
            { module: 'analytics', callback: 'trackUserBehavior' }
        ]);
    }

    setupRealTimeUpdates() {
        // Real-time data updates between modules
        this.realTimeUpdates = {
            vehicleStatus: new Map(),
            inventoryLevels: new Map(),
            diagnosticSessions: new Map(),
            userActivities: new Map()
        };

        // Update intervals
        setInterval(() => {
            this.broadcastRealTimeUpdates();
        }, 5000); // Every 5 seconds
    }

    registerModules() {
        // Register all available modules
        const moduleNames = [
            'vehicle-lookup',
            'diagnostics',
            'marketplace',
            'analytics',
            'user-manager',
            'work-orders',
            'inventory',
            'notifications',
            'reporting',
            'help-system',
            'settings',
            'backup-manager',
            'audit-manager',
            'api-manager',
            'fleet-manager'
        ];

        moduleNames.forEach(name => {
            this.registerModule(name);
        });
    }

    registerModule(name) {
        const module = {
            name: name,
            status: 'active',
            lastActivity: Date.now(),
            dependencies: this.getModuleDependencies(name),
            callbacks: new Map()
        };

        this.modules.set(name, module);
        console.log(`Module ${name} registered successfully`);
    }

    getModuleDependencies(moduleName) {
        const dependencies = {
            'vehicle-lookup': ['analytics', 'audit-manager'],
            'diagnostics': ['vehicle-lookup', 'work-orders', 'inventory', 'analytics'],
            'marketplace': ['inventory', 'analytics', 'notifications', 'user-manager'],
            'analytics': ['diagnostics', 'marketplace', 'work-orders', 'inventory', 'fleet-manager'],
            'user-manager': ['audit-manager', 'notifications', 'settings'],
            'work-orders': ['diagnostics', 'inventory', 'user-manager', 'analytics'],
            'inventory': ['marketplace', 'work-orders', 'notifications', 'analytics'],
            'notifications': ['user-manager', 'analytics', 'settings'],
            'reporting': ['analytics', 'audit-manager', 'backup-manager'],
            'help-system': ['settings', 'analytics'],
            'settings': ['user-manager', 'notifications', 'backup-manager'],
            'backup-manager': ['audit-manager', 'settings'],
            'audit-manager': ['user-manager', 'reporting'],
            'api-manager': ['audit-manager', 'settings'],
            'fleet-manager': ['vehicle-lookup', 'diagnostics', 'work-orders', 'analytics']
        };

        return dependencies[moduleName] || [];
    }

    createIntegrationWorkflows() {
        // Vehicle Service Workflow
        this.createWorkflow('vehicle-service-workflow', [
            { step: 'vehicle-lookup', action: 'search-vehicle' },
            { step: 'diagnostics', action: 'perform-scan' },
            { step: 'work-orders', action: 'create-order' },
            { step: 'inventory', action: 'check-parts' },
            { step: 'marketplace', action: 'order-parts' },
            { step: 'notifications', action: 'update-customer' },
            { step: 'analytics', action: 'track-completion' }
        ]);

        // Fleet Maintenance Workflow
        this.createWorkflow('fleet-maintenance-workflow', [
            { step: 'fleet-manager', action: 'schedule-maintenance' },
            { step: 'work-orders', action: 'create-maintenance-order' },
            { step: 'inventory', action: 'reserve-parts' },
            { step: 'notifications', action: 'notify-technicians' },
            { step: 'analytics', action: 'track-maintenance' }
        ]);

        // Compliance Audit Workflow
        this.createWorkflow('compliance-audit-workflow', [
            { step: 'audit-manager', action: 'start-audit' },
            { step: 'reporting', action: 'generate-audit-report' },
            { step: 'backup-manager', action: 'backup-audit-data' },
            { step: 'notifications', action: 'send-compliance-alerts' }
        ]);
    }

    createWorkflow(name, steps) {
        this.workflows.set(name, {
            steps: steps,
            status: 'ready',
            lastExecution: null,
            executionCount: 0
        });
    }

    // Event handling methods
    handleModuleAction(actionData) {
        const { module, action, data } = actionData;
        
        // Log action for audit purposes
        this.logAction(module, action, data);
        
        // Trigger related callbacks
        this.triggerCallbacks(action, data);
        
        // Update real-time data
        this.updateRealTimeData(module, action, data);
        
        // Check for workflow triggers
        this.checkWorkflowTriggers(action, data);
    }

    handleDataUpdate(updateData) {
        const { source, type, data } = updateData;
        
        // Broadcast to interested modules
        this.broadcastDataUpdate(source, type, data);
        
        // Update analytics
        this.updateAnalytics(source, type, data);
        
        // Trigger notifications if needed
        this.checkNotificationTriggers(source, type, data);
    }

    handleWorkflowTrigger(triggerData) {
        const { workflow, data } = triggerData;
        
        if (this.workflows.has(workflow)) {
            this.executeWorkflow(workflow, data);
        }
    }

    // Core integration methods
    emitEvent(eventType, data) {
        const event = new CustomEvent(eventType, { detail: data });
        this.eventBus.dispatchEvent(event);
    }

    triggerCallbacks(action, data) {
        if (this.integrationCallbacks.has(action)) {
            const callbacks = this.integrationCallbacks.get(action);
            callbacks.forEach(({ module, callback }) => {
                this.executeCallback(module, callback, data);
            });
        }
    }

    executeCallback(moduleName, callbackName, data) {
        try {
            const moduleInstance = this.getModuleInstance(moduleName);
            if (moduleInstance && typeof moduleInstance[callbackName] === 'function') {
                moduleInstance[callbackName](data);
            }
        } catch (error) {
            console.error(`Error executing callback ${callbackName} on module ${moduleName}:`, error);
        }
    }

    getModuleInstance(moduleName) {
        // Map module names to their global instances
        const moduleInstances = {
            'vehicle-lookup': window.vehicleLookupManager,
            'diagnostics': window.diagnosticManager,
            'marketplace': window.marketplaceManager,
            'analytics': window.analyticsManager,
            'user-manager': window.userManager,
            'work-orders': window.workOrderManager,
            'inventory': window.inventoryManager,
            'notifications': window.notificationManager,
            'reporting': window.reportingSystem,
            'help-system': window.helpSystem,
            'settings': window.settingsManager,
            'backup-manager': window.backupManager,
            'audit-manager': window.auditManager,
            'api-manager': window.apiManager,
            'fleet-manager': window.fleetManager
        };

        return moduleInstances[moduleName];
    }

    syncData(dataType) {
        const config = this.dataSync.get(dataType);
        if (!config) return;

        const sourceData = this.collectSourceData(config.sources);
        this.distributeData(config.targets, dataType, sourceData);
        config.lastSync = Date.now();
    }

    collectSourceData(sources) {
        const data = {};
        sources.forEach(source => {
            const moduleInstance = this.getModuleInstance(source);
            if (moduleInstance && typeof moduleInstance.getData === 'function') {
                data[source] = moduleInstance.getData();
            }
        });
        return data;
    }

    distributeData(targets, dataType, data) {
        targets.forEach(target => {
            const moduleInstance = this.getModuleInstance(target);
            if (moduleInstance && typeof moduleInstance.receiveData === 'function') {
                moduleInstance.receiveData(dataType, data);
            }
        });
    }

    executeWorkflow(workflowName, data) {
        const workflow = this.workflows.get(workflowName);
        if (!workflow) return;

        workflow.status = 'running';
        workflow.lastExecution = Date.now();
        workflow.executionCount++;

        const executeStep = (stepIndex) => {
            if (stepIndex >= workflow.steps.length) {
                workflow.status = 'completed';
                console.log(`Workflow ${workflowName} completed successfully`);
                return;
            }

            const step = workflow.steps[stepIndex];
            const moduleInstance = this.getModuleInstance(step.module);
            
            if (moduleInstance && typeof moduleInstance[step.action] === 'function') {
                try {
                    const result = moduleInstance[step.action](data);
                    
                    // If the action returns a promise, wait for it
                    if (result && typeof result.then === 'function') {
                        result.then(() => {
                            executeStep(stepIndex + 1);
                        }).catch(error => {
                            console.error(`Error in workflow ${workflowName} step ${stepIndex}:`, error);
                            workflow.status = 'error';
                        });
                    } else {
                        executeStep(stepIndex + 1);
                    }
                } catch (error) {
                    console.error(`Error in workflow ${workflowName} step ${stepIndex}:`, error);
                    workflow.status = 'error';
                }
            } else {
                console.warn(`Module ${step.module} or action ${step.action} not found`);
                executeStep(stepIndex + 1);
            }
        };

        executeStep(0);
    }

    broadcastRealTimeUpdates() {
        // Broadcast real-time updates to all modules
        this.realTimeUpdates.forEach((data, type) => {
            this.emitEvent('real-time-update', { type, data });
        });
    }

    updateRealTimeData(module, action, data) {
        // Update real-time data based on module actions
        switch (action) {
            case 'vehicle-selected':
                this.realTimeUpdates.vehicleStatus.set(data.vin, data);
                break;
            case 'diagnostic-started':
                this.realTimeUpdates.diagnosticSessions.set(data.sessionId, data);
                break;
            case 'inventory-updated':
                this.realTimeUpdates.inventoryLevels.set(data.itemId, data);
                break;
            case 'user-login':
                this.realTimeUpdates.userActivities.set(data.userId, data);
                break;
        }
    }

    logAction(module, action, data) {
        // Log all actions for audit trail
        const logEntry = {
            timestamp: Date.now(),
            module: module,
            action: action,
            data: data,
            user: this.getCurrentUser()
        };

        // Store in audit manager if available
        const auditManager = this.getModuleInstance('audit-manager');
        if (auditManager && typeof auditManager.logAction === 'function') {
            auditManager.logAction(logEntry);
        }

        // Store locally as backup
        const logs = JSON.parse(localStorage.getItem('integration_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('integration_logs', JSON.stringify(logs));
    }

    getCurrentUser() {
        const userManager = this.getModuleInstance('user-manager');
        if (userManager && typeof userManager.getCurrentUser === 'function') {
            return userManager.getCurrentUser();
        }
        return { id: 'unknown', name: 'Unknown User' };
    }

    broadcastDataUpdate(source, type, data) {
        // Broadcast data updates to interested modules
        this.modules.forEach((module, name) => {
            if (module.dependencies.includes(source)) {
                const moduleInstance = this.getModuleInstance(name);
                if (moduleInstance && typeof moduleInstance.onDataUpdate === 'function') {
                    moduleInstance.onDataUpdate(source, type, data);
                }
            }
        });
    }

    updateAnalytics(source, type, data) {
        // Update analytics with cross-module data
        const analyticsManager = this.getModuleInstance('analytics');
        if (analyticsManager && typeof analyticsManager.updateFromIntegration === 'function') {
            analyticsManager.updateFromIntegration(source, type, data);
        }
    }

    checkNotificationTriggers(source, type, data) {
        // Check if any notifications should be triggered
        const notificationManager = this.getModuleInstance('notifications');
        if (notificationManager && typeof notificationManager.checkTriggers === 'function') {
            notificationManager.checkTriggers(source, type, data);
        }
    }

    checkWorkflowTriggers(action, data) {
        // Check if any workflows should be triggered
        this.workflows.forEach((workflow, name) => {
            if (workflow.trigger === action) {
                this.executeWorkflow(name, data);
            }
        });
    }

    // Public API methods
    registerCallback(event, module, callback) {
        if (!this.integrationCallbacks.has(event)) {
            this.integrationCallbacks.set(event, []);
        }
        this.integrationCallbacks.get(event).push({ module, callback });
    }

    triggerEvent(event, data) {
        this.emitEvent('module-action', { module: 'external', action: event, data });
    }

    getModuleStatus(moduleName) {
        return this.modules.get(moduleName) || { status: 'not-found' };
    }

    getIntegrationStats() {
        return {
            totalModules: this.modules.size,
            activeWorkflows: Array.from(this.workflows.values()).filter(w => w.status === 'running').length,
            totalCallbacks: Array.from(this.integrationCallbacks.values()).reduce((sum, callbacks) => sum + callbacks.length, 0),
            lastSync: Math.max(...Array.from(this.dataSync.values()).map(config => config.lastSync || 0))
        };
    }

    // Cleanup method
    cleanup() {
        // Clean up event listeners and intervals
        this.modules.clear();
        this.workflows.clear();
        this.integrationCallbacks.clear();
        this.dataSync.clear();
        this.realTimeUpdates = {};
        
        console.log('Integration Manager cleaned up');
    }
}

// Initialize integration manager globally
window.integrationManager = new IntegrationManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrationManager;
}
