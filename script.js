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
    
    console.log('RepairBridge Platform initialized successfully!');
}

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
    
    // Quick action buttons
    const quickActionButtons = document.querySelectorAll('.action-btn');
    quickActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
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
    const searchButton = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const searchSelect = document.querySelector('.search-select');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            const make = searchSelect.value;
            
            if (query) {
                performVehicleSearch(query, make);
            } else {
                showNotification('Please enter a VIN or License Plate', 'warning');
            }
        });
    }
    
    // Enable search on Enter key
    if (searchInput) {
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
        progressBar.parentElement.nextElementSibling.textContent = newWidth + '% of monthly quota';
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
function performVehicleSearch(query, make) {
    showNotification('Searching vehicle database...', 'info');
    
    // Simulate search delay
    setTimeout(() => {
        const results = generateMockSearchResults(query, make);
        displaySearchResults(results);
        showNotification(`Found ${results.length} matching vehicles`, 'success');
    }, 2000);
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
    // This would typically update a results container
    console.log('Search results:', results);
    
    // Add results to activity log
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.innerHTML = `
            <i class="fas fa-search"></i>
            <span>Vehicle search completed</span>
            <small>Just now</small>
        `;
        activityList.insertBefore(newActivity, activityList.firstChild);
    }
}

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
function initializeCompetitiveFeatures() {
    console.log('Initializing competitive features...');
    
    // Initialize AI diagnostic assistant
    if (window.aiDiagnosticAssistant) {
        window.aiDiagnosticAssistant.init();
    }
    
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
function setupVoiceContextTracking() {
    if (!window.voiceCommandSystem) return;
    
    // Track navigation changes for voice context
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            window.voiceCommandSystem.updateContext(section);
        });
    });
}

/**
 * Setup voice UI elements
 */
function setupVoiceUI() {
    const voiceInterface = document.getElementById('voice-interface');
    if (!voiceInterface) return;
    
    // Show voice interface if voice commands are supported
    if (window.voiceCommandSystem.isSupported()) {
        voiceInterface.style.display = 'flex';
        
        // Setup voice button click handlers
        const voiceButtons = document.querySelectorAll('.voice-control-btn, .voice-btn');
        voiceButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (window.voiceCommandSystem.isListening) {
                    window.voiceCommandSystem.stopListening();
                } else {
                    window.voiceCommandSystem.startListening();
                }
            });
        });
    } else {
        voiceInterface.style.display = 'none';
    }
}

/**
 * Show customer portal demo
 */
function showCustomerPortalDemo() {
    // Get a sample customer for demo
    const customers = Array.from(window.customerPortalSystem.customers.values());
    if (customers.length > 0) {
        const sampleCustomer = customers[0];
        const dashboardHTML = window.customerPortalSystem.renderCustomerDashboard(sampleCustomer.id);
        
        const portalContainer = document.getElementById('customer-portal-data');
        if (portalContainer) {
            portalContainer.innerHTML = `
                <div class="portal-demo-notice">
                    <h3>Customer Portal Demo</h3>
                    <p>This is a demonstration of the customer portal interface</p>
                </div>
                ${dashboardHTML}
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
            if (window.marketplace) {
                window.marketplace.init();
            }
            break;
        case 'inventory':
            if (window.inventoryManager) {
                window.inventoryManager.loadInventoryData();
            }
            break;
        case 'analytics':
            if (window.analyticsManager) {
                window.analyticsManager.loadAnalytics();
            }
            break;
        case 'notifications':
            if (window.notificationManager) {
                window.notificationManager.loadNotifications();
            }
            break;
        case 'reporting':
            if (window.reportingSystem) {
                window.reportingSystem.loadReportingInterface();
            }
            break;
        case 'help':
            if (window.helpSystem) {
                window.helpSystem.loadHelpInterface();
            }
            break;
        case 'settings':
            if (window.settingsManager) {
                window.settingsManager.loadSettingsInterface();
            }
            break;
        case 'backup':
            if (window.backupManager) {
                window.backupManager.loadBackupInterface();
            }
            break;
        case 'audit':
            if (window.auditManager) {
                window.auditManager.loadAuditInterface();
            }
            break;
        case 'api':
            if (window.apiManager) {
                window.apiManager.loadAPIInterface();
            }
            break;
        case 'fleet':
            if (window.fleetManager) {
                window.fleetManager.loadFleetInterface();
            }
            break;
        case 'telematics':
            if (window.telematicsSystem) {
                window.telematicsSystem.renderTelematicsData();
            }
            break;
        case 'blockchain':
            if (window.blockchainSystem) {
                initializeBlockchainSection();
            }
            break;
        case 'customer-portal':
            if (window.customerPortalSystem) {
                showCustomerPortalDemo();
            }
            break;
        case 'compliance':
            loadComplianceContent();
            break;
    }
}

/**
 * Initialize blockchain section with live data
 */
function initializeBlockchainSection() {
    const statusContainer = document.getElementById('blockchain-status');
    const blocksContainer = document.getElementById('blockchain-blocks');
    const certificatesContainer = document.getElementById('blockchain-certificates');
    
    if (statusContainer) {
        statusContainer.innerHTML = window.blockchainSystem.renderBlockchainStatus();
    }
    
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
