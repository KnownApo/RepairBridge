/**
 * API Management and Integration System
 * Provides comprehensive API gateway functionality, third-party integrations, and developer tools
 */

class ApiManager {
    constructor() {
        this.apiEndpoints = [];
        this.integrations = [];
        this.apiKeys = [];
        this.webhooks = [];
        this.rateLimits = {};
        this.apiMetrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            activeConnections: 0
        };
        this.apiDocumentation = [];
        this.mockResponses = [];
        this.authTokens = [];
        this.requestLogs = [];
        
        this.initializeApiManager();
        this.loadApiData();
        this.setupApiHandlers();
    }

    initializeApiManager() {
        // Initialize API management system
        this.createDefaultEndpoints();
        this.setupIntegrations();
        this.startApiMonitoring();
    }

    loadApiData() {
        const savedEndpoints = localStorage.getItem('repairbridge_api_endpoints');
        if (savedEndpoints) {
            try {
                this.apiEndpoints = JSON.parse(savedEndpoints);
            } catch (error) {
                console.warn('Failed to load API endpoints:', error);
                this.createDefaultEndpoints();
            }
        } else {
            this.createDefaultEndpoints();
        }

        const savedIntegrations = localStorage.getItem('repairbridge_integrations');
        if (savedIntegrations) {
            try {
                this.integrations = JSON.parse(savedIntegrations);
            } catch (error) {
                console.warn('Failed to load integrations:', error);
                this.setupIntegrations();
            }
        } else {
            this.setupIntegrations();
        }

        const savedApiKeys = localStorage.getItem('repairbridge_api_keys');
        if (savedApiKeys) {
            try {
                this.apiKeys = JSON.parse(savedApiKeys);
            } catch (error) {
                console.warn('Failed to load API keys:', error);
                this.generateDefaultApiKeys();
            }
        } else {
            this.generateDefaultApiKeys();
        }
    }

    saveApiData() {
        localStorage.setItem('repairbridge_api_endpoints', JSON.stringify(this.apiEndpoints));
        localStorage.setItem('repairbridge_integrations', JSON.stringify(this.integrations));
        localStorage.setItem('repairbridge_api_keys', JSON.stringify(this.apiKeys));
    }

    renderApiInterface() {
        const apiSection = document.getElementById('api');
        if (!apiSection) return;

        apiSection.innerHTML = `
            <div class="api-system">
                <div class="api-header">
                    <h2><i class="fas fa-plug"></i> API Management</h2>
                    <div class="api-actions">
                        <button class="api-btn primary" onclick="apiManager.createApiKey()">
                            <i class="fas fa-key"></i> Create API Key
                        </button>
                        <button class="api-btn secondary" onclick="apiManager.testApiConnection()">
                            <i class="fas fa-play"></i> Test API
                        </button>
                        <button class="api-btn tertiary" onclick="apiManager.exportApiDocs()">
                            <i class="fas fa-file-export"></i> Export Docs
                        </button>
                    </div>
                </div>

                <div class="api-content">
                    <div class="api-main">
                        <div class="api-metrics">
                            <div class="metrics-cards">
                                <div class="metric-card requests">
                                    <div class="metric-icon">
                                        <i class="fas fa-exchange-alt"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.apiMetrics.totalRequests.toLocaleString()}</h3>
                                        <p>Total Requests</p>
                                        <span class="metric-change positive">+12% this week</span>
                                    </div>
                                </div>

                                <div class="metric-card success">
                                    <div class="metric-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${((this.apiMetrics.successfulRequests / this.apiMetrics.totalRequests) * 100 || 0).toFixed(1)}%</h3>
                                        <p>Success Rate</p>
                                        <span class="metric-change positive">+2.3% this week</span>
                                    </div>
                                </div>

                                <div class="metric-card response-time">
                                    <div class="metric-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.apiMetrics.averageResponseTime}ms</h3>
                                        <p>Avg Response Time</p>
                                        <span class="metric-change negative">-5ms this week</span>
                                    </div>
                                </div>

                                <div class="metric-card connections">
                                    <div class="metric-icon">
                                        <i class="fas fa-link"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.apiMetrics.activeConnections}</h3>
                                        <p>Active Connections</p>
                                        <span class="metric-change neutral">No change</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="api-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="endpoints">
                                    <i class="fas fa-globe"></i> Endpoints
                                </button>
                                <button class="tab-btn" data-tab="integrations">
                                    <i class="fas fa-puzzle-piece"></i> Integrations
                                </button>
                                <button class="tab-btn" data-tab="webhooks">
                                    <i class="fas fa-webhook"></i> Webhooks
                                </button>
                                <button class="tab-btn" data-tab="documentation">
                                    <i class="fas fa-book"></i> Documentation
                                </button>
                                <button class="tab-btn" data-tab="testing">
                                    <i class="fas fa-vial"></i> Testing
                                </button>
                            </div>

                            <div class="tab-content">
                                <div id="endpoints-tab" class="tab-panel active">
                                    ${this.renderEndpointsPanel()}
                                </div>
                                <div id="integrations-tab" class="tab-panel">
                                    ${this.renderIntegrationsPanel()}
                                </div>
                                <div id="webhooks-tab" class="tab-panel">
                                    ${this.renderWebhooksPanel()}
                                </div>
                                <div id="documentation-tab" class="tab-panel">
                                    ${this.renderDocumentationPanel()}
                                </div>
                                <div id="testing-tab" class="tab-panel">
                                    ${this.renderTestingPanel()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="api-sidebar">
                        <div class="api-status">
                            <h3>API Status</h3>
                            <div class="status-indicator healthy">
                                <div class="status-dot"></div>
                                <span>All Systems Operational</span>
                            </div>
                            <div class="status-details">
                                <div class="status-item">
                                    <span class="status-label">API Gateway</span>
                                    <span class="status-value online">Online</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Database</span>
                                    <span class="status-value online">Online</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Cache</span>
                                    <span class="status-value online">Online</span>
                                </div>
                                <div class="status-item">
                                    <span class="status-label">Auth Service</span>
                                    <span class="status-value online">Online</span>
                                </div>
                            </div>
                        </div>

                        <div class="api-keys">
                            <h3>API Keys</h3>
                            <div class="keys-list">
                                ${this.renderApiKeysList()}
                            </div>
                            <button class="add-key-btn" onclick="apiManager.showCreateKeyModal()">
                                <i class="fas fa-plus"></i> Add New Key
                            </button>
                        </div>

                        <div class="recent-activity">
                            <h3>Recent Activity</h3>
                            <div class="activity-list">
                                ${this.renderRecentActivity()}
                            </div>
                        </div>

                        <div class="api-health">
                            <h3>API Health</h3>
                            <div class="health-chart">
                                <canvas id="apiHealthChart" width="300" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupApiTabs();
        this.setupApiHandlers();
        this.renderApiHealthChart();
    }

    renderEndpointsPanel() {
        return `
            <div class="endpoints-panel">
                <div class="panel-header">
                    <h3>API Endpoints</h3>
                    <button class="create-endpoint-btn" onclick="apiManager.showCreateEndpointModal()">
                        <i class="fas fa-plus"></i> Create Endpoint
                    </button>
                </div>

                <div class="endpoints-filters">
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="endpoint-status-filter">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="deprecated">Deprecated</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Method</label>
                        <select id="endpoint-method-filter">
                            <option value="all">All Methods</option>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Version</label>
                        <select id="endpoint-version-filter">
                            <option value="all">All Versions</option>
                            <option value="v1">v1</option>
                            <option value="v2">v2</option>
                            <option value="v3">v3</option>
                        </select>
                    </div>
                </div>

                <div class="endpoints-list">
                    ${this.renderEndpointsList()}
                </div>
            </div>
        `;
    }

    renderEndpointsList() {
        return this.apiEndpoints.map(endpoint => `
            <div class="endpoint-card">
                <div class="endpoint-header">
                    <div class="endpoint-method ${endpoint.method.toLowerCase()}">
                        ${endpoint.method}
                    </div>
                    <div class="endpoint-path">
                        <code>${endpoint.path}</code>
                    </div>
                    <div class="endpoint-status">
                        <span class="status-badge ${endpoint.status}">${endpoint.status}</span>
                    </div>
                </div>
                <div class="endpoint-details">
                    <p class="endpoint-description">${endpoint.description}</p>
                    <div class="endpoint-metrics">
                        <div class="metric">
                            <span class="metric-label">Requests</span>
                            <span class="metric-value">${endpoint.requests || 0}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Success Rate</span>
                            <span class="metric-value">${endpoint.successRate || 0}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Avg Response</span>
                            <span class="metric-value">${endpoint.avgResponse || 0}ms</span>
                        </div>
                    </div>
                </div>
                <div class="endpoint-actions">
                    <button class="endpoint-action-btn test" onclick="apiManager.testEndpoint('${endpoint.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                    <button class="endpoint-action-btn edit" onclick="apiManager.editEndpoint('${endpoint.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="endpoint-action-btn docs" onclick="apiManager.viewEndpointDocs('${endpoint.id}')">
                        <i class="fas fa-book"></i> Docs
                    </button>
                    <button class="endpoint-action-btn delete" onclick="apiManager.deleteEndpoint('${endpoint.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderIntegrationsPanel() {
        return `
            <div class="integrations-panel">
                <div class="panel-header">
                    <h3>Third-Party Integrations</h3>
                    <button class="add-integration-btn" onclick="apiManager.showAddIntegrationModal()">
                        <i class="fas fa-plus"></i> Add Integration
                    </button>
                </div>

                <div class="integrations-grid">
                    ${this.renderIntegrationsList()}
                </div>

                <div class="integration-marketplace">
                    <h4>Integration Marketplace</h4>
                    <div class="marketplace-grid">
                        ${this.renderMarketplaceIntegrations()}
                    </div>
                </div>
            </div>
        `;
    }

    renderIntegrationsList() {
        return this.integrations.map(integration => `
            <div class="integration-card ${integration.status}">
                <div class="integration-header">
                    <div class="integration-logo">
                        <i class="fab fa-${integration.icon}"></i>
                    </div>
                    <div class="integration-info">
                        <h4>${integration.name}</h4>
                        <p>${integration.description}</p>
                    </div>
                    <div class="integration-status">
                        <span class="status-indicator ${integration.status}"></span>
                    </div>
                </div>
                <div class="integration-details">
                    <div class="detail-item">
                        <span class="detail-label">API Version</span>
                        <span class="detail-value">${integration.version}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Last Sync</span>
                        <span class="detail-value">${this.formatTimestamp(integration.lastSync)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Rate Limit</span>
                        <span class="detail-value">${integration.rateLimit}/hour</span>
                    </div>
                </div>
                <div class="integration-actions">
                    <button class="integration-action-btn configure" onclick="apiManager.configureIntegration('${integration.id}')">
                        <i class="fas fa-cog"></i> Configure
                    </button>
                    <button class="integration-action-btn test" onclick="apiManager.testIntegration('${integration.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                    <button class="integration-action-btn ${integration.status === 'active' ? 'pause' : 'resume'}" 
                            onclick="apiManager.toggleIntegration('${integration.id}')">
                        <i class="fas fa-${integration.status === 'active' ? 'pause' : 'play'}"></i> 
                        ${integration.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMarketplaceIntegrations() {
        const marketplace = [
            { name: 'Salesforce', icon: 'salesforce', description: 'CRM integration', category: 'CRM' },
            { name: 'Stripe', icon: 'stripe', description: 'Payment processing', category: 'Payment' },
            { name: 'AWS', icon: 'aws', description: 'Cloud services', category: 'Cloud' },
            { name: 'Microsoft', icon: 'microsoft', description: 'Office 365 integration', category: 'Productivity' },
            { name: 'Google', icon: 'google', description: 'Google Workspace', category: 'Productivity' },
            { name: 'Slack', icon: 'slack', description: 'Team communication', category: 'Communication' }
        ];

        return marketplace.map(item => `
            <div class="marketplace-item">
                <div class="marketplace-icon">
                    <i class="fab fa-${item.icon}"></i>
                </div>
                <div class="marketplace-info">
                    <h5>${item.name}</h5>
                    <p>${item.description}</p>
                    <span class="marketplace-category">${item.category}</span>
                </div>
                <button class="marketplace-install-btn" onclick="apiManager.installIntegration('${item.name}')">
                    <i class="fas fa-download"></i> Install
                </button>
            </div>
        `).join('');
    }

    renderWebhooksPanel() {
        return `
            <div class="webhooks-panel">
                <div class="panel-header">
                    <h3>Webhooks</h3>
                    <button class="create-webhook-btn" onclick="apiManager.showCreateWebhookModal()">
                        <i class="fas fa-plus"></i> Create Webhook
                    </button>
                </div>

                <div class="webhooks-list">
                    ${this.renderWebhooksList()}
                </div>

                <div class="webhook-events">
                    <h4>Available Events</h4>
                    <div class="events-grid">
                        ${this.renderWebhookEvents()}
                    </div>
                </div>
            </div>
        `;
    }

    renderWebhooksList() {
        const webhooks = this.generateMockWebhooks();
        
        return webhooks.map(webhook => `
            <div class="webhook-card">
                <div class="webhook-header">
                    <div class="webhook-info">
                        <h4>${webhook.name}</h4>
                        <p class="webhook-url">${webhook.url}</p>
                    </div>
                    <div class="webhook-status">
                        <span class="status-badge ${webhook.status}">${webhook.status}</span>
                    </div>
                </div>
                <div class="webhook-details">
                    <div class="detail-row">
                        <span class="detail-label">Events</span>
                        <span class="detail-value">${webhook.events.join(', ')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Last Triggered</span>
                        <span class="detail-value">${this.formatTimestamp(webhook.lastTriggered)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Success Rate</span>
                        <span class="detail-value">${webhook.successRate}%</span>
                    </div>
                </div>
                <div class="webhook-actions">
                    <button class="webhook-action-btn test" onclick="apiManager.testWebhook('${webhook.id}')">
                        <i class="fas fa-play"></i> Test
                    </button>
                    <button class="webhook-action-btn edit" onclick="apiManager.editWebhook('${webhook.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="webhook-action-btn logs" onclick="apiManager.viewWebhookLogs('${webhook.id}')">
                        <i class="fas fa-list"></i> Logs
                    </button>
                    <button class="webhook-action-btn delete" onclick="apiManager.deleteWebhook('${webhook.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderWebhookEvents() {
        const events = [
            { name: 'user.created', description: 'User account created' },
            { name: 'user.updated', description: 'User account updated' },
            { name: 'vehicle.added', description: 'Vehicle added to system' },
            { name: 'diagnostic.completed', description: 'Diagnostic scan completed' },
            { name: 'order.created', description: 'New order created' },
            { name: 'order.updated', description: 'Order status updated' },
            { name: 'backup.completed', description: 'Backup process completed' },
            { name: 'alert.triggered', description: 'Security alert triggered' }
        ];

        return events.map(event => `
            <div class="event-card">
                <div class="event-name">${event.name}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-actions">
                    <button class="event-action-btn" onclick="apiManager.subscribeToEvent('${event.name}')">
                        <i class="fas fa-plus"></i> Subscribe
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderDocumentationPanel() {
        return `
            <div class="documentation-panel">
                <div class="panel-header">
                    <h3>API Documentation</h3>
                    <div class="docs-actions">
                        <button class="docs-btn" onclick="apiManager.generateDocs()">
                            <i class="fas fa-sync"></i> Regenerate
                        </button>
                        <button class="docs-btn" onclick="apiManager.exportDocs()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>

                <div class="documentation-content">
                    <div class="docs-navigation">
                        <div class="docs-nav-section">
                            <h4>Getting Started</h4>
                            <ul>
                                <li><a href="#" onclick="apiManager.showDocSection('authentication')">Authentication</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('rate-limiting')">Rate Limiting</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('errors')">Error Handling</a></li>
                            </ul>
                        </div>
                        <div class="docs-nav-section">
                            <h4>Endpoints</h4>
                            <ul>
                                <li><a href="#" onclick="apiManager.showDocSection('vehicles')">Vehicles</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('diagnostics')">Diagnostics</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('marketplace')">Marketplace</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('users')">Users</a></li>
                            </ul>
                        </div>
                        <div class="docs-nav-section">
                            <h4>Webhooks</h4>
                            <ul>
                                <li><a href="#" onclick="apiManager.showDocSection('webhook-setup')">Setup</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('webhook-events')">Events</a></li>
                                <li><a href="#" onclick="apiManager.showDocSection('webhook-security')">Security</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="docs-content">
                        <div id="docs-display">
                            ${this.renderDocumentationContent()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDocumentationContent() {
        return `
            <div class="docs-section">
                <h2>RepairBridge API Documentation</h2>
                <p>Welcome to the RepairBridge API documentation. This guide will help you integrate with our platform and build powerful automotive solutions.</p>
                
                <div class="docs-card">
                    <h3>Base URL</h3>
                    <code class="code-block">https://api.repairbridge.com/v1</code>
                </div>

                <div class="docs-card">
                    <h3>Authentication</h3>
                    <p>All API requests require authentication using an API key. Include your API key in the request headers:</p>
                    <code class="code-block">
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
                    </code>
                </div>

                <div class="docs-card">
                    <h3>Rate Limiting</h3>
                    <p>API requests are rate limited to prevent abuse. Current limits:</p>
                    <ul>
                        <li>Standard: 1000 requests per hour</li>
                        <li>Premium: 10,000 requests per hour</li>
                        <li>Enterprise: Unlimited</li>
                    </ul>
                </div>

                <div class="docs-card">
                    <h3>Vehicle Lookup</h3>
                    <p>Retrieve vehicle information by VIN:</p>
                    <code class="code-block">
GET /vehicles/{vin}

Response:
{
  "vin": "1HGCM82633A123456",
  "make": "Honda",
  "model": "Accord",
  "year": 2023,
  "engine": "2.0L I4",
  "transmission": "CVT"
}
                    </code>
                </div>

                <div class="docs-card">
                    <h3>Diagnostic Data</h3>
                    <p>Submit diagnostic trouble codes:</p>
                    <code class="code-block">
POST /diagnostics

Request Body:
{
  "vin": "1HGCM82633A123456",
  "codes": ["P0301", "P0171"],
  "timestamp": "2025-07-17T10:30:00Z"
}
                    </code>
                </div>
            </div>
        `;
    }

    renderTestingPanel() {
        return `
            <div class="testing-panel">
                <div class="panel-header">
                    <h3>API Testing</h3>
                    <button class="run-tests-btn" onclick="apiManager.runAllTests()">
                        <i class="fas fa-play"></i> Run All Tests
                    </button>
                </div>

                <div class="testing-interface">
                    <div class="request-builder">
                        <h4>Request Builder</h4>
                        <div class="builder-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Method</label>
                                    <select id="test-method">
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>
                                <div class="form-group flex-grow">
                                    <label>URL</label>
                                    <input type="text" id="test-url" placeholder="https://api.repairbridge.com/v1/" />
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Headers</label>
                                    <textarea id="test-headers" placeholder='{"Authorization": "Bearer YOUR_API_KEY"}'></textarea>
                                </div>
                                <div class="form-group">
                                    <label>Body</label>
                                    <textarea id="test-body" placeholder='{"key": "value"}'></textarea>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button class="test-btn primary" onclick="apiManager.sendTestRequest()">
                                    <i class="fas fa-paper-plane"></i> Send Request
                                </button>
                                <button class="test-btn secondary" onclick="apiManager.clearTestForm()">
                                    <i class="fas fa-eraser"></i> Clear
                                </button>
                                <button class="test-btn tertiary" onclick="apiManager.saveTestRequest()">
                                    <i class="fas fa-save"></i> Save
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="response-viewer">
                        <h4>Response</h4>
                        <div class="response-tabs">
                            <button class="response-tab active" data-tab="response">Response</button>
                            <button class="response-tab" data-tab="headers">Headers</button>
                            <button class="response-tab" data-tab="timeline">Timeline</button>
                        </div>
                        <div class="response-content">
                            <div id="response-display">
                                <div class="response-placeholder">
                                    <i class="fas fa-arrow-up"></i>
                                    <p>Send a request to see the response</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="test-collections">
                    <h4>Test Collections</h4>
                    <div class="collections-list">
                        ${this.renderTestCollections()}
                    </div>
                </div>
            </div>
        `;
    }

    renderTestCollections() {
        const collections = [
            { name: 'Vehicle API Tests', tests: 12, status: 'passed' },
            { name: 'Diagnostic Tests', tests: 8, status: 'failed' },
            { name: 'Marketplace Tests', tests: 15, status: 'passed' },
            { name: 'User Management Tests', tests: 10, status: 'running' }
        ];

        return collections.map(collection => `
            <div class="collection-card">
                <div class="collection-header">
                    <h5>${collection.name}</h5>
                    <span class="collection-status ${collection.status}">${collection.status}</span>
                </div>
                <div class="collection-info">
                    <span class="test-count">${collection.tests} tests</span>
                    <button class="run-collection-btn" onclick="apiManager.runTestCollection('${collection.name}')">
                        <i class="fas fa-play"></i> Run
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderApiKeysList() {
        return this.apiKeys.map(key => `
            <div class="api-key-item">
                <div class="key-info">
                    <h5>${key.name}</h5>
                    <p class="key-value">${key.key.substring(0, 16)}...</p>
                    <span class="key-status ${key.status}">${key.status}</span>
                </div>
                <div class="key-actions">
                    <button class="key-action-btn copy" onclick="apiManager.copyApiKey('${key.id}')">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="key-action-btn revoke" onclick="apiManager.revokeApiKey('${key.id}')">
                        <i class="fas fa-ban"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const activities = this.generateMockActivity();
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <small>${this.formatTimestamp(activity.timestamp)}</small>
                </div>
            </div>
        `).join('');
    }

    // Setup methods
    setupApiTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding panel
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `${tabName}-tab`) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }

    setupApiHandlers() {
        // Setup various event handlers for API management
        this.setupFilterHandlers();
        this.setupTestingHandlers();
    }

    setupFilterHandlers() {
        // Setup filter event handlers
        const filters = document.querySelectorAll('#endpoint-status-filter, #endpoint-method-filter, #endpoint-version-filter');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyEndpointFilters();
            });
        });
    }

    setupTestingHandlers() {
        // Setup testing interface handlers
        const responseTabs = document.querySelectorAll('.response-tab');
        responseTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                responseTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                this.showResponseTab(tabName);
            });
        });
    }

    // Data generation methods
    createDefaultEndpoints() {
        this.apiEndpoints = [
            {
                id: 'ep_1',
                method: 'GET',
                path: '/api/v1/vehicles/{vin}',
                description: 'Retrieve vehicle information by VIN',
                status: 'active',
                version: 'v1',
                requests: 1247,
                successRate: 98.5,
                avgResponse: 145
            },
            {
                id: 'ep_2',
                method: 'POST',
                path: '/api/v1/diagnostics',
                description: 'Submit diagnostic trouble codes',
                status: 'active',
                version: 'v1',
                requests: 892,
                successRate: 97.2,
                avgResponse: 256
            },
            {
                id: 'ep_3',
                method: 'GET',
                path: '/api/v1/marketplace/parts',
                description: 'Search marketplace for parts',
                status: 'active',
                version: 'v1',
                requests: 2156,
                successRate: 99.1,
                avgResponse: 89
            },
            {
                id: 'ep_4',
                method: 'PUT',
                path: '/api/v1/users/{id}',
                description: 'Update user profile',
                status: 'active',
                version: 'v1',
                requests: 543,
                successRate: 96.8,
                avgResponse: 178
            },
            {
                id: 'ep_5',
                method: 'DELETE',
                path: '/api/v1/vehicles/{vin}',
                description: 'Remove vehicle from system',
                status: 'deprecated',
                version: 'v1',
                requests: 23,
                successRate: 94.5,
                avgResponse: 234
            }
        ];
    }

    setupIntegrations() {
        this.integrations = [
            {
                id: 'int_1',
                name: 'Salesforce CRM',
                description: 'Customer relationship management integration',
                icon: 'salesforce',
                status: 'active',
                version: 'v2.1',
                lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                rateLimit: 5000
            },
            {
                id: 'int_2',
                name: 'Stripe Payments',
                description: 'Payment processing integration',
                icon: 'stripe',
                status: 'active',
                version: 'v3.0',
                lastSync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                rateLimit: 1000
            },
            {
                id: 'int_3',
                name: 'AWS S3',
                description: 'Cloud storage integration',
                icon: 'aws',
                status: 'active',
                version: 'v1.5',
                lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                rateLimit: 10000
            },
            {
                id: 'int_4',
                name: 'Slack Notifications',
                description: 'Team communication integration',
                icon: 'slack',
                status: 'paused',
                version: 'v1.2',
                lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                rateLimit: 500
            }
        ];
    }

    generateDefaultApiKeys() {
        this.apiKeys = [
            {
                id: 'key_1',
                name: 'Production API Key',
                key: 'rb_prod_' + Math.random().toString(36).substr(2, 32),
                status: 'active',
                created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                permissions: ['read', 'write']
            },
            {
                id: 'key_2',
                name: 'Development API Key',
                key: 'rb_dev_' + Math.random().toString(36).substr(2, 32),
                status: 'active',
                created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                permissions: ['read']
            },
            {
                id: 'key_3',
                name: 'Testing API Key',
                key: 'rb_test_' + Math.random().toString(36).substr(2, 32),
                status: 'revoked',
                created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                permissions: ['read']
            }
        ];
    }

    generateMockWebhooks() {
        return [
            {
                id: 'wh_1',
                name: 'Order Notifications',
                url: 'https://example.com/webhooks/orders',
                events: ['order.created', 'order.updated'],
                status: 'active',
                lastTriggered: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                successRate: 98.5
            },
            {
                id: 'wh_2',
                name: 'User Events',
                url: 'https://example.com/webhooks/users',
                events: ['user.created', 'user.updated'],
                status: 'active',
                lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                successRate: 100
            },
            {
                id: 'wh_3',
                name: 'Diagnostic Updates',
                url: 'https://example.com/webhooks/diagnostics',
                events: ['diagnostic.completed'],
                status: 'failed',
                lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                successRate: 85.2
            }
        ];
    }

    generateMockActivity() {
        return [
            {
                description: 'API key created for production',
                icon: 'key',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
                description: 'Webhook endpoint updated',
                icon: 'webhook',
                timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            {
                description: 'Integration test completed',
                icon: 'check-circle',
                timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
            },
            {
                description: 'Rate limit exceeded for client',
                icon: 'exclamation-triangle',
                timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
            }
        ];
    }

    // API monitoring and metrics
    startApiMonitoring() {
        // Update API metrics periodically
        setInterval(() => {
            this.updateApiMetrics();
        }, 30000); // Every 30 seconds
    }

    updateApiMetrics() {
        // Simulate API metrics updates
        this.apiMetrics.totalRequests += Math.floor(Math.random() * 50) + 10;
        this.apiMetrics.successfulRequests += Math.floor(Math.random() * 45) + 8;
        this.apiMetrics.failedRequests = this.apiMetrics.totalRequests - this.apiMetrics.successfulRequests;
        this.apiMetrics.averageResponseTime = Math.floor(Math.random() * 100) + 150;
        this.apiMetrics.activeConnections = Math.floor(Math.random() * 20) + 5;
    }

    renderApiHealthChart() {
        const canvas = document.getElementById('apiHealthChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple health chart simulation
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const y = (canvas.height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw health line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < 24; i++) {
            const x = (canvas.width / 23) * i;
            const health = Math.random() * 20 + 80; // 80-100% health
            const y = canvas.height - (health / 100) * canvas.height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }

    // Event handlers
    createApiKey() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Creating new API key...', 'info');
        }
        
        setTimeout(() => {
            const newKey = {
                id: 'key_' + Date.now(),
                name: 'New API Key',
                key: 'rb_new_' + Math.random().toString(36).substr(2, 32),
                status: 'active',
                created: new Date().toISOString(),
                permissions: ['read']
            };
            
            this.apiKeys.push(newKey);
            this.saveApiData();
            this.renderApiInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification('API key created successfully', 'success');
            }
        }, 1000);
    }

    testApiConnection() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Testing API connection...', 'info');
        }
        
        setTimeout(() => {
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                if (window.notificationManager) {
                    window.notificationManager.showNotification('API connection test successful', 'success');
                }
            } else {
                if (window.notificationManager) {
                    window.notificationManager.showNotification('API connection test failed', 'error');
                }
            }
        }, 2000);
    }

    exportApiDocs() {
        const docs = {
            title: 'RepairBridge API Documentation',
            version: '1.0.0',
            baseUrl: 'https://api.repairbridge.com/v1',
            endpoints: this.apiEndpoints,
            authentication: 'Bearer token required',
            rateLimit: '1000 requests per hour'
        };
        
        const docsStr = JSON.stringify(docs, null, 2);
        const blob = new Blob([docsStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-documentation-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('API documentation exported', 'success');
        }
    }

    // More event handlers (abbreviated for brevity)
    showCreateEndpointModal() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Create endpoint modal opened', 'info');
        }
    }

    testEndpoint(endpointId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Testing endpoint ${endpointId}...`, 'info');
        }
    }

    editEndpoint(endpointId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Editing endpoint ${endpointId}`, 'info');
        }
    }

    deleteEndpoint(endpointId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Endpoint ${endpointId} deleted`, 'success');
        }
    }

    configureIntegration(integrationId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Configuring integration ${integrationId}`, 'info');
        }
    }

    testIntegration(integrationId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Testing integration ${integrationId}...`, 'info');
        }
    }

    toggleIntegration(integrationId) {
        const integration = this.integrations.find(i => i.id === integrationId);
        if (integration) {
            integration.status = integration.status === 'active' ? 'paused' : 'active';
            this.saveApiData();
            this.renderApiInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification(`Integration ${integration.status}`, 'success');
            }
        }
    }

    sendTestRequest() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Sending test request...', 'info');
        }
        
        setTimeout(() => {
            const mockResponse = {
                status: 200,
                data: { message: 'Test request successful', timestamp: new Date().toISOString() },
                headers: { 'Content-Type': 'application/json' },
                responseTime: Math.floor(Math.random() * 500) + 100
            };
            
            this.displayTestResponse(mockResponse);
        }, 1000);
    }

    displayTestResponse(response) {
        const display = document.getElementById('response-display');
        if (display) {
            display.innerHTML = `
                <div class="response-data">
                    <div class="response-status">
                        <span class="status-code success">${response.status}</span>
                        <span class="response-time">${response.responseTime}ms</span>
                    </div>
                    <pre class="response-body">${JSON.stringify(response.data, null, 2)}</pre>
                </div>
            `;
        }
    }

    copyApiKey(keyId) {
        const key = this.apiKeys.find(k => k.id === keyId);
        if (key) {
            navigator.clipboard.writeText(key.key);
            if (window.notificationManager) {
                window.notificationManager.showNotification('API key copied to clipboard', 'success');
            }
        }
    }

    revokeApiKey(keyId) {
        const key = this.apiKeys.find(k => k.id === keyId);
        if (key) {
            key.status = 'revoked';
            this.saveApiData();
            this.renderApiInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification('API key revoked', 'warning');
            }
        }
    }

    // Utility methods
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    applyEndpointFilters() {
        console.log('Applying endpoint filters...');
        // Filter implementation would go here
    }

    showResponseTab(tabName) {
        console.log('Showing response tab:', tabName);
        // Tab switching implementation would go here
    }

    runAllTests() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Running all API tests...', 'info');
        }
    }

    runTestCollection(collectionName) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Running ${collectionName}...`, 'info');
        }
    }

    // Additional placeholder methods for completeness
    showAddIntegrationModal() { console.log('Add integration modal'); }
    installIntegration(name) { console.log('Installing integration:', name); }
    showCreateWebhookModal() { console.log('Create webhook modal'); }
    testWebhook(id) { console.log('Testing webhook:', id); }
    editWebhook(id) { console.log('Editing webhook:', id); }
    viewWebhookLogs(id) { console.log('Viewing webhook logs:', id); }
    deleteWebhook(id) { console.log('Deleting webhook:', id); }
    subscribeToEvent(eventName) { console.log('Subscribing to event:', eventName); }
    generateDocs() { console.log('Generating documentation'); }
    exportDocs() { console.log('Exporting documentation'); }
    showDocSection(section) { console.log('Showing doc section:', section); }
    clearTestForm() { console.log('Clearing test form'); }
    saveTestRequest() { console.log('Saving test request'); }
    showCreateKeyModal() { console.log('Create key modal'); }
    viewEndpointDocs(id) { console.log('Viewing endpoint docs:', id); }
}

// Initialize API manager
window.apiManager = new ApiManager();
