/**
 * Vehicle Lookup Module
 * Handles vehicle data search and retrieval functionality
 */

// Basic HTML sanitizer to prevent injection attacks
function sanitizeHTML(str) {
    return String(str).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// Recursively sanitize all string properties of an object
function sanitizeObject(obj) {
    if (typeof obj === 'string') {
        return sanitizeHTML(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
    }
    return obj;
}

class VehicleLookup {
    constructor() {
        this.searchResults = [];
        this.currentVehicle = null;
        this.initializeLookup();
    }

    /**
     * Initialize the vehicle lookup system
     */
    initializeLookup() {
        this.setupSearchHandlers();
        this.setupResultsDisplay();
    }

    /**
     * Setup search event handlers
     */
    setupSearchHandlers() {
        const searchButton = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        const searchSelect = document.querySelector('.search-select');

        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    /**
     * Setup results display area
     */
    setupResultsDisplay() {
        const searchSection = document.querySelector('.data-search');
        
        if (searchSection) {
            // Create results container
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            resultsContainer.innerHTML = `
                <div class="results-header" style="display: none;">
                    <h4>Search Results</h4>
                    <button class="clear-results-btn">
                        <i class="fas fa-times"></i>
                        Clear Results
                    </button>
                </div>
                <div class="results-list"></div>
            `;
            
            searchSection.appendChild(resultsContainer);

            // Setup clear results handler
            const clearBtn = resultsContainer.querySelector('.clear-results-btn');
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }
    }

    /**
     * Perform vehicle search
     */
    async performSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchSelect = document.querySelector('.search-select');

        // Ensure search elements exist before accessing their values
        if (!searchInput || !searchSelect) {
            console.error('Search input elements not found');
            return;
        }

        const query = searchInput.value.trim();
        const makeFilter = searchSelect.value;

        if (!query) {
            showNotification('Please enter a VIN or License Plate', 'warning');
            return;
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Perform search
            const results = this.searchVehicle(query, makeFilter);
            
            if (results.length > 0) {
                this.displayResults(results);
                showNotification(`Found ${results.length} matching vehicle(s)`, 'success');
            } else {
                this.showNoResults();
                showNotification('No vehicles found matching your search', 'warning');
            }
        } catch (error) {
            console.error('Search error:', error);
            showNotification('Search failed. Please try again.', 'error');
        }
    }

    /**
     * Search for vehicle by VIN or license plate
     */
    searchVehicle(query, makeFilter) {
        let results = [];
        
        // Check if query is a license plate
        if (licensePlateDatabase[query.toUpperCase()]) {
            const vin = licensePlateDatabase[query.toUpperCase()];
            const vehicle = vehicleDatabase[vin];
            if (vehicle) {
                results.push(vehicle);
            }
        }
        
        // Check if query is a VIN
        if (vehicleDatabase[query.toUpperCase()]) {
            const vehicle = vehicleDatabase[query.toUpperCase()];
            if (vehicle) {
                results.push(vehicle);
            }
        }

        // Search by partial VIN or other criteria
        if (results.length === 0) {
            results = Object.values(vehicleDatabase).filter(vehicle => {
                const queryLower = query.toLowerCase();
                const matchesQuery = 
                    vehicle.vin.toLowerCase().includes(queryLower) ||
                    vehicle.make.toLowerCase().includes(queryLower) ||
                    vehicle.model.toLowerCase().includes(queryLower) ||
                    vehicle.year.toString().includes(queryLower);
                
                const matchesMake = makeFilter === 'All Makes' || vehicle.make === makeFilter;
                
                return matchesQuery && matchesMake;
            });
        }

        // Filter by make if specified
        if (makeFilter !== 'All Makes') {
            results = results.filter(vehicle => vehicle.make === makeFilter);
        }

        return results;
    }

    /**
     * Display search results
     */
    displayResults(results) {
        const resultsContainer = document.querySelector('.results-list');
        const resultsHeader = document.querySelector('.results-header');
        
        if (!resultsContainer || !resultsHeader) return;

        resultsHeader.style.display = 'flex';
        resultsContainer.innerHTML = '';

        results.forEach((vehicle, index) => {
            const resultItem = this.createResultItem(vehicle, index);
            resultsContainer.appendChild(resultItem);
        });

        // Store results for later use
        this.searchResults = results;
    }

    /**
     * Create individual result item
     */
    createResultItem(vehicle, index) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        const safeVehicle = sanitizeObject(vehicle);
        const hasActiveCodes = safeVehicle.diagnosticCodes && safeVehicle.diagnosticCodes.length > 0;
        const statusClass = hasActiveCodes ? 'warning' : 'success';
        const statusText = hasActiveCodes ? 'Needs Attention' : 'Good';

        resultItem.innerHTML = `
            <div class="result-header">
                <div class="vehicle-info">
                    <h4>${safeVehicle.year} ${safeVehicle.make} ${safeVehicle.model}</h4>
                    <p class="vin">VIN: ${safeVehicle.vin}</p>
                    <p class="details">${safeVehicle.engine} • ${safeVehicle.mileage.toLocaleString()} miles</p>
                </div>
                <div class="result-actions">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                    <button class="view-details-btn" data-index="${index}">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                </div>
            </div>
            <div class="result-summary">
                <div class="summary-item">
                    <i class="fas fa-user"></i>
                    <span>Owner: ${safeVehicle.owner.name}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-wrench"></i>
                    <span>Last Service: ${safeVehicle.serviceHistory.length > 0 ? safeVehicle.serviceHistory[0].date : 'No records'}</span>
                </div>
                <div class="summary-item">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Diagnostic Codes: ${safeVehicle.diagnosticCodes.length}</span>
                </div>
            </div>
        `;

        // Add click handler for view details
        const viewDetailsBtn = resultItem.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', () => {
            this.showVehicleDetails(vehicle);
        });

        return resultItem;
    }

    /**
     * Show detailed vehicle information
     */
    showVehicleDetails(vehicle) {
        this.currentVehicle = sanitizeObject(vehicle);

        // Create modal for vehicle details
        const modal = this.createDetailsModal(this.currentVehicle);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    /**
     * Create vehicle details modal
     */
    createDetailsModal(vehicle) {
        const modal = document.createElement('div');
        modal.className = 'vehicle-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${vehicle.year} ${vehicle.make} ${vehicle.model}</h3>
                    <button class="close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="vehicle-tabs">
                        <button class="tab-btn active" data-tab="overview">Overview</button>
                        <button class="tab-btn" data-tab="diagnostics">Diagnostics</button>
                        <button class="tab-btn" data-tab="service">Service History</button>
                        <button class="tab-btn" data-tab="specifications">Specifications</button>
                    </div>
                    
                    <div class="tab-content">
                        <div class="tab-panel active" id="overview">
                            ${this.generateOverviewTab(vehicle)}
                        </div>
                        <div class="tab-panel" id="diagnostics">
                            ${this.generateDiagnosticsTab(vehicle)}
                        </div>
                        <div class="tab-panel" id="service">
                            ${this.generateServiceTab(vehicle)}
                        </div>
                        <div class="tab-panel" id="specifications">
                            ${this.generateSpecificationsTab(vehicle)}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="print-btn">
                        <i class="fas fa-print"></i>
                        Print Report
                    </button>
                    <button class="start-diagnostic-btn">
                        <i class="fas fa-wrench"></i>
                        Start Diagnostic
                    </button>
                </div>
            </div>
        `;

        // Setup modal event handlers
        this.setupModalHandlers(modal);
        
        return modal;
    }

    /**
     * Generate overview tab content
     */
    generateOverviewTab(vehicle) {
        return `
            <div class="overview-grid">
                <div class="info-card">
                    <h4>Vehicle Information</h4>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="label">VIN:</span>
                            <span class="value">${vehicle.vin}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Engine:</span>
                            <span class="value">${vehicle.engine}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Transmission:</span>
                            <span class="value">${vehicle.transmission}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Drivetrain:</span>
                            <span class="value">${vehicle.drivetrain}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Color:</span>
                            <span class="value">${vehicle.color}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Mileage:</span>
                            <span class="value">${vehicle.mileage.toLocaleString()} miles</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <h4>Owner Information</h4>
                    <div class="info-list">
                        <div class="info-item">
                            <span class="label">Name:</span>
                            <span class="value">${vehicle.owner.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Phone:</span>
                            <span class="value">${vehicle.owner.phone}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Email:</span>
                            <span class="value">${vehicle.owner.email}</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-card">
                    <h4>Current Status</h4>
                    <div class="status-summary">
                        <div class="status-item ${vehicle.diagnosticCodes.length > 0 ? 'warning' : 'success'}">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>${vehicle.diagnosticCodes.length} Active Codes</span>
                        </div>
                        <div class="status-item ${vehicle.recommendations.length > 0 ? 'info' : 'success'}">
                            <i class="fas fa-lightbulb"></i>
                            <span>${vehicle.recommendations.length} Recommendations</span>
                        </div>
                        <div class="status-item ${vehicle.recalls.length > 0 ? 'warning' : 'success'}">
                            <i class="fas fa-bell"></i>
                            <span>${vehicle.recalls.length} Open Recalls</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate diagnostics tab content
     */
    generateDiagnosticsTab(vehicle) {
        let diagnosticsHTML = `
            <div class="diagnostics-section">
                <h4>Diagnostic Trouble Codes</h4>
        `;

        if (vehicle.diagnosticCodes.length > 0) {
            diagnosticsHTML += `
                <div class="codes-list">
            `;
            
            vehicle.diagnosticCodes.forEach(code => {
                const dtcInfo = dtcDatabase[code.code] || {};
                diagnosticsHTML += `
                    <div class="code-item">
                        <div class="code-header">
                            <span class="code-number">${code.code}</span>
                            <span class="severity-badge ${code.severity.toLowerCase()}">${code.severity}</span>
                            <span class="status-badge ${code.status.toLowerCase()}">${code.status}</span>
                        </div>
                        <div class="code-description">
                            <p><strong>${code.description}</strong></p>
                            ${dtcInfo.causes ? `
                                <div class="code-details">
                                    <h5>Possible Causes:</h5>
                                    <ul>
                                        ${dtcInfo.causes.map(cause => `<li>${cause}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                            ${dtcInfo.solutions ? `
                                <div class="code-details">
                                    <h5>Recommended Solutions:</h5>
                                    <ul>
                                        ${dtcInfo.solutions.map(solution => `<li>${solution}</li>`).join('')}
                                    </ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            
            diagnosticsHTML += `</div>`;
        } else {
            diagnosticsHTML += `
                <div class="no-codes">
                    <i class="fas fa-check-circle"></i>
                    <p>No diagnostic trouble codes found</p>
                </div>
            `;
        }

        // Add recommendations section
        if (vehicle.recommendations.length > 0) {
            diagnosticsHTML += `
                <div class="recommendations-section">
                    <h4>Maintenance Recommendations</h4>
                    <div class="recommendations-list">
                        ${vehicle.recommendations.map(rec => `
                            <div class="recommendation-item">
                                <i class="fas fa-lightbulb"></i>
                                <span>${rec}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        diagnosticsHTML += `</div>`;
        return diagnosticsHTML;
    }

    /**
     * Generate service history tab content
     */
    generateServiceTab(vehicle) {
        let serviceHTML = `
            <div class="service-section">
                <h4>Service History</h4>
        `;

        if (vehicle.serviceHistory.length > 0) {
            serviceHTML += `
                <div class="service-timeline">
            `;
            
            vehicle.serviceHistory.forEach(service => {
                serviceHTML += `
                    <div class="service-item">
                        <div class="service-date">
                            <i class="fas fa-calendar"></i>
                            <span>${service.date}</span>
                        </div>
                        <div class="service-details">
                            <h5>${service.service}</h5>
                            <p>Mileage: ${service.mileage.toLocaleString()} miles</p>
                            <p>Shop: ${service.shop}</p>
                            <p class="service-cost">Cost: $${service.cost}</p>
                        </div>
                    </div>
                `;
            });
            
            serviceHTML += `</div>`;
        } else {
            serviceHTML += `
                <div class="no-service">
                    <i class="fas fa-info-circle"></i>
                    <p>No service history available</p>
                </div>
            `;
        }

        // Add warranties section
        if (vehicle.warranties.length > 0) {
            serviceHTML += `
                <div class="warranties-section">
                    <h4>Active Warranties</h4>
                    <div class="warranties-list">
                        ${vehicle.warranties.map(warranty => `
                            <div class="warranty-item">
                                <div class="warranty-type">${warranty.type}</div>
                                <div class="warranty-details">
                                    <p>Expires: ${warranty.expires}</p>
                                    <p>Coverage: ${warranty.coverage}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        serviceHTML += `</div>`;
        return serviceHTML;
    }

    /**
     * Generate specifications tab content
     */
    generateSpecificationsTab(vehicle) {
        const specs = vehicle.specifications;
        return `
            <div class="specifications-section">
                <h4>Vehicle Specifications</h4>
                <div class="specs-grid">
                    <div class="spec-card">
                        <h5>Engine & Performance</h5>
                        <div class="spec-list">
                            <div class="spec-item">
                                <span class="spec-label">Fuel Type:</span>
                                <span class="spec-value">${specs.fuelType}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Fuel Capacity:</span>
                                <span class="spec-value">${specs.fuelCapacity}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">City MPG:</span>
                                <span class="spec-value">${specs.mpgCity}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Highway MPG:</span>
                                <span class="spec-value">${specs.mpgHighway}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="spec-card">
                        <h5>Capacity & Towing</h5>
                        <div class="spec-list">
                            <div class="spec-item">
                                <span class="spec-label">Towing Capacity:</span>
                                <span class="spec-value">${specs.towingCapacity}</span>
                            </div>
                            <div class="spec-item">
                                <span class="spec-label">Payload Capacity:</span>
                                <span class="spec-value">${specs.payloadCapacity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Setup modal event handlers
     */
    setupModalHandlers(modal) {
        // Close modal handlers
        const closeBtn = modal.querySelector('.close-modal-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        closeBtn.addEventListener('click', () => this.closeModal(modal));
        backdrop.addEventListener('click', () => this.closeModal(modal));

        // Tab switching
        const tabBtns = modal.querySelectorAll('.tab-btn');
        const tabPanels = modal.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and target panel
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });

        // Action buttons
        const printBtn = modal.querySelector('.print-btn');
        const diagnosticBtn = modal.querySelector('.start-diagnostic-btn');
        
        printBtn.addEventListener('click', () => this.printReport());
        diagnosticBtn.addEventListener('click', () => this.startDiagnostic());
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    /**
     * Print vehicle report
     */
    printReport() {
        if (!this.currentVehicle) return;
        
        showNotification('Generating printable report...', 'info');
        
        // Create print window
        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintReport(this.currentVehicle);
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
            showNotification('Report generated successfully', 'success');
        }, 500);
    }

    /**
     * Generate print report HTML
     */
    generatePrintReport(vehicle) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Vehicle Report - ${vehicle.year} ${vehicle.make} ${vehicle.model}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .section h3 { color: #333; border-bottom: 2px solid #4facfe; padding-bottom: 5px; }
                    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    .info-table th, .info-table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                    .info-table th { background-color: #f8f9fa; }
                    .code-item { margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; }
                    .service-item { margin-bottom: 10px; padding: 10px; background-color: #f8f9fa; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>RepairBridge Vehicle Report</h1>
                    <h2>${vehicle.year} ${vehicle.make} ${vehicle.model}</h2>
                    <p>VIN: ${vehicle.vin}</p>
                    <p>Generated: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="section">
                    <h3>Vehicle Information</h3>
                    <table class="info-table">
                        <tr><th>Engine</th><td>${vehicle.engine}</td></tr>
                        <tr><th>Transmission</th><td>${vehicle.transmission}</td></tr>
                        <tr><th>Drivetrain</th><td>${vehicle.drivetrain}</td></tr>
                        <tr><th>Color</th><td>${vehicle.color}</td></tr>
                        <tr><th>Mileage</th><td>${vehicle.mileage.toLocaleString()} miles</td></tr>
                    </table>
                </div>
                
                <div class="section">
                    <h3>Diagnostic Codes</h3>
                    ${vehicle.diagnosticCodes.length > 0 ? 
                        vehicle.diagnosticCodes.map(code => `
                            <div class="code-item">
                                <strong>${code.code}</strong> - ${code.description}
                                <br>Severity: ${code.severity} | Status: ${code.status}
                            </div>
                        `).join('') : 
                        '<p>No diagnostic codes found</p>'
                    }
                </div>
                
                <div class="section">
                    <h3>Service History</h3>
                    ${vehicle.serviceHistory.length > 0 ? 
                        vehicle.serviceHistory.map(service => `
                            <div class="service-item">
                                <strong>${service.date}</strong> - ${service.service}
                                <br>Mileage: ${service.mileage.toLocaleString()} miles | Cost: $${service.cost}
                                <br>Shop: ${service.shop}
                            </div>
                        `).join('') : 
                        '<p>No service history available</p>'
                    }
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Start diagnostic session
     */
    startDiagnostic() {
        if (!this.currentVehicle) return;
        
        showNotification('Starting diagnostic session...', 'info');
        
        // Switch to diagnostics section
        document.querySelector('[data-section="ar-diagnostics"]').click();
        
        // Close modal
        const modal = document.querySelector('.vehicle-modal');
        if (modal) {
            this.closeModal(modal);
        }
        
        // Pre-populate diagnostic data
        this.populateDiagnosticData(this.currentVehicle);
        
        setTimeout(() => {
            showNotification('Diagnostic session started for ' + this.currentVehicle.year + ' ' + this.currentVehicle.make + ' ' + this.currentVehicle.model, 'success');
        }, 1000);
    }

    /**
     * Populate diagnostic data in AR section
     */
    populateDiagnosticData(vehicle) {
        // Update live data stream with vehicle data
        const dataValues = document.querySelectorAll('.data-value');
        dataValues.forEach(value => {
            const parent = value.parentElement;
            const label = parent.querySelector('.data-label').textContent;
            
            if (label.includes('Engine RPM')) {
                value.textContent = '0'; // Engine off
            } else if (label.includes('Coolant')) {
                value.textContent = '72°F'; // Cold engine
            } else if (label.includes('Oil')) {
                value.textContent = '0 PSI'; // Engine off
            }
        });
        
        // Add vehicle info to diagnostic history
        const diagnosticList = document.querySelector('.diagnostic-list');
        if (diagnosticList) {
            const newItem = document.createElement('div');
            newItem.className = 'diagnostic-item';
            newItem.innerHTML = `
                <div class="diagnostic-info">
                    <h4>${vehicle.year} ${vehicle.make} ${vehicle.model}</h4>
                    <p>VIN: ${vehicle.vin}</p>
                    <small>Started now</small>
                </div>
                <div class="diagnostic-status">
                    <span class="status-badge warning">In Progress</span>
                    <button class="view-btn">Continue</button>
                </div>
            `;
            diagnosticList.insertBefore(newItem, diagnosticList.firstChild);
        }
    }

    /**
     * Clear search results
     */
    clearResults() {
        const resultsContainer = document.querySelector('.results-list');
        const resultsHeader = document.querySelector('.results-header');
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
        
        if (resultsHeader) {
            resultsHeader.style.display = 'none';
        }
        
        this.searchResults = [];
        this.currentVehicle = null;
        
        // Clear search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        showNotification('Search results cleared', 'info');
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        const searchButton = document.querySelector('.search-btn');
        if (searchButton) {
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            searchButton.disabled = true;
        }
        
        // Reset after search completes
        setTimeout(() => {
            if (searchButton) {
                searchButton.innerHTML = '<i class="fas fa-search"></i> Search';
                searchButton.disabled = false;
            }
        }, 2000);
    }

    /**
     * Show no results message
     */
    showNoResults() {
        const resultsContainer = document.querySelector('.results-list');
        const resultsHeader = document.querySelector('.results-header');
        
        if (resultsContainer && resultsHeader) {
            resultsHeader.style.display = 'flex';
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h4>No Results Found</h4>
                    <p>Try searching with a different VIN, license plate, or vehicle information.</p>
                </div>
            `;
        }
    }
}

// Initialize vehicle lookup when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof vehicleDatabase !== 'undefined') {
        window.vehicleLookup = new VehicleLookup();
    }
});
