/**
 * RepairBridge Platform - JavaScript Controller
 * Handles navigation, interactions, and dynamic content management
 * Author: RepairBridge Development Team
 * Version: 1.0.0
 */

// Global state
let cartItems = 0;
let isARActive = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Main application initialization function
 * Sets up event listeners and initializes components
 */
function initializeApp() {
    console.log('RepairBridge Platform initializing...');
    
    // Initialize navigation system
    initializeNavigation();
    
    // Initialize interactive components
    initializeInteractiveComponents();
    
    // Initialize data refresh mechanisms
    initializeDataRefresh();
    
    // Initialize search functionality
    initializeSearch();
    
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

/**
 * Data Loading
 * Fetches demo data and hydrates UI
 */
let appData = null;

async function loadAppData() {
    try {
        const res = await fetch('data/repairbridge.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load data');
        appData = await res.json();
    } catch (err) {
        console.warn('Falling back to built-in demo data:', err);
        appData = getFallbackData();
    }

    hydrateDashboard();
    hydrateDataAggregator();
    hydrateMarketplace();
    hydrateInventory();
    hydrateAnalytics();
    hydrateCompliance();
}

function getFallbackData() {
    return {
        stats: { vehicles: 150, sources: 10, diagnostics: 4, compliance: '98.7%' },
        recentActivity: [
            { text: '🔧 Honda Accord diagnostic completed', time: '1 hour ago' },
            { text: '📥 GM data feed synced', time: '2 hours ago' },
            { text: '✅ Compliance report generated', time: 'Today' }
        ],
        dataSources: [
            { name: 'Ford Motor Company', status: 'connected', lastSync: '8 min ago' },
            { name: 'General Motors', status: 'connected', lastSync: '12 min ago' },
            { name: 'Toyota Motor Corp', status: 'connected', lastSync: '10 min ago' },
            { name: 'BMW Group', status: 'disconnected', lastSync: 'Connection issue' }
        ],
        dataAnalytics: { quota: '80% of monthly quota', speed: '2.4s avg', connections: '3/4 active' },
        marketplace: [],
        inventory: { lowStock: [], suppliers: [] },
        analytics: { monthlyRevenue: '$38,200', jobsCompleted: 112, avgCycleTime: '2.1 days' },
        compliance: { lastAudit: '2026-02-01', openFindings: 1, nextReview: '2026-03-01' }
    };
}

function hydrateDashboard() {
    if (!appData) return;

    document.querySelectorAll('[data-stat]').forEach(el => {
        const key = el.getAttribute('data-stat');
        if (appData.stats && appData.stats[key] !== undefined) {
            el.textContent = appData.stats[key];
        }
    });

    const activityList = document.getElementById('activity-list');
    if (activityList && Array.isArray(appData.recentActivity)) {
        activityList.innerHTML = appData.recentActivity.map(item => (
            `<div class="activity-item"><span>${item.text}</span><small>${item.time}</small></div>`
        )).join('');
    }
}

function hydrateDataAggregator() {
    if (!appData) return;

    const list = document.getElementById('oem-source-list');
    if (list && Array.isArray(appData.dataSources)) {
        list.innerHTML = appData.dataSources.map(src => {
            const statusClass = src.status === 'connected' ? 'connected' : 'disconnected';
            const statusDot = src.status === 'connected' ? '🟢' : '🔴';
            return `
                <div class="source-item">
                    <span class="${statusClass}">${statusDot}</span>
                    <span>${src.name}</span>
                    <small>Last sync: ${src.lastSync}</small>
                </div>
            `;
        }).join('');
    }

    const metrics = document.getElementById('data-analytics-metrics');
    if (metrics && appData.dataAnalytics) {
        metrics.innerHTML = `
            <h4>Data Volume: ${appData.dataAnalytics.quota}</h4>
            <h4>Processing Speed: ${appData.dataAnalytics.speed}</h4>
            <h4>Active Connections: ${appData.dataAnalytics.connections}</h4>
        `;
    }
}

function hydrateMarketplace() {
    if (!appData || !Array.isArray(appData.marketplace)) return;
    const grid = document.getElementById('marketplace-grid');
    if (!grid || appData.marketplace.length === 0) return;

    grid.innerHTML = appData.marketplace.map(item => {
        const discountPct = Math.round(100 - (item.discount / item.original) * 100);
        return `
            <div class="marketplace-item">
                <div class="item-info">
                    <h4>🧰 ${item.name}</h4>
                    <p>${item.desc}</p>
                    <div class="price-info">
                        <span class="original-price">$${item.original}</span>
                        <span class="discount-price">$${item.discount}</span>
                        <span class="discount-badge">${discountPct}% OFF</span>
                    </div>
                </div>
                <button type="button" class="add-to-cart-btn" onclick="addToCart('${item.name}', '$${item.discount}')">
                    🛒 Add to Cart
                </button>
            </div>
        `;
    }).join('');
}

function hydrateInventory() {
    if (!appData || !appData.inventory) return;
    const panel = document.getElementById('inventory-panel');
    if (!panel) return;

    const lowStock = appData.inventory.lowStock || [];
    const suppliers = appData.inventory.suppliers || [];

    panel.innerHTML = `
        <h3>Low Stock Alerts</h3>
        <div class="activity-list">
            ${lowStock.map(item => `<div class="activity-item"><span>${item.part}</span><small>Qty: ${item.qty}</small></div>`).join('')}
        </div>
        <h3 style="margin-top:16px;">Preferred Suppliers</h3>
        <div class="activity-list">
            ${suppliers.map(name => `<div class="activity-item"><span>${name}</span><small>Active</small></div>`).join('')}
        </div>
    `;
}

function hydrateAnalytics() {
    if (!appData || !appData.analytics) return;
    const panel = document.getElementById('analytics-panel');
    if (!panel) return;

    panel.innerHTML = `
        <h3>Monthly Revenue</h3>
        <p>${appData.analytics.monthlyRevenue}</p>
        <h3 style="margin-top:12px;">Jobs Completed</h3>
        <p>${appData.analytics.jobsCompleted}</p>
        <h3 style="margin-top:12px;">Avg Cycle Time</h3>
        <p>${appData.analytics.avgCycleTime}</p>
    `;
}

function hydrateCompliance() {
    if (!appData || !appData.compliance) return;
    const panel = document.getElementById('compliance-panel');
    if (!panel) return;

    panel.innerHTML = `
        <h3>Last Audit</h3>
        <p>${appData.compliance.lastAudit}</p>
        <h3 style="margin-top:12px;">Open Findings</h3>
        <p>${appData.compliance.openFindings}</p>
        <h3 style="margin-top:12px;">Next Review</h3>
        <p>${appData.compliance.nextReview}</p>
    `;
}

// Section loaders (used by navigation)
function loadDashboardData() { hydrateDashboard(); }
function loadDataAggregatorContent() { hydrateDataAggregator(); }
function loadARDiagnostics() { /* placeholder for future camera binding */ }
function loadComplianceContent() { hydrateCompliance(); }

/**
 * Navigation System
 * Handles section switching and active state management
 */
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            console.log('Navigation button clicked:', targetSection);
            
            // Use the enhanced showSection function
            showSection(targetSection);
        });
    });
    
    console.log('Navigation system initialized with', navButtons.length, 'buttons');
}

/**
 * Interactive Components Initialization
 * Sets up dynamic behaviors for various UI elements
 */
function initializeInteractiveComponents() {
    
    // Quick action buttons (skip inline onclick to avoid double-handling)
    const quickActionButtons = document.querySelectorAll('.action-btn');
    quickActionButtons.forEach(button => {
        if (button.getAttribute('onclick')) return;
        button.addEventListener('click', function() {
            const action = this.dataset.action || this.textContent.trim();
            handleQuickAction(action);
        });
    });
    
    // Stat cards hover effects
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Marketplace item interactions
    const marketplaceItems = document.querySelectorAll('.marketplace-item');
    marketplaceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Data Refresh System
 * Handles automatic data updates and manual refresh actions
 */
function initializeDataRefresh() {
    
    // Auto-refresh data sources every 30 seconds
    setInterval(updateDataSources, 30000);
    
    // Manual refresh button
    const refreshButtons = document.querySelectorAll('.refresh-btn');
    refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.animation = 'spin 1s linear';
            updateDataSources();
            
            // Reset animation
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    });
    
    // Update real-time data streams
    setInterval(updateRealTimeData, 2000);
}

/**
 * Search Functionality
 * Handles vehicle data search and filtering
 */
function initializeSearch() {
    const searchButton = document.querySelector('.search-btn') || document.getElementById('search-btn');
    const searchInput = document.querySelector('.search-input') || document.getElementById('vehicle-search');
    const searchSelect = document.querySelector('.search-select') || document.getElementById('make-filter');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput ? searchInput.value.trim() : '';
            const make = searchSelect ? searchSelect.value : 'All Makes';
            
            if (query) {
                performVehicleSearch(query, make);
            } else {
                showNotification('Please enter a VIN or License Plate', 'warning');
            }
        });
    }
    
    // Enable search on Enter key
    if (searchInput && searchButton) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}

/**
 * AR Controls System
 * Manages augmented reality interface controls
 */
function initializeARControls() {
    const arStartButton = document.querySelector('.ar-start-btn');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');
    
    if (arStartButton) {
        arStartButton.addEventListener('click', function() {
            startARSession();
        });
    }
    
    // Handle overlay toggles
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const overlayType = this.parentElement.textContent.trim();
            toggleAROverlay(overlayType, this.checked);
        });
    });
}

/**
 * Marketplace System
 * Handles marketplace interactions and cart management
 */
function initializeMarketplace() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterMarketplaceItems(category);
        });
    });
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.marketplace-item');
            const itemName = item.querySelector('h4').textContent;
            const itemPrice = item.querySelector('.discount-price').textContent;
            
            addToCart(itemName, itemPrice);
        });
    });
}

/**
 * Compliance Tools
 * Initializes compliance and security tools
 */
function initializeCompliance() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    const exportButton = document.querySelector('.export-btn');
    const manageSubscriptionBtn = document.querySelector('.manage-subscription-btn');
    
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const toolName = this.querySelector('span').textContent;
            launchComplianceTool(toolName);
        });
    });
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            exportTransactionLog();
        });
    }
    
    if (manageSubscriptionBtn) {
        manageSubscriptionBtn.addEventListener('click', function() {
            openSubscriptionManagement();
        });
    }
}

/**
 * Business Logic Functions
 */

/**
 * Handles quick action button clicks
 * @param {string} action - The action to perform
 */
function handleQuickAction(action) {
    switch(action) {
        case 'New Diagnostic':
            showNotification('Starting new diagnostic session...', 'info');
            // Navigate to AR diagnostics
            document.querySelector('[data-section="ar-diagnostics"]').click();
            break;
        case 'Sync Data':
            showNotification('Syncing data sources...', 'info');
            updateDataSources();
            break;
        case 'Generate Report':
            showNotification('Generating compliance report...', 'info');
            generateComplianceReport();
            break;
        default:
            showNotification('Action not implemented yet', 'warning');
    }
}

/**
 * Updates data source connection status
 */
function updateDataSources() {
    const sourceItems = document.querySelectorAll('.source-item');
    
    sourceItems.forEach(item => {
        const statusIcon = item.querySelector('i');
        const statusText = item.querySelector('small');
        
        // Simulate data refresh
        if (Math.random() > 0.1) { // 90% success rate
            statusIcon.className = 'fas fa-circle connected';
            statusText.textContent = 'Last sync: Just now';
        } else {
            statusIcon.className = 'fas fa-circle disconnected';
            statusText.textContent = 'Connection issue';
        }
    });
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const newWidth = Math.min(100, Math.floor(Math.random() * 20) + 75);
        progressBar.style.width = newWidth + '%';
        const quotaLabel = progressBar.parentElement ? progressBar.parentElement.nextElementSibling : null;
        if (quotaLabel) {
            quotaLabel.textContent = newWidth + '% of monthly quota';
        }
    }
}

/**
 * Updates real-time data streams
 */
function updateRealTimeData() {
    const dataValues = document.querySelectorAll('.data-value');
    
    dataValues.forEach(value => {
        const currentText = value.textContent;

        if (currentText.includes('RPM')) {
            const newValue = (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
            value.textContent = newValue + ' RPM';
        } else if (currentText.includes('°F')) {
            const newValue = Math.floor(Math.random() * 20) + 185;
            value.textContent = newValue + '°F';
        } else if (currentText.includes('PSI')) {
            const newValue = Math.floor(Math.random() * 10) + 40;
            value.textContent = newValue + ' PSI';
        }
    });
}

/**
 * Performs vehicle search
 * @param {string} query - Search query (VIN or license plate)
 * @param {string} make - Vehicle make filter
 */
async function performVehicleSearch(query, make) {
    showNotification('Searching vehicle database...', 'info');

    const isVin = query.replace(/[^A-Za-z0-9]/g, '').length >= 11;

    if (isVin) {
        const vin = query.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        const vinData = await fetchVinData(vin);
        const recalls = await fetchRecalls(vinData);
        const complaints = await fetchComplaints(vinData);
        const tsbs = await fetchTsbs(vinData);
        displayVinResults(vinData, recalls, complaints, tsbs);
        return;
    }

    // Fallback to demo results for non-VIN searches
    const results = generateMockSearchResults(query, make);
    displaySearchResults(results);
    showNotification(`Found ${results.length} matching vehicles`, 'success');
}

/**
 * Generates mock search results
 * @param {string} query - Search query
 * @param {string} make - Vehicle make
 * @returns {Array} Mock search results
 */
function generateMockSearchResults(query, make) {
    const mockResults = [
        {
            vin: query.length > 10 ? query : '1FTFW1E50NFB12345',
            make: make === 'All Makes' ? 'Ford' : make,
            model: 'F-150',
            year: '2023',
            lastService: '2024-12-15',
            status: 'Active'
        },
        {
            vin: '2FMDK3GC4MBA12345',
            make: make === 'All Makes' ? 'Ford' : make,
            model: 'Edge',
            year: '2022',
            lastService: '2024-11-20',
            status: 'Maintenance Due'
        }
    ];
    
    return mockResults.filter(result => 
        make === 'All Makes' || result.make === make
    );
}

/**
 * Displays search results
 * @param {Array} results - Search results to display
 */
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    if (!container) return;

    if (!results || results.length === 0) {
        container.innerHTML = '<div class="loading-placeholder">No vehicles found</div>';
        return;
    }

    let html = '<h4 style="color: white; margin-bottom: 16px;">Search Results:</h4>';
    results.forEach(result => {
        html += `
            <div class="source-item">
                <span>🚗 ${result.year} ${result.make} ${result.model}</span>
                <small>VIN: ${result.vin} • Status: ${result.status}</small>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function safeFetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function fetchVinData(vin) {
    try {
        const data = await safeFetchJson(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
        const row = data?.Results?.[0] || {};
        return {
            vin,
            make: row.Make || 'Unknown',
            model: row.Model || 'Unknown',
            year: row.ModelYear || 'Unknown',
            trim: row.Trim || row.Series || '—',
            body: row.BodyClass || '—',
            engine: row.EngineModel || row.EngineCylinders || '—'
        };
    } catch (err) {
        console.warn('VIN decode failed', err);
        return { vin, make: 'Unknown', model: 'Unknown', year: 'Unknown', trim: '—', body: '—', engine: '—' };
    }
}

async function fetchRecalls(vinData) {
    if (!vinData || vinData.make === 'Unknown') return [];
    const { make, model, year } = vinData;
    try {
        const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        const data = await safeFetchJson(url);
        return data?.results || [];
    } catch (err) {
        console.warn('Recall fetch failed', err);
        return [];
    }
}

async function fetchComplaints(vinData) {
    if (!vinData || vinData.make === 'Unknown') return [];
    const { make, model, year } = vinData;
    try {
        const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        const data = await safeFetchJson(url);
        return data?.results || [];
    } catch (err) {
        console.warn('Complaints fetch failed', err);
        return [];
    }
}

async function fetchTsbs(vinData) {
    if (!vinData || vinData.make === 'Unknown') return null;
    const { make, model, year } = vinData;
    try {
        const url = `https://api.nhtsa.gov/tsbs/tsbsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        const data = await safeFetchJson(url);
        return data?.results || [];
    } catch (err) {
        console.warn('TSB fetch failed', err);
        return null; // null indicates unavailable
    }
}

function displayVinResults(vinData, recalls, complaints, tsbs) {
    const container = document.getElementById('search-results');
    if (!container) return;

    const recallCount = recalls.length;
    const complaintCount = complaints.length;
    const tsbCount = Array.isArray(tsbs) ? tsbs.length : null;

    const recallList = recalls.slice(0, 5).map(r => (
        `<li>${r.Component || 'Recall'} — ${r.Summary || 'Details available'}</li>`
    )).join('') || '<li>No recalls found</li>';

    const complaintList = complaints.slice(0, 5).map(c => (
        `<li>${c.Component || 'Complaint'} — ${c.Summary || 'Details available'}</li>`
    )).join('') || '<li>No complaints found</li>';

    const tsbList = Array.isArray(tsbs)
        ? (tsbs.slice(0, 5).map(t => (`<li>${t.Component || 'TSB'} — ${t.Summary || 'Details available'}</li>`)).join('') || '<li>No TSBs found</li>')
        : '<li>TSB data unavailable (no free public endpoint)</li>';

    container.innerHTML = `
        <div class="source-item">
            <span>🚗 ${vinData.year} ${vinData.make} ${vinData.model}</span>
            <small>VIN: ${vinData.vin} • Trim: ${vinData.trim}</small>
        </div>
        <div class="source-item">
            <span>Body: ${vinData.body}</span>
            <small>Engine: ${vinData.engine}</small>
        </div>
        <div class="source-item">
            <span>Recalls: ${recallCount}</span>
            <small>Complaints: ${complaintCount}${tsbCount !== null ? ` • TSBs: ${tsbCount}` : ''}</small>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Top Recalls</h4>
            <ul style="color:#fff; padding-left:18px;">${recallList}</ul>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Top Complaints</h4>
            <ul style="color:#fff; padding-left:18px;">${complaintList}</ul>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">TSB Bulletins (best effort)</h4>
            <ul style="color:#fff; padding-left:18px;">${tsbList}</ul>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Repair Estimate (placeholder)</h4>
            <p style="color:#fff;">Labor & procedure data require paid OEM sources. This panel is ready for API integration.</p>
            <ul style="color:#fff; padding-left:18px;">
                <li>Labor hours: —</li>
                <li>Parts estimate: —</li>
                <li>Total estimate: —</li>
            </ul>
        </div>
        <button type="button" class="action-btn" style="margin-top:16px;" onclick="downloadVinReport()">⬇️ Download VIN Report</button>
    `;

    window._rb_lastVinReport = { vinData, recalls, complaints, tsbs };

    showNotification(`VIN lookup complete — ${recallCount} recalls, ${complaintCount} complaints`, 'success');
}

function downloadVinReport() {
    const payload = window._rb_lastVinReport;
    if (!payload) {
        showNotification('Run a VIN search first', 'warning');
        return;
    }
    const { vinData, recalls, complaints, tsbs } = payload;

    const lines = [];
    lines.push(`RepairBridge VIN Report`);
    lines.push(`VIN: ${vinData.vin}`);
    lines.push(`Vehicle: ${vinData.year} ${vinData.make} ${vinData.model} (${vinData.trim})`);
    lines.push(`Body: ${vinData.body} | Engine: ${vinData.engine}`);
    lines.push('');
    lines.push(`Recalls (${recalls.length}):`);
    recalls.forEach(r => lines.push(`- ${r.Component || 'Recall'}: ${r.Summary || 'Details available'}`));
    lines.push('');
    lines.push(`Complaints (${complaints.length}):`);
    complaints.forEach(c => lines.push(`- ${c.Component || 'Complaint'}: ${c.Summary || 'Details available'}`));
    lines.push('');
    if (Array.isArray(tsbs)) {
        lines.push(`TSBs (${tsbs.length}):`);
        tsbs.forEach(t => lines.push(`- ${t.Component || 'TSB'}: ${t.Summary || 'Details available'}`));
    } else {
        lines.push('TSBs: unavailable (no free public endpoint)');
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vin-report-${vinData.vin}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// expose for inline onclick
window.downloadVinReport = downloadVinReport;

/**
 * Starts AR diagnostic session
 */
function startARSession() {
    const arPlaceholder = document.querySelector('.ar-placeholder');
    
    showNotification('Initializing AR camera...', 'info');
    
    // Simulate AR session start
    setTimeout(() => {
        arPlaceholder.innerHTML = `
            <div class="ar-active">
                <i class="fas fa-video"></i>
                <h3>AR Session Active</h3>
                <p>Point camera at vehicle component</p>
                <button class="ar-stop-btn" onclick="stopARSession()">
                    <i class="fas fa-stop"></i>
                    Stop Session
                </button>
            </div>
        `;
        
        showNotification('AR session started successfully', 'success');
    }, 2000);
}

/**
 * Stops AR diagnostic session
 */
function stopARSession() {
    const arPlaceholder = document.querySelector('.ar-placeholder');
    
    arPlaceholder.innerHTML = `
        <i class="fas fa-camera"></i>
        <h3>AR Camera View</h3>
        <p>Position camera toward vehicle component</p>
        <button class="ar-start-btn" onclick="startARSession()">
            <i class="fas fa-play"></i>
            Start AR Session
        </button>
    `;
    
    showNotification('AR session stopped', 'info');
}

/**
 * Toggles AR overlay display
 * @param {string} overlayType - Type of overlay to toggle
 * @param {boolean} enabled - Whether overlay is enabled
 */
function toggleAROverlay(overlayType, enabled) {
    const action = enabled ? 'enabled' : 'disabled';
    showNotification(`${overlayType} overlay ${action}`, 'info');
}

/**
 * Filters marketplace items by category
 * @param {string} category - Category to filter by
 */
function filterMarketplaceItems(category) {
    showNotification(`Filtering marketplace by ${category}`, 'info');
    
    // Simulate filtering with animation
    const items = document.querySelectorAll('.marketplace-item');
    items.forEach(item => {
        item.style.opacity = '0.5';
        
        setTimeout(() => {
            item.style.opacity = '1';
        }, 300);
    });
}

/**
 * Adds item to cart
 * @param {string} itemName - Name of item to add
 * @param {string} itemPrice - Price of item
 */
function addToCart(itemName, itemPrice) {
    showNotification(`Added ${itemName} to cart (${itemPrice})`, 'success');
    
    // Update cart counter (if exists)
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const currentCount = parseInt(cartCounter.textContent) || 0;
        cartCounter.textContent = currentCount + 1;
    }
}

/**
 * Launches compliance tool
 * @param {string} toolName - Name of tool to launch
 */
function launchComplianceTool(toolName) {
    showNotification(`Launching ${toolName}...`, 'info');
    
    // Simulate tool launch delay
    setTimeout(() => {
        showNotification(`${toolName} opened successfully`, 'success');
    }, 1500);
}

/**
 * Exports transaction log
 */
function exportTransactionLog() {
    showNotification('Generating transaction log export...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification('Transaction log exported successfully', 'success');
    }, 2000);
}

/**
 * Opens subscription management
 */
function openSubscriptionManagement() {
    showNotification('Opening subscription management...', 'info');
    
    // This would typically open a modal or navigate to subscription page
    setTimeout(() => {
        showNotification('Subscription management loaded', 'success');
    }, 1000);
}

/**
 * Generates compliance report
 */
function generateComplianceReport() {
    setTimeout(() => {
        showNotification('Compliance report generated successfully', 'success');
    }, 3000);
}

/**
 * Utility Functions
 */

/**
 * Shows notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success, warning, info, error)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Gets notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Font Awesome icon class
 */
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Gets notification color based on type
 * @param {string} type - Notification type
 * @returns {string} Background color
 */
function getNotificationColor(type) {
    const colors = {
        success: 'rgba(34, 197, 94, 0.9)',
        warning: 'rgba(245, 158, 11, 0.9)',
        error: 'rgba(239, 68, 68, 0.9)',
        info: 'rgba(79, 172, 254, 0.9)'
    };
    return colors[type] || 'rgba(79, 172, 254, 0.9)';
}

/**
 * Animates section transitions
 * @param {string} sectionId - ID of section to animate
 */
function animateSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            section.style.transition = 'all 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 50);
    }
}

/**
 * Tracks section views for analytics
 * @param {string} sectionId - ID of viewed section
 */
function trackSectionView(sectionId) {
    console.log(`Section viewed: ${sectionId}`);
    
    // Update last activity
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        const sectionNames = {
            'dashboard': 'Dashboard',
            'data-aggregator': 'Data Hub',
            'ar-diagnostics': 'AR Diagnostics',
            'marketplace': 'Marketplace',
            'inventory': 'Inventory',
            'analytics': 'Analytics',
            'compliance': 'Compliance'
        };
        
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <i class="fas fa-eye"></i>
            <span>Viewed ${sectionNames[sectionId] || sectionId}</span>
            <small>Just now</small>
        `;
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Keep only last 5 activities
        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
}

/**
 * Shows welcome message on app load
 */
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Welcome to RepairBridge Platform!', 'success');
    }, 1000);
}

/**
 * Add CSS animations
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .ar-active {
        text-align: center;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .ar-active i {
        font-size: 4rem;
        color: #22c55e;
        margin-bottom: 16px;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .ar-stop-btn {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border: none;
        color: #ffffff;
        padding: 16px 32px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 1.1rem;
        margin-top: 20px;
    }
    
    .ar-stop-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }
`;
document.head.appendChild(style);

// Export functions for global access
window.startARSession = startARSession;
window.stopARSession = stopARSession;

/**
 * Initialize competitive features
 * Sets up AI diagnostics, telematics, blockchain, voice commands, and customer portal
 */
    
    // Initialize telematics system
    if (window.telematicsSystem) {
        // Setup real-time data updates
        setTimeout(() => {
            if (document.getElementById('telematics-data')) {
                window.telematicsSystem.renderTelematicsData();
            }
        }, 1000);
    }
    
    // Initialize blockchain verification
    if (window.blockchainSystem) {
        // Setup blockchain UI updates
        setTimeout(() => {
            if (document.getElementById('blockchain-status')) {
                document.getElementById('blockchain-status').innerHTML = window.blockchainSystem.renderBlockchainStatus();
            }
            if (document.getElementById('blockchain-blocks')) {
                document.getElementById('blockchain-blocks').innerHTML = window.blockchainSystem.renderRecentBlocks();
            }
            if (document.getElementById('blockchain-certificates')) {
                document.getElementById('blockchain-certificates').innerHTML = window.blockchainSystem.renderCertificates();
            }
        }, 1000);
    }
    
    // Initialize voice command system
    if (window.voiceCommandSystem) {
        // Setup voice UI updates
        setupVoiceUI();
    }
    
    // Initialize customer portal
    if (window.customerPortalSystem) {
        // Setup customer portal demo data
        setTimeout(() => {
            if (document.getElementById('customer-portal-data')) {
                showCustomerPortalDemo();
            }
        }, 1000);
    }
    
    console.log('Competitive features initialized');
}

/**
 * Setup voice commands context tracking
 * Updates voice context when navigating between sections
 */

/**
 * Setup voice UI elements
 */
            });
        });
    } else {
        voiceInterface.style.display = 'none';
    }
}

/**
 * Show customer portal demo
 */
            `;
        }
    }
}

/**
 * Enhanced showSection function with competitive features support
 */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Add active class to corresponding navigation button
        const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }
        
        // Initialize section-specific functionality
        initializeSectionFunctionality(sectionId);
        
        // Update voice context
        if (window.voiceCommandSystem) {
            window.voiceCommandSystem.updateContext(sectionId);
        }
    }
}

/**
 * Enhanced section initialization with competitive features
 */
function initializeSectionFunctionality(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'data-aggregator':
            loadDataAggregatorContent();
            break;
        case 'ar-diagnostics':
            loadARDiagnostics();
            break;
        case 'marketplace':
            if (window.marketplaceManager && window.marketplaceManager.renderMarketplaceItems) {
                window.marketplaceManager.renderMarketplaceItems();
            }
            break;
        case 'inventory':
            if (window.inventoryManager && window.inventoryManager.loadInventoryData) {
                window.inventoryManager.loadInventoryData();
            }
            break;
        case 'analytics':
            if (window.analyticsManager && window.analyticsManager.loadAnalytics) {
                window.analyticsManager.loadAnalytics();
            }
            break;
        case 'compliance':
            loadComplianceContent();
            break;
        case 'settings':
            if (window.settingsManager && window.settingsManager.loadSettingsInterface) {
                window.settingsManager.loadSettingsInterface();
            }
            break;
    }
}

/**
 * Initialize blockchain section with live data
 */
    
    if (blocksContainer) {
        blocksContainer.innerHTML = window.blockchainSystem.renderRecentBlocks();
    }
    
    if (certificatesContainer) {
        certificatesContainer.innerHTML = window.blockchainSystem.renderCertificates();
    }
}

// Make the enhanced showSection function globally available
window.showSection = showSection;

// --- Compatibility layer for legacy inline handlers (index.html) ---
function quickAction(action) {
    switch (action) {
        case 'diagnostic':
            showNotification('Starting new diagnostic session...', 'info');
            if (document.querySelector('[data-section="ar-diagnostics"]')) {
                showSection('ar-diagnostics');
            }
            setTimeout(() => {
                showNotification('Diagnostic tools ready!', 'success');
            }, 1500);
            break;
        case 'sync':
            showNotification('Syncing data sources...', 'info');
            updateDataSources();
            setTimeout(() => {
                showNotification('All data sources synchronized!', 'success');
            }, 1200);
            break;
        case 'report':
            showNotification('Generating compliance report...', 'info');
            generateComplianceReport();
            break;
        default:
            showNotification('Action not implemented yet', 'warning');
    }
}

function searchVehicle() {
    const queryEl = document.getElementById('vehicle-search');
    const makeEl = document.getElementById('make-filter');
    const query = queryEl ? queryEl.value.trim() : '';
    const make = makeEl ? makeEl.value : 'All Makes';

    if (!query) {
        showNotification('Please enter a VIN or License Plate', 'warning');
        return;
    }

    performVehicleSearch(query, make);
}

function updateLiveData() {
    showNotification('Refreshing live data...', 'info');
    setTimeout(() => {
        const rpm = document.getElementById('rpm-value');
        const temp = document.getElementById('temp-value');
        const pressure = document.getElementById('pressure-value');

        if (rpm) rpm.textContent = (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
        if (temp) temp.textContent = (Math.floor(Math.random() * 20) + 185) + '°F';
        if (pressure) pressure.textContent = (Math.floor(Math.random() * 10) + 40) + ' PSI';

        showNotification('Live data updated!', 'success');
    }, 800);
}

function refreshData() {
    showNotification('Refreshing data sources...', 'info');
    setTimeout(() => {
        updateDataSources();
        showNotification('Data sources refreshed!', 'success');
    }, 1000);
}

function toggleAR() {
    const button = document.getElementById('ar-toggle');
    const status = document.getElementById('ar-status');
    const viewport = document.getElementById('ar-viewport');

    if (!button || !status || !viewport) {
        showNotification('AR UI elements missing', 'warning');
        return;
    }

    if (!isARActive) {
        showNotification('Initializing AR camera...', 'info');
        button.innerHTML = '⏸️ Stop AR Session';
        status.innerHTML = 'Active';
        status.className = 'status-badge active';

        setTimeout(() => {
            viewport.innerHTML = `
                <h3>📹 AR Session Active</h3>
                <p>Camera overlay enabled - Point at vehicle component</p>
                <button type="button" class="action-btn" onclick="toggleAR()" id="ar-toggle">
                    ⏸️ Stop AR Session
                </button>
            `;
            showNotification('AR session started successfully!', 'success');
        }, 1200);

        isARActive = true;
    } else {
        showNotification('Stopping AR session...', 'info');
        button.innerHTML = '▶️ Start AR Session';
        status.innerHTML = 'Ready';

        viewport.innerHTML = `
            <h3>📷 AR Camera View</h3>
            <p>Position camera toward vehicle component</p>
            <button type="button" class="action-btn" onclick="toggleAR()" id="ar-toggle">
                ▶️ Start AR Session
            </button>
        `;

        showNotification('AR session stopped', 'info');
        isARActive = false;
    }
}

// Expose legacy handlers globally
window.quickAction = quickAction;
window.searchVehicle = searchVehicle;
window.updateLiveData = updateLiveData;
window.refreshData = refreshData;
window.toggleAR = toggleAR;
