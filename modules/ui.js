/**
 * UI + Interaction Handlers
 */

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
            showSection(targetSection);
        });
    });

    console.log('Navigation system initialized with', navButtons.length, 'buttons');
}

/**
 * Interactive Components Initialization
 */
function initializeInteractiveComponents() {
    const quickActionButtons = document.querySelectorAll('.action-btn');
    quickActionButtons.forEach(button => {
        if (button.getAttribute('onclick')) return;
        button.addEventListener('click', function() {
            const action = this.dataset.action || this.textContent.trim();
            handleQuickAction(action);
        });
    });

    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

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
 */
function initializeDataRefresh() {
    setInterval(updateDataSources, 30000);

    const refreshButtons = document.querySelectorAll('.refresh-btn');
    refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.animation = 'spin 1s linear';
            updateDataSources();

            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    });

    setInterval(updateRealTimeData, 2000);
}

/**
 * AR Controls System
 */
function initializeARControls() {
    const arStartButton = document.querySelector('.ar-start-btn');
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');

    if (arStartButton) {
        arStartButton.addEventListener('click', function() {
            startARSession();
        });
    }

    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const overlayType = this.parentElement.textContent.trim();
            toggleAROverlay(overlayType, this.checked);
        });
    });
}

/**
 * Marketplace System
 */
function initializeMarketplace() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterMarketplaceItems(category);
        });
    });

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
function handleQuickAction(action) {
    switch(action) {
        case 'New Diagnostic':
            showNotification('Starting new diagnostic session...', 'info');
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

function updateDataSources() {
    const sourceItems = document.querySelectorAll('.source-item');

    sourceItems.forEach(item => {
        const statusIcon = item.querySelector('i');
        const statusText = item.querySelector('small');

        if (statusIcon && statusText) {
            if (Math.random() > 0.1) {
                statusIcon.className = 'fas fa-circle connected';
                statusText.textContent = 'Last sync: Just now';
            } else {
                statusIcon.className = 'fas fa-circle disconnected';
                statusText.textContent = 'Connection issue';
            }
        }
    });

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

function startARSession() {
    const arPlaceholder = document.querySelector('.ar-placeholder');

    showNotification('Initializing AR camera...', 'info');

    setTimeout(() => {
        if (!arPlaceholder) return;
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

function stopARSession() {
    const arPlaceholder = document.querySelector('.ar-placeholder');

    if (!arPlaceholder) return;
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

function toggleAROverlay(overlayType, enabled) {
    const action = enabled ? 'enabled' : 'disabled';
    showNotification(`${overlayType} overlay ${action}`, 'info');
}

function filterMarketplaceItems(category) {
    showNotification(`Filtering marketplace by ${category}`, 'info');

    const items = document.querySelectorAll('.marketplace-item');
    items.forEach(item => {
        item.style.opacity = '0.5';

        setTimeout(() => {
            item.style.opacity = '1';
        }, 300);
    });
}

function addToCart(itemName, itemPrice) {
    showNotification(`Added ${itemName} to cart (${itemPrice})`, 'success');

    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        const currentCount = parseInt(cartCounter.textContent) || 0;
        cartCounter.textContent = currentCount + 1;
    }
}

function launchComplianceTool(toolName) {
    showNotification(`Launching ${toolName}...`, 'info');

    setTimeout(() => {
        showNotification(`${toolName} opened successfully`, 'success');
    }, 1500);
}

function openSubscriptionManagement() {
    showNotification('Opening subscription management...', 'info');

    setTimeout(() => {
        showNotification('Subscription management loaded', 'success');
    }, 1000);
}

/**
 * Utility Functions
 */
function showNotification(message, type = 'info') {
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

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'rgba(34, 197, 94, 0.9)',
        warning: 'rgba(245, 158, 11, 0.9)',
        error: 'rgba(239, 68, 68, 0.9)',
        info: 'rgba(79, 172, 254, 0.9)'
    };
    return colors[type] || 'rgba(79, 172, 254, 0.9)';
}

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

function trackSectionView(sectionId) {
    console.log(`Section viewed: ${sectionId}`);

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

        const activities = activityList.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
}

function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('Welcome to RepairBridge Platform!', 'success');
    }, 1000);
}

// style block for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .notification-content { display: flex; align-items: center; gap: 10px; }
    .ar-active { text-align: center; color: rgba(255, 255, 255, 0.9); }
    .ar-active i { font-size: 4rem; color: #22c55e; margin-bottom: 16px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
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
    .ar-stop-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4); }
`;
document.head.appendChild(style);

// Competitive/voice features (stubs to avoid runtime errors)
function initializeCompetitiveFeatures() {
    if (window.telematicsSystem) {
        setTimeout(() => {
            if (document.getElementById('telematics-data')) {
                window.telematicsSystem.renderTelematicsData();
            }
        }, 1000);
    }

    if (window.blockchainSystem) {
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

    if (window.voiceCommandSystem) {
        setupVoiceUI();
    }

    if (window.customerPortalSystem) {
        setTimeout(() => {
            if (document.getElementById('customer-portal-data')) {
                showCustomerPortalDemo();
            }
        }, 1000);
    }

    console.log('Competitive features initialized');
}

function setupVoiceContextTracking() {
    // Placeholder: hook voice context updates on section changes
}

function setupVoiceUI() {
    const voiceInterface = document.getElementById('voice-interface');
    if (!voiceInterface) return;
    if (window.voiceCommandSystem) {
        voiceInterface.style.display = 'block';
    } else {
        voiceInterface.style.display = 'none';
    }
}

function showCustomerPortalDemo() {
    const container = document.getElementById('customer-portal-data');
    if (!container) return;
    container.innerHTML = `
        <div class="activity-item">
            <span>✔️ Appointment Confirmed</span>
            <small>Today, 10:30 AM</small>
        </div>
        <div class="activity-item">
            <span>🧾 Invoice Ready</span>
            <small>Balance: $0.00</small>
        </div>
    `;
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }

        initializeSectionFunctionality(sectionId);

        if (window.voiceCommandSystem) {
            window.voiceCommandSystem.updateContext(sectionId);
        }
    }
}

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

// Make showSection globally available
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

window.startARSession = startARSession;
window.stopARSession = stopARSession;
window.quickAction = quickAction;
window.updateLiveData = updateLiveData;
window.refreshData = refreshData;
window.toggleAR = toggleAR;
