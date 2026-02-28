/**
 * Diagnostic Module
 * Handles vehicle diagnostics, trouble code analysis, and repair recommendations
 */

class DiagnosticManager {
    constructor() {
        this.activeDiagnostics = [];
        this.diagnosticHistory = [];
        this.initializeDiagnostics();
    }

    /**
     * Initialize diagnostic system
     */
    initializeDiagnostics() {
        this.setupDiagnosticControls();
        this.setupRealtimeData();
        this.loadDiagnosticHistory();
        this.createDiagnosticInterface();
    }

    /**
     * Setup diagnostic controls
     */
    setupDiagnosticControls() {
        // Enhanced diagnostic interface (less AR-focused)
        const arViewport = document.querySelector('.ar-viewport');
        if (arViewport) {
            arViewport.innerHTML = `
                <div class="diagnostic-interface">
                    <div class="diagnostic-header">
                        <h3>Vehicle Diagnostic System</h3>
                        <button class="start-scan-btn">
                            <i class="fas fa-play"></i>
                            Start Diagnostic Scan
                        </button>
                    </div>
                    
                    <div class="diagnostic-tabs">
                        <button class="diag-tab-btn active" data-tab="scanner">OBD Scanner</button>
                        <button class="diag-tab-btn" data-tab="live-data">Live Data</button>
                        <button class="diag-tab-btn" data-tab="codes">Trouble Codes</button>
                        <button class="diag-tab-btn" data-tab="tests">System Tests</button>
                    </div>
                    
                    <div class="diagnostic-content">
                        <div class="diag-tab-panel active" id="scanner">
                            ${this.createScannerInterface()}
                        </div>
                        <div class="diag-tab-panel" id="live-data">
                            ${this.createLiveDataInterface()}
                        </div>
                        <div class="diag-tab-panel" id="codes">
                            ${this.createTroubleCodesInterface()}
                        </div>
                        <div class="diag-tab-panel" id="tests">
                            ${this.createSystemTestsInterface()}
                        </div>
                    </div>
                </div>
            `;
        }

        // Setup event handlers
        this.setupDiagnosticEventHandlers();
    }

    /**
     * Create scanner interface
     */
    createScannerInterface() {
        return `
            <div class="scanner-interface">
                <div class="scanner-status">
                    <div class="status-indicator disconnected">
                        <i class="fas fa-unlink"></i>
                        <span>Scanner Disconnected</span>
                    </div>
                    <button class="connect-scanner-btn">
                        <i class="fas fa-plug"></i>
                        Connect Scanner
                    </button>
                </div>
                
                <div class="scanner-controls" style="display: none;">
                    <div class="vehicle-info-input">
                        <h4>Vehicle Information</h4>
                        <div class="input-group">
                            <label>VIN:</label>
                            <input type="text" id="diagnostic-vin" placeholder="Enter VIN">
                        </div>
                        <div class="input-group">
                            <label>Year:</label>
                            <input type="number" id="diagnostic-year" placeholder="Year">
                        </div>
                        <div class="input-group">
                            <label>Make:</label>
                            <input type="text" id="diagnostic-make" placeholder="Make">
                        </div>
                        <div class="input-group">
                            <label>Model:</label>
                            <input type="text" id="diagnostic-model" placeholder="Model">
                        </div>
                    </div>
                    
                    <div class="scan-actions">
                        <button class="scan-btn" data-scan-type="quick">
                            <i class="fas fa-bolt"></i>
                            Quick Scan
                        </button>
                        <button class="scan-btn" data-scan-type="full">
                            <i class="fas fa-search"></i>
                            Full System Scan
                        </button>
                        <button class="scan-btn" data-scan-type="emissions">
                            <i class="fas fa-leaf"></i>
                            Emissions Test
                        </button>
                    </div>
                </div>
                
                <div class="scan-results" style="display: none;">
                    <h4>Scan Results</h4>
                    <div class="results-summary">
                        <div class="summary-stat">
                            <span class="stat-label">Codes Found:</span>
                            <span class="stat-value" id="codes-count">0</span>
                        </div>
                        <div class="summary-stat">
                            <span class="stat-label">Systems Checked:</span>
                            <span class="stat-value" id="systems-count">0</span>
                        </div>
                        <div class="summary-stat">
                            <span class="stat-label">Readiness Status:</span>
                            <span class="stat-value" id="readiness-status">Unknown</span>
                        </div>
                    </div>
                    <div class="results-list" id="scan-results-list"></div>
                </div>
            </div>
        `;
    }

    /**
     * Create live data interface
     */
    createLiveDataInterface() {
        return `
            <div class="live-data-interface">
                <div class="data-controls">
                    <button class="data-control-btn active" data-system="engine">Engine</button>
                    <button class="data-control-btn" data-system="transmission">Transmission</button>
                    <button class="data-control-btn" data-system="abs">ABS/Brakes</button>
                    <button class="data-control-btn" data-system="airbag">Airbag</button>
                    <button class="data-control-btn" data-system="climate">Climate</button>
                </div>
                
                <div class="data-display">
                    <div class="data-grid" id="live-data-grid">
                        <!-- Live data will be populated here -->
                    </div>
                </div>
                
                <div class="data-recording">
                    <button class="record-btn">
                        <i class="fas fa-record-vinyl"></i>
                        Start Recording
                    </button>
                    <button class="snapshot-btn">
                        <i class="fas fa-camera"></i>
                        Take Snapshot
                    </button>
                    <button class="export-btn">
                        <i class="fas fa-download"></i>
                        Export Data
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create trouble codes interface
     */
    createTroubleCodesInterface() {
        return `
            <div class="trouble-codes-interface">
                <div class="codes-controls">
                    <button class="codes-control-btn active" data-type="all">All Codes</button>
                    <button class="codes-control-btn" data-type="pending">Pending</button>
                    <button class="codes-control-btn" data-type="confirmed">Confirmed</button>
                    <button class="codes-control-btn" data-type="permanent">Permanent</button>
                </div>
                
                <div class="codes-actions">
                    <button class="clear-codes-btn">
                        <i class="fas fa-eraser"></i>
                        Clear Codes
                    </button>
                    <button class="refresh-codes-btn">
                        <i class="fas fa-sync"></i>
                        Refresh
                    </button>
                </div>
                
                <div class="codes-list" id="trouble-codes-list">
                    <!-- Trouble codes will be populated here -->
                </div>
            </div>
        `;
    }

    /**
     * Create system tests interface
     */
    createSystemTestsInterface() {
        return `
            <div class="system-tests-interface">
                <div class="test-categories">
                    <div class="test-category">
                        <h4>Engine Tests</h4>
                        <div class="test-buttons">
                            <button class="test-btn" data-test="compression">Compression Test</button>
                            <button class="test-btn" data-test="fuel-pressure">Fuel Pressure</button>
                            <button class="test-btn" data-test="ignition">Ignition System</button>
                        </div>
                    </div>
                    
                    <div class="test-category">
                        <h4>Transmission Tests</h4>
                        <div class="test-buttons">
                            <button class="test-btn" data-test="shift-solenoid">Shift Solenoids</button>
                            <button class="test-btn" data-test="pressure-test">Pressure Test</button>
                            <button class="test-btn" data-test="torque-converter">Torque Converter</button>
                        </div>
                    </div>
                    
                    <div class="test-category">
                        <h4>Brake Tests</h4>
                        <div class="test-buttons">
                            <button class="test-btn" data-test="abs-pump">ABS Pump</button>
                            <button class="test-btn" data-test="brake-fluid">Brake Fluid</button>
                            <button class="test-btn" data-test="parking-brake">Parking Brake</button>
                        </div>
                    </div>
                </div>
                
                <div class="test-results" id="test-results">
                    <!-- Test results will be shown here -->
                </div>
            </div>
        `;
    }

    /**
     * Setup diagnostic event handlers
     */
    setupDiagnosticEventHandlers() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('diag-tab-btn')) {
                this.switchDiagnosticTab(e.target);
            }
        });

        // Scanner controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.connect-scanner-btn')) {
                this.connectScanner();
            }
            if (e.target.closest('.scan-btn')) {
                const scanType = e.target.closest('.scan-btn').dataset.scanType;
                this.startScan(scanType);
            }
        });

        // Live data controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('data-control-btn')) {
                this.switchDataSystem(e.target);
            }
            if (e.target.closest('.record-btn')) {
                this.toggleRecording();
            }
            if (e.target.closest('.snapshot-btn')) {
                this.takeSnapshot();
            }
            if (e.target.closest('.export-btn')) {
                this.exportData();
            }
        });

        // Trouble codes controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('codes-control-btn')) {
                this.filterTroubleCodes(e.target);
            }
            if (e.target.closest('.clear-codes-btn')) {
                this.clearTroubleCodes();
            }
            if (e.target.closest('.refresh-codes-btn')) {
                this.refreshTroubleCodes();
            }
        });

        // System tests
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('test-btn')) {
                const testType = e.target.dataset.test;
                this.runSystemTest(testType);
            }
        });
    }

    /**
     * Switch diagnostic tab
     */
    switchDiagnosticTab(tabBtn) {
        const targetTab = tabBtn.dataset.tab;
        
        // Remove active class from all tabs and panels
        document.querySelectorAll('.diag-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.diag-tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked tab and target panel
        tabBtn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    /**
     * Connect scanner
     */
    connectScanner() {
        const statusIndicator = document.querySelector('.scanner-status .status-indicator');
        const connectBtn = document.querySelector('.connect-scanner-btn');
        const scannerControls = document.querySelector('.scanner-controls');
        
        // Show connecting state
        statusIndicator.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>Connecting...</span>
        `;
        connectBtn.disabled = true;
        
        // Simulate connection
        setTimeout(() => {
            statusIndicator.className = 'status-indicator connected';
            statusIndicator.innerHTML = `
                <i class="fas fa-link"></i>
                <span>Scanner Connected</span>
            `;
            connectBtn.style.display = 'none';
            scannerControls.style.display = 'block';
            
            showNotification('OBD Scanner connected successfully', 'success');
        }, 2000);
    }

    /**
     * Start diagnostic scan
     */
    startScan(scanType) {
        const scanResults = document.querySelector('.scan-results');
        const resultsList = document.getElementById('scan-results-list');
        
        // Show scanning state
        showNotification(`Starting ${scanType} scan...`, 'info');
        
        // Simulate scan process
        setTimeout(() => {
            const results = this.generateScanResults(scanType);
            this.displayScanResults(results);
            scanResults.style.display = 'block';
            
            showNotification(`${scanType} scan completed`, 'success');
        }, 3000);
    }

    /**
     * Generate mock scan results
     */
    generateScanResults(scanType) {
        const baseResults = {
            codesFound: 0,
            systemsChecked: 0,
            readinessStatus: 'Ready',
            codes: []
        };

        switch (scanType) {
            case 'quick':
                baseResults.systemsChecked = 8;
                baseResults.codesFound = Math.floor(Math.random() * 3);
                break;
            case 'full':
                baseResults.systemsChecked = 15;
                baseResults.codesFound = Math.floor(Math.random() * 5);
                break;
            case 'emissions':
                baseResults.systemsChecked = 6;
                baseResults.codesFound = Math.floor(Math.random() * 2);
                baseResults.readinessStatus = Math.random() > 0.3 ? 'Ready' : 'Not Ready';
                break;
        }

        // Generate random codes
        const availableCodes = Object.keys(dtcDatabase);
        for (let i = 0; i < baseResults.codesFound; i++) {
            const randomCode = availableCodes[Math.floor(Math.random() * availableCodes.length)];
            const codeInfo = dtcDatabase[randomCode];
            baseResults.codes.push({
                code: randomCode,
                description: codeInfo.description,
                status: Math.random() > 0.5 ? 'Confirmed' : 'Pending',
                severity: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low'
            });
        }

        return baseResults;
    }

    /**
     * Display scan results
     */
    displayScanResults(results) {
        // Update summary
        document.getElementById('codes-count').textContent = results.codesFound;
        document.getElementById('systems-count').textContent = results.systemsChecked;
        document.getElementById('readiness-status').textContent = results.readinessStatus;

        // Update results list
        const resultsList = document.getElementById('scan-results-list');
        resultsList.innerHTML = '';

        if (results.codes.length === 0) {
            resultsList.innerHTML = `
                <div class="no-codes-found">
                    <i class="fas fa-check-circle"></i>
                    <h4>No Diagnostic Codes Found</h4>
                    <p>Vehicle systems are operating normally</p>
                </div>
            `;
        } else {
            results.codes.forEach(code => {
                const codeItem = document.createElement('div');
                codeItem.className = 'result-code-item';
                codeItem.innerHTML = `
                    <div class="code-header">
                        <span class="code-number">${code.code}</span>
                        <span class="severity-badge ${code.severity.toLowerCase()}">${code.severity}</span>
                        <span class="status-badge ${code.status.toLowerCase()}">${code.status}</span>
                    </div>
                    <div class="code-description">
                        <p>${code.description}</p>
                        <button class="view-details-btn" onclick="diagnosticManager.showCodeDetails('${code.code}')">
                            <i class="fas fa-info-circle"></i>
                            View Details
                        </button>
                    </div>
                `;
                resultsList.appendChild(codeItem);
            });
        }
    }

    /**
     * Show code details
     */
    showCodeDetails(codeNumber) {
        const codeInfo = dtcDatabase[codeNumber];
        if (!codeInfo) return;

        const modal = document.createElement('div');
        modal.className = 'code-details-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Code Details: ${codeNumber}</h3>
                    <button class="close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="code-info">
                        <h4>Description</h4>
                        <p>${codeInfo.description}</p>
                        
                        <h4>Possible Causes</h4>
                        <ul>
                            ${codeInfo.causes.map(cause => `<li>${cause}</li>`).join('')}
                        </ul>
                        
                        <h4>Recommended Solutions</h4>
                        <ul>
                            ${codeInfo.solutions.map(solution => `<li>${solution}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="close-btn">Close</button>
                    <button class="create-workorder-btn">Create Work Order</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup modal handlers
        const closeBtn = modal.querySelector('.close-modal-btn');
        const closeFooterBtn = modal.querySelector('.close-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        const workOrderBtn = modal.querySelector('.create-workorder-btn');
        
        [closeBtn, closeFooterBtn, backdrop].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => document.body.removeChild(modal), 300);
            });
        });

        workOrderBtn.addEventListener('click', () => {
            this.createWorkOrder(codeNumber, codeInfo);
            modal.classList.remove('active');
            setTimeout(() => document.body.removeChild(modal), 300);
        });

        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);
    }

    /**
     * Create work order
     */
    createWorkOrder(codeNumber, codeInfo) {
        const workOrder = {
            id: 'WO-' + Date.now(),
            code: codeNumber,
            description: codeInfo.description,
            estimatedTime: Math.floor(Math.random() * 4) + 1 + ' hours',
            estimatedCost: '$' + (Math.floor(Math.random() * 300) + 100),
            priority: Math.random() > 0.5 ? 'High' : 'Medium',
            created: new Date().toISOString()
        };

        // Save work order (in real app, this would go to a database)
        const workOrders = JSON.parse(localStorage.getItem('repairbridge_workorders') || '[]');
        workOrders.push(workOrder);
        localStorage.setItem('repairbridge_workorders', JSON.stringify(workOrders));

        showNotification(`Work order ${workOrder.id} created successfully`, 'success');
    }

    /**
     * Switch data system
     */
    switchDataSystem(systemBtn) {
        const system = systemBtn.dataset.system;
        
        // Remove active class from all buttons
        document.querySelectorAll('.data-control-btn').forEach(btn => btn.classList.remove('active'));
        systemBtn.classList.add('active');
        
        // Update live data display
        this.updateLiveDataDisplay(system);
    }

    /**
     * Update live data display
     */
    updateLiveDataDisplay(system) {
        const dataGrid = document.getElementById('live-data-grid');
        const systemData = this.getSystemData(system);
        
        dataGrid.innerHTML = '';
        
        systemData.forEach(data => {
            const dataItem = document.createElement('div');
            dataItem.className = 'data-item';
            dataItem.innerHTML = `
                <div class="data-label">${data.label}</div>
                <div class="data-value ${data.status}">${data.value}</div>
                <div class="data-unit">${data.unit}</div>
            `;
            dataGrid.appendChild(dataItem);
        });
    }

    /**
     * Get system data
     */
    getSystemData(system) {
        const systemData = {
            engine: [
                { label: 'Engine RPM', value: Math.floor(Math.random() * 1000) + 800, unit: 'RPM', status: 'normal' },
                { label: 'Coolant Temp', value: Math.floor(Math.random() * 20) + 180, unit: '°F', status: 'normal' },
                { label: 'Oil Pressure', value: Math.floor(Math.random() * 20) + 30, unit: 'PSI', status: 'normal' },
                { label: 'Intake Air Temp', value: Math.floor(Math.random() * 30) + 70, unit: '°F', status: 'normal' },
                { label: 'Fuel Pressure', value: Math.floor(Math.random() * 10) + 40, unit: 'PSI', status: 'normal' },
                { label: 'Throttle Position', value: Math.floor(Math.random() * 30) + 10, unit: '%', status: 'normal' }
            ],
            transmission: [
                { label: 'Trans Temp', value: Math.floor(Math.random() * 30) + 160, unit: '°F', status: 'normal' },
                { label: 'Line Pressure', value: Math.floor(Math.random() * 50) + 150, unit: 'PSI', status: 'normal' },
                { label: 'Torque Conv RPM', value: Math.floor(Math.random() * 500) + 1000, unit: 'RPM', status: 'normal' },
                { label: 'Current Gear', value: Math.floor(Math.random() * 4) + 1, unit: '', status: 'normal' }
            ],
            abs: [
                { label: 'Wheel Speed FL', value: Math.floor(Math.random() * 20) + 40, unit: 'MPH', status: 'normal' },
                { label: 'Wheel Speed FR', value: Math.floor(Math.random() * 20) + 40, unit: 'MPH', status: 'normal' },
                { label: 'Wheel Speed RL', value: Math.floor(Math.random() * 20) + 40, unit: 'MPH', status: 'normal' },
                { label: 'Wheel Speed RR', value: Math.floor(Math.random() * 20) + 40, unit: 'MPH', status: 'normal' },
                { label: 'Brake Pressure', value: Math.floor(Math.random() * 500) + 100, unit: 'PSI', status: 'normal' }
            ],
            airbag: [
                { label: 'Driver Airbag', value: 'Ready', unit: '', status: 'normal' },
                { label: 'Passenger Airbag', value: 'Ready', unit: '', status: 'normal' },
                { label: 'Side Airbags', value: 'Ready', unit: '', status: 'normal' },
                { label: 'Seat Belt Status', value: 'Fastened', unit: '', status: 'normal' }
            ],
            climate: [
                { label: 'AC Pressure', value: Math.floor(Math.random() * 50) + 200, unit: 'PSI', status: 'normal' },
                { label: 'Evap Temp', value: Math.floor(Math.random() * 20) + 35, unit: '°F', status: 'normal' },
                { label: 'Blend Door Pos', value: Math.floor(Math.random() * 80) + 20, unit: '%', status: 'normal' },
                { label: 'Blower Speed', value: Math.floor(Math.random() * 80) + 20, unit: '%', status: 'normal' }
            ]
        };

        return systemData[system] || [];
    }

    /**
     * Setup realtime data updates
     */
    setupRealtimeData() {
        setInterval(() => {
            if (document.querySelector('.data-control-btn.active')) {
                const activeSystem = document.querySelector('.data-control-btn.active').dataset.system;
                this.updateLiveDataDisplay(activeSystem);
            }
        }, 1000);
    }

    /**
     * Toggle recording
     */
    toggleRecording() {
        const recordBtn = document.querySelector('.record-btn');
        const isRecording = recordBtn.classList.contains('recording');
        
        if (isRecording) {
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i class="fas fa-record-vinyl"></i> Start Recording';
            showNotification('Data recording stopped', 'info');
        } else {
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
            showNotification('Data recording started', 'info');
        }
    }

    /**
     * Take snapshot
     */
    takeSnapshot() {
        const timestamp = new Date().toISOString();
        showNotification(`Data snapshot saved at ${timestamp}`, 'success');
    }

    /**
     * Export data
     */
    exportData() {
        showNotification('Exporting diagnostic data...', 'info');
        
        setTimeout(() => {
            showNotification('Data exported successfully', 'success');
        }, 2000);
    }

    /**
     * Run system test
     */
    runSystemTest(testType) {
        const testResults = document.getElementById('test-results');
        
        showNotification(`Running ${testType} test...`, 'info');
        
        // Simulate test
        setTimeout(() => {
            const result = this.generateTestResult(testType);
            this.displayTestResult(result);
            
            showNotification(`${testType} test completed`, 'success');
        }, 3000);
    }

    /**
     * Generate test result
     */
    generateTestResult(testType) {
        const results = {
            'compression': {
                name: 'Compression Test',
                status: Math.random() > 0.3 ? 'Pass' : 'Fail',
                details: 'Cylinder pressures: 150, 148, 152, 149 PSI',
                recommendation: 'All cylinders within acceptable range'
            },
            'fuel-pressure': {
                name: 'Fuel Pressure Test',
                status: Math.random() > 0.2 ? 'Pass' : 'Fail',
                details: 'Fuel pressure: 45 PSI at idle, 52 PSI at WOT',
                recommendation: 'Fuel pressure within specifications'
            },
            'abs-pump': {
                name: 'ABS Pump Test',
                status: Math.random() > 0.1 ? 'Pass' : 'Fail',
                details: 'Pump activation successful, pressure buildup normal',
                recommendation: 'ABS system functioning properly'
            }
        };

        return results[testType] || {
            name: testType,
            status: 'Pass',
            details: 'Test completed successfully',
            recommendation: 'System operating normally'
        };
    }

    /**
     * Display test result
     */
    displayTestResult(result) {
        const testResults = document.getElementById('test-results');
        
        const resultItem = document.createElement('div');
        resultItem.className = 'test-result-item';
        resultItem.innerHTML = `
            <div class="test-result-header">
                <h4>${result.name}</h4>
                <span class="test-status ${result.status.toLowerCase()}">${result.status}</span>
            </div>
            <div class="test-result-details">
                <p><strong>Details:</strong> ${result.details}</p>
                <p><strong>Recommendation:</strong> ${result.recommendation}</p>
            </div>
        `;
        
        testResults.appendChild(resultItem);
    }

    /**
     * Load diagnostic history
     */
    loadDiagnosticHistory() {
        const history = JSON.parse(localStorage.getItem('repairbridge_diagnostics') || '[]');
        this.diagnosticHistory = history;
    }

    /**
     * Save diagnostic session
     */
    saveDiagnosticSession(sessionData) {
        this.diagnosticHistory.push(sessionData);
        localStorage.setItem('repairbridge_diagnostics', JSON.stringify(this.diagnosticHistory));
    }

    /**
     * Create diagnostic interface
     */
    createDiagnosticInterface() {
        // Initialize the enhanced diagnostic interface
        this.setupRealtimeData();
        
        // Update live data display with engine data by default
        setTimeout(() => {
            this.updateLiveDataDisplay('engine');
        }, 1000);
    }
}

// Initialize diagnostic manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.diagnosticManager = new DiagnosticManager();
});
