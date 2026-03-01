/**
 * Data Loading + Hydration
 */

let appData = null;

function getAppData() {
    if (typeof RepairBridgeState !== 'undefined' && RepairBridgeState.getState) {
        return RepairBridgeState.getState().appData ?? appData;
    }
    return appData;
}

function setAppData(nextData) {
    appData = nextData;
    if (typeof RepairBridgeState !== 'undefined' && RepairBridgeState.setState) {
        RepairBridgeState.setState({ appData: nextData });
    }
}

function renderEmptyState(container, { icon = '📭', title = 'Nothing here yet', body = '' } = {}) {
    if (!container) return;
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">${icon}</div>
            <h4>${title}</h4>
            ${body ? `<p>${body}</p>` : ''}
        </div>
    `;
}

function getBackendBaseUrl() {
    if (typeof RepairBridgeConfig !== 'undefined' && RepairBridgeConfig.getEndpoint) {
        return RepairBridgeConfig.getEndpoint('backendBase');
    }
    return window.REPAIRBRIDGE_BACKEND_URL || 'http://localhost:5050';
}

async function loadAppData() {
    try {
        const rawData = await RepairBridgeAPI.getJson('data/repairbridge.json', {
            ttlMs: 10 * 60 * 1000,
            cacheKey: 'repairbridge:data'
        });
        const { compliance, ...baseData } = rawData || {};
        if (baseData.stats && baseData.stats.compliance) {
            delete baseData.stats.compliance;
        }
        setAppData(baseData);
    } catch (err) {
        console.warn('Falling back to built-in demo data:', err);
        setAppData(getFallbackData());
    }

    hydrateDashboard();
    hydrateDataAggregator();
    hydrateMarketplace();
    hydrateInventory();
    hydrateAnalytics();
    hydrateCompliance();
    hydrateSettings();
    loadSearchHistory();

    loadComplianceData();
}

function getFallbackData() {
    return {
        stats: { vehicles: 150, sources: 10, diagnostics: 4 },
        recentActivity: [
            { text: '🔧 Honda Accord diagnostic completed', time: '1 hour ago' },
            { text: '📥 GM data feed synced', time: '2 hours ago' }
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
        analytics: { monthlyRevenue: '$38,200', jobsCompleted: 112, avgCycleTime: '2.1 days' }
    };
}

async function loadComplianceData({ refresh = false } = {}) {
    const baseUrl = getBackendBaseUrl();
    try {
        const response = await RepairBridgeAPI.getJson(`${baseUrl}/api/v1/compliance`, {
            ttlMs: refresh ? 0 : 5 * 60 * 1000,
            cacheKey: 'repairbridge:compliance'
        });
        const compliance = response?.data;
        if (!compliance) return;

        const currentData = getAppData() || {};
        const nextStats = { ...(currentData.stats || {}) };
        if (compliance.rate) {
            nextStats.compliance = compliance.rate;
        }

        setAppData({
            ...currentData,
            stats: nextStats,
            compliance: {
                lastAudit: compliance.lastAudit,
                openFindings: compliance.openFindings,
                nextReview: compliance.nextReview
            }
        });

        hydrateDashboard();
        hydrateCompliance();
    } catch (error) {
        console.warn('Compliance data unavailable:', error);
    }
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
        if (!appData.recentActivity.length) {
            renderEmptyState(activityList, {
                icon: '🕒',
                title: 'No recent activity yet',
                body: 'New diagnostics and data syncs will appear here.'
            });
        } else {
            activityList.innerHTML = appData.recentActivity.map(item => (
                `<div class="activity-item"><span>${item.text}</span><small>${item.time}</small></div>`
            )).join('');
        }
    }
}

function hydrateDataAggregator() {
    if (!appData) return;

    const list = document.getElementById('oem-source-list');
    if (list && Array.isArray(appData.dataSources)) {
        if (!appData.dataSources.length) {
            renderEmptyState(list, {
                icon: '📡',
                title: 'No data sources connected',
                body: 'Connect OEM feeds to start pulling recall and service data.'
            });
        } else {
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
    }

    const metrics = document.getElementById('data-analytics-metrics');
    if (metrics) {
        if (!appData.dataAnalytics) {
            renderEmptyState(metrics, {
                icon: '📊',
                title: 'Analytics not available',
                body: 'Connect data feeds to see volume and speed metrics.'
            });
        } else {
            metrics.innerHTML = `
                <h4>Data Volume: ${appData.dataAnalytics.quota}</h4>
                <h4>Processing Speed: ${appData.dataAnalytics.speed}</h4>
                <h4>Active Connections: ${appData.dataAnalytics.connections}</h4>
            `;
        }
    }
}

function hydrateMarketplace() {
    if (!appData || !Array.isArray(appData.marketplace)) return;
    const grid = document.getElementById('marketplace-grid');
    if (!grid) return;

    if (!appData.marketplace.length) {
        renderEmptyState(grid, {
            icon: '🛒',
            title: 'No marketplace offers yet',
            body: 'Add vendor listings or training packages to populate this section.'
        });
        return;
    }

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

    if (!lowStock.length && !suppliers.length) {
        renderEmptyState(panel, {
            icon: '📦',
            title: 'Inventory data not connected',
            body: 'Add parts or connect a supplier catalog to see stock alerts.'
        });
        return;
    }

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

    const hasAnalytics = Object.values(appData.analytics || {}).some(value => value !== undefined && value !== null && value !== '');
    if (!hasAnalytics) {
        renderEmptyState(panel, {
            icon: '📈',
            title: 'Analytics are empty',
            body: 'Connect jobs and invoices to start seeing performance metrics.'
        });
        return;
    }

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
    if (!appData) return;
    const panel = document.getElementById('compliance-panel');
    if (!panel) return;

    if (!appData.compliance) {
        renderEmptyState(panel, {
            icon: '🛡️',
            title: 'Compliance data not loaded',
            body: 'Compliance status is delivered by the backend service.'
        });
        return;
    }

    const hasCompliance = Object.values(appData.compliance || {}).some(value => value !== undefined && value !== null && value !== '');
    if (!hasCompliance) {
        renderEmptyState(panel, {
            icon: '🛡️',
            title: 'Compliance data not loaded',
            body: 'Add audit records to track findings and review dates.'
        });
        return;
    }

    panel.innerHTML = `
        <h3>Last Audit</h3>
        <p>${appData.compliance.lastAudit}</p>
        <h3 style="margin-top:12px;">Open Findings</h3>
        <p>${appData.compliance.openFindings}</p>
        <h3 style="margin-top:12px;">Next Review</h3>
        <p>${appData.compliance.nextReview}</p>
    `;
}

function hydrateSettings() {
    if (!appData) return;

    const account = appData.account || {};
    const accountPanel = document.getElementById('account-panel');
    const accountStatus = document.getElementById('account-status');
    if (accountPanel) {
        const hasAccount = account.owner || account.shop || account.plan;
        if (!hasAccount) {
            renderEmptyState(accountPanel, {
                icon: '👤',
                title: 'Shop account not configured',
                body: 'Add owner details to unlock shop-level settings.'
            });
        } else {
            accountPanel.innerHTML = `
                <h4>Owner: ${account.owner || '—'}</h4>
                <h4>Shop: ${account.shop || '—'}</h4>
                <h4>Plan: ${account.plan || '—'}</h4>
            `;
        }
    }
    if (accountStatus) {
        accountStatus.textContent = account.status === 'active' ? 'Active' : 'Pending';
        accountStatus.className = account.status === 'active' ? 'status-badge active' : 'status-badge';
    }

    const billingPanel = document.getElementById('billing-panel');
    if (billingPanel) {
        if (!Array.isArray(appData.plans) || !appData.plans.length) {
            renderEmptyState(billingPanel, {
                icon: '💳',
                title: 'No plans available',
                body: 'Subscription tiers will appear once pricing is configured.'
            });
        } else {
            billingPanel.innerHTML = appData.plans.map(plan => {
                const features = (plan.features || []).map(f => `<li>${f}</li>`).join('');
                return `
                    <div class="source-item" style="flex-direction:column; align-items:flex-start;">
                        <strong style="color:#fff;">${plan.name} — ${plan.price}</strong>
                        <ul style="color:#fff; padding-left:18px; margin-top:6px;">${features}</ul>
                    </div>
                `;
            }).join('');
        }
    }
}

// Section loaders (used by navigation)
function loadDashboardData() { hydrateDashboard(); }
function loadDataAggregatorContent() { hydrateDataAggregator(); }
function loadARDiagnostics() { /* placeholder for future camera binding */ }
function loadComplianceContent() {
    loadComplianceData({ refresh: true });
    hydrateCompliance();
}
