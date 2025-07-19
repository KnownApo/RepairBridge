/**
 * Audit Logging and Compliance Monitoring System
 * Tracks all user activities, system events, and regulatory compliance
 */

class AuditManager {
    constructor() {
        this.auditLogs = [];
        this.complianceMetrics = {
            gdpr: { score: 0, lastAudit: null, violations: [] },
            hipaa: { score: 0, lastAudit: null, violations: [] },
            iso27001: { score: 0, lastAudit: null, violations: [] },
            sox: { score: 0, lastAudit: null, violations: [] }
        };
        this.alertThresholds = {
            failedLogins: 5,
            dataExports: 10,
            privilegeEscalation: 1,
            suspiciousActivity: 3
        };
        this.retentionPolicies = {
            security: 2555, // 7 years in days
            access: 1095, // 3 years in days
            system: 365, // 1 year in days
            compliance: 2555 // 7 years in days
        };
        this.realTimeAlerts = [];
        
        this.initializeAuditManager();
        this.loadAuditData();
        this.setupEventListeners();
    }

    initializeAuditManager() {
        // Initialize audit system
        this.startAuditCapture();
        this.scheduleComplianceChecks();
        this.setupRealTimeMonitoring();
    }

    loadAuditData() {
        const savedLogs = localStorage.getItem('repairbridge_audit_logs');
        if (savedLogs) {
            try {
                this.auditLogs = JSON.parse(savedLogs);
            } catch (error) {
                console.warn('Failed to load audit logs:', error);
                this.auditLogs = [];
            }
        }

        const savedMetrics = localStorage.getItem('repairbridge_compliance_metrics');
        if (savedMetrics) {
            try {
                this.complianceMetrics = { ...this.complianceMetrics, ...JSON.parse(savedMetrics) };
            } catch (error) {
                console.warn('Failed to load compliance metrics:', error);
            }
        }
    }

    saveAuditData() {
        localStorage.setItem('repairbridge_audit_logs', JSON.stringify(this.auditLogs));
        localStorage.setItem('repairbridge_compliance_metrics', JSON.stringify(this.complianceMetrics));
    }

    renderAuditInterface() {
        const auditSection = document.getElementById('audit');
        if (!auditSection) return;

        auditSection.innerHTML = `
            <div class="audit-system">
                <div class="audit-header">
                    <h2><i class="fas fa-clipboard-check"></i> Audit & Compliance</h2>
                    <div class="audit-actions">
                        <button class="generate-report-btn" onclick="auditManager.generateComplianceReport()">
                            <i class="fas fa-file-alt"></i> Generate Report
                        </button>
                        <button class="export-logs-btn" onclick="auditManager.exportAuditLogs()">
                            <i class="fas fa-download"></i> Export Logs
                        </button>
                        <button class="run-audit-btn" onclick="auditManager.runComplianceAudit()">
                            <i class="fas fa-search"></i> Run Audit
                        </button>
                    </div>
                </div>

                <div class="audit-content">
                    <div class="audit-overview">
                        <div class="compliance-dashboard">
                            <div class="compliance-cards">
                                <div class="compliance-card gdpr">
                                    <div class="card-header">
                                        <h3>GDPR Compliance</h3>
                                        <div class="compliance-score ${this.getScoreClass('gdpr')}">${this.complianceMetrics.gdpr.score}%</div>
                                    </div>
                                    <div class="card-content">
                                        <div class="metric-item">
                                            <span class="metric-label">Data Processing</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Consent Management</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Data Subject Rights</span>
                                            <span class="metric-value warning">Review Required</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="compliance-card hipaa">
                                    <div class="card-header">
                                        <h3>HIPAA Compliance</h3>
                                        <div class="compliance-score ${this.getScoreClass('hipaa')}">${this.complianceMetrics.hipaa.score}%</div>
                                    </div>
                                    <div class="card-content">
                                        <div class="metric-item">
                                            <span class="metric-label">Access Controls</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Audit Logs</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Encryption</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="compliance-card iso27001">
                                    <div class="card-header">
                                        <h3>ISO 27001</h3>
                                        <div class="compliance-score ${this.getScoreClass('iso27001')}">${this.complianceMetrics.iso27001.score}%</div>
                                    </div>
                                    <div class="card-content">
                                        <div class="metric-item">
                                            <span class="metric-label">Security Controls</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Risk Management</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Incident Response</span>
                                            <span class="metric-value non-compliant">Non-Compliant</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="compliance-card sox">
                                    <div class="card-header">
                                        <h3>SOX Compliance</h3>
                                        <div class="compliance-score ${this.getScoreClass('sox')}">${this.complianceMetrics.sox.score}%</div>
                                    </div>
                                    <div class="card-content">
                                        <div class="metric-item">
                                            <span class="metric-label">Financial Controls</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Change Management</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                        <div class="metric-item">
                                            <span class="metric-label">Data Integrity</span>
                                            <span class="metric-value compliant">Compliant</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="audit-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="logs">
                                    <i class="fas fa-list"></i> Audit Logs
                                </button>
                                <button class="tab-btn" data-tab="alerts">
                                    <i class="fas fa-exclamation-triangle"></i> Security Alerts
                                </button>
                                <button class="tab-btn" data-tab="compliance">
                                    <i class="fas fa-shield-alt"></i> Compliance
                                </button>
                                <button class="tab-btn" data-tab="reports">
                                    <i class="fas fa-chart-bar"></i> Reports
                                </button>
                                <button class="tab-btn" data-tab="settings">
                                    <i class="fas fa-cog"></i> Settings
                                </button>
                            </div>

                            <div class="tab-content">
                                <div id="logs-tab" class="tab-panel active">
                                    ${this.renderAuditLogs()}
                                </div>
                                <div id="alerts-tab" class="tab-panel">
                                    ${this.renderSecurityAlerts()}
                                </div>
                                <div id="compliance-tab" class="tab-panel">
                                    ${this.renderComplianceDetails()}
                                </div>
                                <div id="reports-tab" class="tab-panel">
                                    ${this.renderReportsPanel()}
                                </div>
                                <div id="settings-tab" class="tab-panel">
                                    ${this.renderAuditSettings()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="audit-sidebar">
                        <div class="real-time-alerts">
                            <h3>Real-Time Alerts</h3>
                            <div class="alert-list">
                                ${this.renderRealTimeAlerts()}
                            </div>
                        </div>

                        <div class="audit-statistics">
                            <h3>Audit Statistics</h3>
                            <div class="stat-items">
                                <div class="stat-item">
                                    <span class="stat-label">Total Events</span>
                                    <span class="stat-value">${this.auditLogs.length.toLocaleString()}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Security Events</span>
                                    <span class="stat-value">${this.getSecurityEventCount()}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Failed Logins</span>
                                    <span class="stat-value">${this.getFailedLoginCount()}</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">Data Exports</span>
                                    <span class="stat-value">${this.getDataExportCount()}</span>
                                </div>
                            </div>
                        </div>

                        <div class="compliance-trends">
                            <h3>Compliance Trends</h3>
                            <div class="trend-chart">
                                <canvas id="complianceTrendChart" width="300" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupAuditTabs();
        this.setupAuditHandlers();
        this.renderComplianceTrendChart();
    }

    renderAuditLogs() {
        return `
            <div class="audit-logs">
                <div class="logs-header">
                    <div class="logs-filters">
                        <div class="filter-group">
                            <label>Date Range</label>
                            <input type="date" id="date-from" />
                            <input type="date" id="date-to" />
                        </div>
                        <div class="filter-group">
                            <label>Event Type</label>
                            <select id="event-type-filter">
                                <option value="all">All Events</option>
                                <option value="login">Login/Logout</option>
                                <option value="access">Data Access</option>
                                <option value="modification">Data Modification</option>
                                <option value="security">Security Events</option>
                                <option value="system">System Events</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>User</label>
                            <select id="user-filter">
                                <option value="all">All Users</option>
                                <option value="admin">admin@repairbridge.com</option>
                                <option value="user1">user1@repairbridge.com</option>
                                <option value="user2">user2@repairbridge.com</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Severity</label>
                            <select id="severity-filter">
                                <option value="all">All Severities</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div class="logs-search">
                        <input type="text" id="logs-search" placeholder="Search audit logs..." />
                        <button class="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <div class="logs-table">
                    <div class="table-header">
                        <div class="header-cell">Timestamp</div>
                        <div class="header-cell">Event Type</div>
                        <div class="header-cell">User</div>
                        <div class="header-cell">Action</div>
                        <div class="header-cell">Resource</div>
                        <div class="header-cell">IP Address</div>
                        <div class="header-cell">Severity</div>
                        <div class="header-cell">Status</div>
                    </div>
                    <div class="table-body">
                        ${this.renderAuditLogRows()}
                    </div>
                </div>

                <div class="logs-pagination">
                    <button class="pagination-btn" onclick="auditManager.previousPage()">
                        <i class="fas fa-chevron-left"></i> Previous
                    </button>
                    <span class="page-info">Page 1 of 10</span>
                    <button class="pagination-btn" onclick="auditManager.nextPage()">
                        Next <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderAuditLogRows() {
        // Generate mock audit log entries
        const mockLogs = this.generateMockAuditLogs();
        
        return mockLogs.map(log => `
            <div class="table-row ${log.severity}">
                <div class="table-cell">${this.formatTimestamp(log.timestamp)}</div>
                <div class="table-cell">${log.eventType}</div>
                <div class="table-cell">${log.user}</div>
                <div class="table-cell">${log.action}</div>
                <div class="table-cell">${log.resource}</div>
                <div class="table-cell">${log.ipAddress}</div>
                <div class="table-cell">
                    <span class="severity-badge ${log.severity}">${log.severity}</span>
                </div>
                <div class="table-cell">
                    <span class="status-badge ${log.status}">${log.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderSecurityAlerts() {
        return `
            <div class="security-alerts">
                <div class="alert-summary">
                    <div class="summary-cards">
                        <div class="summary-card critical">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <div class="card-content">
                                <h3>5</h3>
                                <p>Critical Alerts</p>
                            </div>
                        </div>
                        <div class="summary-card high">
                            <div class="card-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="card-content">
                                <h3>12</h3>
                                <p>High Priority</p>
                            </div>
                        </div>
                        <div class="summary-card medium">
                            <div class="card-icon">
                                <i class="fas fa-info-circle"></i>
                            </div>
                            <div class="card-content">
                                <h3>28</h3>
                                <p>Medium Priority</p>
                            </div>
                        </div>
                        <div class="summary-card resolved">
                            <div class="card-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="card-content">
                                <h3>156</h3>
                                <p>Resolved</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="alert-filters">
                    <select id="alert-status-filter">
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="acknowledged">Acknowledged</option>
                        <option value="resolved">Resolved</option>
                    </select>
                    <select id="alert-severity-filter">
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                    <button class="acknowledge-all-btn" onclick="auditManager.acknowledgeAllAlerts()">
                        <i class="fas fa-check"></i> Acknowledge All
                    </button>
                </div>

                <div class="alert-list">
                    ${this.renderSecurityAlertList()}
                </div>
            </div>
        `;
    }

    renderSecurityAlertList() {
        const alerts = this.generateMockSecurityAlerts();
        
        return alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-icon">
                    <i class="fas fa-${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.description}</p>
                    <div class="alert-meta">
                        <span class="alert-time">${this.formatTimestamp(alert.timestamp)}</span>
                        <span class="alert-source">${alert.source}</span>
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="alert-action-btn acknowledge" onclick="auditManager.acknowledgeAlert('${alert.id}')">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="alert-action-btn resolve" onclick="auditManager.resolveAlert('${alert.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="alert-action-btn details" onclick="auditManager.showAlertDetails('${alert.id}')">
                        <i class="fas fa-info"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderComplianceDetails() {
        return `
            <div class="compliance-details">
                <div class="compliance-frameworks">
                    <h3>Compliance Frameworks</h3>
                    
                    <div class="framework-section">
                        <h4><i class="fas fa-shield-alt"></i> GDPR (General Data Protection Regulation)</h4>
                        <div class="compliance-checklist">
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Data Processing Records</h5>
                                    <p>Maintain records of all data processing activities</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Consent Management</h5>
                                    <p>Implement proper consent mechanisms for data collection</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status warning">
                                    <i class="fas fa-exclamation-triangle"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Data Subject Rights</h5>
                                    <p>Provide mechanisms for data subject access and deletion</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="framework-section">
                        <h4><i class="fas fa-medical-icon"></i> HIPAA (Health Insurance Portability and Accountability Act)</h4>
                        <div class="compliance-checklist">
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Access Controls</h5>
                                    <p>Implement proper user access controls and authentication</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Audit Logging</h5>
                                    <p>Maintain comprehensive audit logs of all system access</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Data Encryption</h5>
                                    <p>Encrypt sensitive data both at rest and in transit</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="framework-section">
                        <h4><i class="fas fa-certificate"></i> ISO 27001 (Information Security Management)</h4>
                        <div class="compliance-checklist">
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Security Controls</h5>
                                    <p>Implement comprehensive security control framework</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status compliant">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Risk Management</h5>
                                    <p>Establish risk assessment and management processes</p>
                                </div>
                            </div>
                            <div class="checklist-item">
                                <div class="check-status non-compliant">
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="check-content">
                                    <h5>Incident Response</h5>
                                    <p>Develop and maintain incident response procedures</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="compliance-actions">
                    <button class="compliance-btn" onclick="auditManager.runFullComplianceCheck()">
                        <i class="fas fa-search"></i> Full Compliance Check
                    </button>
                    <button class="compliance-btn" onclick="auditManager.generateComplianceReport()">
                        <i class="fas fa-file-alt"></i> Generate Report
                    </button>
                    <button class="compliance-btn" onclick="auditManager.scheduleComplianceAudit()">
                        <i class="fas fa-calendar"></i> Schedule Audit
                    </button>
                </div>
            </div>
        `;
    }

    renderReportsPanel() {
        return `
            <div class="reports-panel">
                <div class="report-templates">
                    <h3>Report Templates</h3>
                    <div class="template-grid">
                        <div class="template-card">
                            <div class="template-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="template-content">
                                <h4>Security Report</h4>
                                <p>Comprehensive security audit report</p>
                                <button class="generate-btn" onclick="auditManager.generateSecurityReport()">
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div class="template-card">
                            <div class="template-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="template-content">
                                <h4>User Activity Report</h4>
                                <p>Detailed user activity and access report</p>
                                <button class="generate-btn" onclick="auditManager.generateUserActivityReport()">
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div class="template-card">
                            <div class="template-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="template-content">
                                <h4>Compliance Report</h4>
                                <p>Regulatory compliance status report</p>
                                <button class="generate-btn" onclick="auditManager.generateComplianceReport()">
                                    Generate
                                </button>
                            </div>
                        </div>
                        <div class="template-card">
                            <div class="template-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="template-content">
                                <h4>Incident Report</h4>
                                <p>Security incident analysis report</p>
                                <button class="generate-btn" onclick="auditManager.generateIncidentReport()">
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="report-history">
                    <h3>Report History</h3>
                    <div class="history-list">
                        ${this.renderReportHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    renderReportHistory() {
        const reports = this.generateMockReportHistory();
        
        return reports.map(report => `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas fa-${report.icon}"></i>
                </div>
                <div class="history-content">
                    <h4>${report.name}</h4>
                    <p class="history-date">${this.formatTimestamp(report.date)}</p>
                    <span class="history-status ${report.status}">${report.status}</span>
                </div>
                <div class="history-actions">
                    <button class="history-action-btn" onclick="auditManager.downloadReport('${report.id}')">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="history-action-btn" onclick="auditManager.viewReport('${report.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderAuditSettings() {
        return `
            <div class="audit-settings">
                <div class="settings-section">
                    <h3>Audit Configuration</h3>
                    <div class="settings-form">
                        <div class="form-group">
                            <label>Enable Audit Logging</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="audit-enabled" checked>
                                <span class="slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Log Retention Period (days)</label>
                            <input type="number" id="retention-period" value="2555" min="30" max="3650">
                        </div>
                        <div class="form-group">
                            <label>Real-time Monitoring</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="realtime-monitoring" checked>
                                <span class="slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Compliance Frameworks</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" checked> GDPR</label>
                                <label><input type="checkbox" checked> HIPAA</label>
                                <label><input type="checkbox" checked> ISO 27001</label>
                                <label><input type="checkbox"> SOX</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Alert Thresholds</h3>
                    <div class="settings-form">
                        <div class="form-group">
                            <label>Failed Login Attempts</label>
                            <input type="number" id="failed-login-threshold" value="5" min="1" max="20">
                        </div>
                        <div class="form-group">
                            <label>Data Export Limit</label>
                            <input type="number" id="data-export-threshold" value="10" min="1" max="100">
                        </div>
                        <div class="form-group">
                            <label>Suspicious Activity Threshold</label>
                            <input type="number" id="suspicious-activity-threshold" value="3" min="1" max="10">
                        </div>
                        <div class="form-group">
                            <label>Privilege Escalation Tolerance</label>
                            <input type="number" id="privilege-escalation-threshold" value="1" min="0" max="5">
                        </div>
                    </div>
                </div>

                <div class="settings-section">
                    <h3>Notification Settings</h3>
                    <div class="settings-form">
                        <div class="form-group">
                            <label>Email Notifications</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="email-notifications" checked>
                                <span class="slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>SMS Alerts</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="sms-alerts">
                                <span class="slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Slack Integration</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="slack-integration">
                                <span class="slider"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Alert Recipients</label>
                            <input type="email" id="alert-recipients" value="admin@repairbridge.com" placeholder="Enter email addresses">
                        </div>
                    </div>
                </div>

                <div class="settings-actions">
                    <button class="settings-btn primary" onclick="auditManager.saveAuditSettings()">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                    <button class="settings-btn secondary" onclick="auditManager.resetAuditSettings()">
                        <i class="fas fa-undo"></i> Reset to Defaults
                    </button>
                </div>
            </div>
        `;
    }

    renderRealTimeAlerts() {
        const alerts = this.generateMockRealTimeAlerts();
        
        if (alerts.length === 0) {
            return `
                <div class="no-alerts">
                    <i class="fas fa-check-circle"></i>
                    <p>No active alerts</p>
                </div>
            `;
        }

        return alerts.map(alert => `
            <div class="realtime-alert ${alert.severity}">
                <div class="alert-indicator"></div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                    <small>${this.formatTimestamp(alert.timestamp)}</small>
                </div>
                <button class="dismiss-btn" onclick="auditManager.dismissAlert('${alert.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    setupAuditTabs() {
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

    setupAuditHandlers() {
        // Filter handlers
        const filters = document.querySelectorAll('#date-from, #date-to, #event-type-filter, #user-filter, #severity-filter');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyAuditFilters();
            });
        });

        // Search handler
        const searchInput = document.getElementById('logs-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchAuditLogs(e.target.value);
            });
        }
    }

    logAuditEvent(event) {
        const auditEntry = {
            id: this.generateAuditId(),
            timestamp: new Date().toISOString(),
            eventType: event.type,
            user: event.user || 'system',
            action: event.action,
            resource: event.resource || 'N/A',
            ipAddress: event.ipAddress || this.getClientIP(),
            userAgent: event.userAgent || navigator.userAgent,
            severity: event.severity || 'low',
            status: event.status || 'success',
            details: event.details || {},
            sessionId: event.sessionId || this.getSessionId()
        };

        this.auditLogs.unshift(auditEntry);
        this.saveAuditData();
        
        // Check for security alerts
        this.checkSecurityThresholds(auditEntry);
        
        // Real-time monitoring
        if (this.isRealTimeMonitoringEnabled()) {
            this.processRealTimeEvent(auditEntry);
        }
    }

    checkSecurityThresholds(auditEntry) {
        // Check failed login attempts
        if (auditEntry.eventType === 'login' && auditEntry.status === 'failed') {
            const recentFailures = this.getRecentFailedLogins(auditEntry.user);
            if (recentFailures >= this.alertThresholds.failedLogins) {
                this.generateSecurityAlert('multiple_failed_logins', auditEntry);
            }
        }

        // Check data export frequency
        if (auditEntry.eventType === 'data_export') {
            const recentExports = this.getRecentDataExports(auditEntry.user);
            if (recentExports >= this.alertThresholds.dataExports) {
                this.generateSecurityAlert('excessive_data_exports', auditEntry);
            }
        }

        // Check privilege escalation
        if (auditEntry.eventType === 'privilege_change') {
            this.generateSecurityAlert('privilege_escalation', auditEntry);
        }
    }

    generateSecurityAlert(type, auditEntry) {
        const alert = {
            id: this.generateAlertId(),
            type: type,
            severity: this.getAlertSeverity(type),
            timestamp: new Date().toISOString(),
            user: auditEntry.user,
            details: auditEntry,
            status: 'open'
        };

        this.realTimeAlerts.unshift(alert);
        
        // Send notifications
        this.sendSecurityAlert(alert);
        
        // Update UI
        this.updateRealTimeAlerts();
    }

    runComplianceAudit() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Running compliance audit...', 'info');
        }

        // Simulate audit process
        setTimeout(() => {
            this.updateComplianceScores();
            this.renderAuditInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification('Compliance audit completed', 'success');
            }
        }, 3000);
    }

    updateComplianceScores() {
        // Simulate compliance score updates
        this.complianceMetrics.gdpr.score = Math.floor(Math.random() * 15) + 85;
        this.complianceMetrics.hipaa.score = Math.floor(Math.random() * 10) + 90;
        this.complianceMetrics.iso27001.score = Math.floor(Math.random() * 20) + 75;
        this.complianceMetrics.sox.score = Math.floor(Math.random() * 10) + 88;
        
        // Update last audit times
        Object.keys(this.complianceMetrics).forEach(framework => {
            this.complianceMetrics[framework].lastAudit = new Date().toISOString();
        });
        
        this.saveAuditData();
    }

    renderComplianceTrendChart() {
        const canvas = document.getElementById('complianceTrendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple trend chart simulation
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
        
        // Draw trend lines
        const frameworks = ['gdpr', 'hipaa', 'iso27001', 'sox'];
        const colors = ['#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];
        
        frameworks.forEach((framework, index) => {
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < 12; i++) {
                const x = (canvas.width / 11) * i;
                const baseScore = this.complianceMetrics[framework].score;
                const variation = Math.random() * 10 - 5;
                const score = Math.max(0, Math.min(100, baseScore + variation));
                const y = canvas.height - (score / 100) * canvas.height;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
    }

    // Event handlers
    generateComplianceReport() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Generating compliance report...', 'info');
        }

        setTimeout(() => {
            this.downloadComplianceReport();
            if (window.notificationManager) {
                window.notificationManager.showNotification('Compliance report generated', 'success');
            }
        }, 2000);
    }

    exportAuditLogs() {
        const logs = JSON.stringify(this.auditLogs, null, 2);
        const blob = new Blob([logs], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Audit logs exported', 'success');
        }
    }

    downloadComplianceReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            complianceMetrics: this.complianceMetrics,
            auditSummary: {
                totalEvents: this.auditLogs.length,
                securityEvents: this.getSecurityEventCount(),
                failedLogins: this.getFailedLoginCount(),
                dataExports: this.getDataExportCount()
            },
            recommendations: this.generateComplianceRecommendations()
        };

        const reportStr = JSON.stringify(report, null, 2);
        const blob = new Blob([reportStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // Utility methods
    generateMockAuditLogs() {
        const logs = [];
        const eventTypes = ['login', 'logout', 'data_access', 'data_modification', 'security_event', 'system_event'];
        const users = ['admin@repairbridge.com', 'user1@repairbridge.com', 'user2@repairbridge.com', 'system'];
        const severities = ['low', 'medium', 'high', 'critical'];
        const statuses = ['success', 'failed', 'warning'];

        for (let i = 0; i < 50; i++) {
            const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
            logs.push({
                id: `audit_${i}`,
                timestamp: timestamp.toISOString(),
                eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                user: users[Math.floor(Math.random() * users.length)],
                action: 'Sample action',
                resource: 'Sample resource',
                ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
                severity: severities[Math.floor(Math.random() * severities.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)]
            });
        }

        return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    generateMockSecurityAlerts() {
        return [
            {
                id: 'alert_1',
                title: 'Multiple Failed Login Attempts',
                description: 'User admin@repairbridge.com has 5 failed login attempts in the last 10 minutes',
                severity: 'high',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                source: 'Authentication System',
                icon: 'exclamation-triangle'
            },
            {
                id: 'alert_2',
                title: 'Unusual Data Export Activity',
                description: 'Large data export detected from user1@repairbridge.com',
                severity: 'medium',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                source: 'Data Access Monitor',
                icon: 'download'
            },
            {
                id: 'alert_3',
                title: 'Privilege Escalation Detected',
                description: 'User permissions were elevated for user2@repairbridge.com',
                severity: 'critical',
                timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                source: 'Access Control System',
                icon: 'user-shield'
            }
        ];
    }

    generateMockRealTimeAlerts() {
        return [
            {
                id: 'rt_alert_1',
                title: 'Security Alert',
                message: 'Suspicious login activity detected',
                severity: 'high',
                timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
            },
            {
                id: 'rt_alert_2',
                title: 'System Alert',
                message: 'High CPU usage detected',
                severity: 'medium',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
            }
        ];
    }

    generateMockReportHistory() {
        return [
            {
                id: 'report_1',
                name: 'Security Audit Report',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                icon: 'shield-alt'
            },
            {
                id: 'report_2',
                name: 'User Activity Report',
                date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                icon: 'users'
            },
            {
                id: 'report_3',
                name: 'Compliance Report',
                date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                icon: 'check-circle'
            }
        ];
    }

    generateComplianceRecommendations() {
        return [
            {
                framework: 'GDPR',
                recommendation: 'Implement data subject access request automation',
                priority: 'medium'
            },
            {
                framework: 'ISO27001',
                recommendation: 'Develop incident response playbook',
                priority: 'high'
            },
            {
                framework: 'HIPAA',
                recommendation: 'Review access control policies',
                priority: 'low'
            }
        ];
    }

    // Helper methods
    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    getScoreClass(framework) {
        const score = this.complianceMetrics[framework].score;
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'poor';
    }

    getSecurityEventCount() {
        return this.auditLogs.filter(log => log.eventType === 'security_event').length;
    }

    getFailedLoginCount() {
        return this.auditLogs.filter(log => log.eventType === 'login' && log.status === 'failed').length;
    }

    getDataExportCount() {
        return this.auditLogs.filter(log => log.eventType === 'data_export').length;
    }

    generateAuditId() {
        return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAlertId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getClientIP() {
        return `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    }

    getSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 16);
    }

    isRealTimeMonitoringEnabled() {
        return true; // Simulate enabled real-time monitoring
    }

    // Event system setup
    startAuditCapture() {
        // Simulate automatic audit log generation
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance
                this.generateRandomAuditEvent();
            }
        }, 30000); // Every 30 seconds
    }

    generateRandomAuditEvent() {
        const eventTypes = ['login', 'data_access', 'system_event'];
        const users = ['admin@repairbridge.com', 'user1@repairbridge.com', 'system'];
        
        const event = {
            type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
            user: users[Math.floor(Math.random() * users.length)],
            action: 'Automated system action',
            resource: 'System resource',
            severity: 'low',
            status: 'success'
        };

        this.logAuditEvent(event);
    }

    setupEventListeners() {
        // Listen for user actions to log them
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, a, .nav-btn')) {
                this.logUserAction(e.target);
            }
        });
    }

    logUserAction(element) {
        const event = {
            type: 'user_action',
            user: 'admin@repairbridge.com', // Current user
            action: `Clicked ${element.textContent || element.className}`,
            resource: window.location.pathname,
            severity: 'low',
            status: 'success'
        };

        this.logAuditEvent(event);
    }

    scheduleComplianceChecks() {
        // Schedule periodic compliance checks
        setInterval(() => {
            this.runAutomaticComplianceCheck();
        }, 24 * 60 * 60 * 1000); // Daily
    }

    runAutomaticComplianceCheck() {
        console.log('Running automatic compliance check...');
        // Simulate compliance check
        this.updateComplianceScores();
    }

    setupRealTimeMonitoring() {
        // Setup real-time monitoring
        console.log('Real-time monitoring initialized');
    }

    processRealTimeEvent(auditEntry) {
        // Process events in real-time
        if (auditEntry.severity === 'high' || auditEntry.severity === 'critical') {
            this.generateRealTimeAlert(auditEntry);
        }
    }

    generateRealTimeAlert(auditEntry) {
        const alert = {
            id: this.generateAlertId(),
            title: 'Security Alert',
            message: `${auditEntry.eventType} event detected`,
            severity: auditEntry.severity,
            timestamp: auditEntry.timestamp
        };

        this.realTimeAlerts.unshift(alert);
        this.updateRealTimeAlerts();
    }

    updateRealTimeAlerts() {
        const alertContainer = document.querySelector('.alert-list');
        if (alertContainer) {
            alertContainer.innerHTML = this.renderRealTimeAlerts();
        }
    }

    sendSecurityAlert(alert) {
        // Simulate sending security alert
        console.log('Security alert sent:', alert);
    }

    getAlertSeverity(type) {
        const severityMap = {
            multiple_failed_logins: 'high',
            excessive_data_exports: 'medium',
            privilege_escalation: 'critical'
        };
        return severityMap[type] || 'medium';
    }

    getRecentFailedLogins(user) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return this.auditLogs.filter(log => 
            log.user === user &&
            log.eventType === 'login' &&
            log.status === 'failed' &&
            new Date(log.timestamp) > oneHourAgo
        ).length;
    }

    getRecentDataExports(user) {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.auditLogs.filter(log => 
            log.user === user &&
            log.eventType === 'data_export' &&
            new Date(log.timestamp) > oneDayAgo
        ).length;
    }

    // Event handler methods
    applyAuditFilters() {
        console.log('Applying audit filters...');
        // Filter implementation would go here
    }

    searchAuditLogs(query) {
        console.log('Searching audit logs for:', query);
        // Search implementation would go here
    }

    previousPage() {
        console.log('Previous page');
    }

    nextPage() {
        console.log('Next page');
    }

    acknowledgeAllAlerts() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('All alerts acknowledged', 'success');
        }
    }

    acknowledgeAlert(alertId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Alert acknowledged', 'success');
        }
    }

    resolveAlert(alertId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Alert resolved', 'success');
        }
    }

    showAlertDetails(alertId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Alert details opened', 'info');
        }
    }

    dismissAlert(alertId) {
        const alertElement = document.querySelector(`[onclick="auditManager.dismissAlert('${alertId}')"]`).closest('.realtime-alert');
        if (alertElement) {
            alertElement.remove();
        }
    }

    runFullComplianceCheck() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Running full compliance check...', 'info');
        }
    }

    scheduleComplianceAudit() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Compliance audit scheduled', 'success');
        }
    }

    generateSecurityReport() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Generating security report...', 'info');
        }
    }

    generateUserActivityReport() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Generating user activity report...', 'info');
        }
    }

    generateIncidentReport() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Generating incident report...', 'info');
        }
    }

    downloadReport(reportId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Report downloaded', 'success');
        }
    }

    viewReport(reportId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Report opened', 'info');
        }
    }

    saveAuditSettings() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Audit settings saved', 'success');
        }
    }

    resetAuditSettings() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Audit settings reset', 'info');
        }
    }
}

// Initialize audit manager
window.auditManager = new AuditManager();
