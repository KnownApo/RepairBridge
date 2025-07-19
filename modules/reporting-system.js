/**
 * Comprehensive Reporting System
 * Generates reports across all modules and provides business insights
 */

class ReportingSystem {
    constructor() {
        this.reports = [];
        this.reportTemplates = {};
        this.scheduledReports = [];
        
        this.initializeReporting();
        this.setupReportTemplates();
        this.loadSavedReports();
    }

    initializeReporting() {
        // Initialize reporting system
        this.reportData = {
            vehicles: [],
            workOrders: [],
            inventory: [],
            analytics: [],
            diagnostics: [],
            marketplace: []
        };
        
        // Setup report generation intervals
        this.setupAutomaticReports();
    }

    setupReportTemplates() {
        this.reportTemplates = {
            daily: {
                name: 'Daily Operations Report',
                description: 'Daily summary of all operations',
                sections: ['workOrders', 'inventory', 'diagnostics', 'marketplace'],
                schedule: 'daily',
                format: 'comprehensive'
            },
            weekly: {
                name: 'Weekly Performance Report',
                description: 'Weekly performance analysis',
                sections: ['analytics', 'workOrders', 'inventory', 'vehicles'],
                schedule: 'weekly',
                format: 'analysis'
            },
            monthly: {
                name: 'Monthly Business Report',
                description: 'Comprehensive monthly business overview',
                sections: ['all'],
                schedule: 'monthly',
                format: 'executive'
            },
            inventory: {
                name: 'Inventory Status Report',
                description: 'Current inventory levels and requirements',
                sections: ['inventory'],
                schedule: 'on-demand',
                format: 'detailed'
            },
            diagnostic: {
                name: 'Diagnostic Summary Report',
                description: 'Diagnostic activities and findings',
                sections: ['diagnostics', 'workOrders'],
                schedule: 'on-demand',
                format: 'technical'
            },
            financial: {
                name: 'Financial Performance Report',
                description: 'Revenue, costs, and profitability analysis',
                sections: ['marketplace', 'workOrders', 'inventory'],
                schedule: 'monthly',
                format: 'financial'
            }
        };
    }

    loadSavedReports() {
        const savedReports = localStorage.getItem('repairbridge_reports');
        if (savedReports) {
            this.reports = JSON.parse(savedReports);
        }
    }

    saveReports() {
        localStorage.setItem('repairbridge_reports', JSON.stringify(this.reports));
    }

    generateReport(templateId, customOptions = {}) {
        const template = this.reportTemplates[templateId];
        if (!template) {
            throw new Error(`Report template ${templateId} not found`);
        }

        const reportData = this.gatherReportData(template.sections);
        const report = this.createReport(template, reportData, customOptions);
        
        this.reports.unshift(report);
        this.saveReports();
        
        return report;
    }

    gatherReportData(sections) {
        const data = {};

        if (sections.includes('all') || sections.includes('workOrders')) {
            data.workOrders = this.gatherWorkOrderData();
        }

        if (sections.includes('all') || sections.includes('inventory')) {
            data.inventory = this.gatherInventoryData();
        }

        if (sections.includes('all') || sections.includes('diagnostics')) {
            data.diagnostics = this.gatherDiagnosticData();
        }

        if (sections.includes('all') || sections.includes('marketplace')) {
            data.marketplace = this.gatherMarketplaceData();
        }

        if (sections.includes('all') || sections.includes('analytics')) {
            data.analytics = this.gatherAnalyticsData();
        }

        if (sections.includes('all') || sections.includes('vehicles')) {
            data.vehicles = this.gatherVehicleData();
        }

        return data;
    }

    gatherWorkOrderData() {
        if (!window.workOrderManager) return {};

        const workOrders = window.workOrderManager.workOrders || [];
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        return {
            total: workOrders.length,
            completed: workOrders.filter(wo => wo.status === 'Completed').length,
            pending: workOrders.filter(wo => wo.status === 'Pending').length,
            inProgress: workOrders.filter(wo => wo.status === 'In Progress').length,
            overdue: workOrders.filter(wo => {
                const dueDate = new Date(wo.dueDate);
                return dueDate < today && wo.status !== 'Completed';
            }).length,
            thisWeek: workOrders.filter(wo => new Date(wo.createdAt) >= weekAgo).length,
            thisMonth: workOrders.filter(wo => new Date(wo.createdAt) >= monthAgo).length,
            averageCompletionTime: this.calculateAverageCompletionTime(workOrders),
            revenueGenerated: workOrders.reduce((sum, wo) => sum + (wo.totalCost || 0), 0),
            topCustomers: this.getTopCustomers(workOrders),
            serviceTypes: this.getServiceTypeDistribution(workOrders)
        };
    }

    gatherInventoryData() {
        if (!window.inventoryManager) return {};

        const inventory = window.inventoryManager.inventory || [];
        const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
        const outOfStockItems = inventory.filter(item => item.quantity === 0);

        return {
            totalItems: inventory.length,
            totalValue: inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0),
            lowStockCount: lowStockItems.length,
            outOfStockCount: outOfStockItems.length,
            lowStockItems: lowStockItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                minStock: item.minStock,
                category: item.category
            })),
            categoryDistribution: this.getCategoryDistribution(inventory),
            topValueItems: inventory.sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price)).slice(0, 10),
            reorderNeeded: lowStockItems.length,
            averageItemValue: inventory.reduce((sum, item) => sum + item.price, 0) / inventory.length
        };
    }

    gatherDiagnosticData() {
        const diagnosticSessions = JSON.parse(localStorage.getItem('diagnostic_sessions') || '[]');
        const dtcCodes = JSON.parse(localStorage.getItem('dtc_codes') || '[]');

        return {
            totalSessions: diagnosticSessions.length,
            codesFound: dtcCodes.length,
            mostCommonCodes: this.getMostCommonCodes(dtcCodes),
            sessionsByVehicle: this.getSessionsByVehicle(diagnosticSessions),
            averageSessionDuration: this.calculateAverageSessionDuration(diagnosticSessions),
            issueResolutionRate: this.calculateResolutionRate(diagnosticSessions),
            topIssues: this.getTopIssues(diagnosticSessions)
        };
    }

    gatherMarketplaceData() {
        const orders = JSON.parse(localStorage.getItem('marketplace_orders') || '[]');
        const cart = JSON.parse(localStorage.getItem('marketplace_cart') || '[]');

        return {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
            averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0,
            topProducts: this.getTopProducts(orders),
            customerMetrics: this.getCustomerMetrics(orders),
            conversionRate: this.calculateConversionRate(orders, cart),
            seasonalTrends: this.getSeasonalTrends(orders)
        };
    }

    gatherAnalyticsData() {
        if (!window.analyticsManager) return {};

        return {
            pageViews: window.analyticsManager.metrics?.pageViews || 0,
            userSessions: window.analyticsManager.metrics?.userSessions || 0,
            averageSessionDuration: window.analyticsManager.metrics?.averageSessionDuration || 0,
            bounceRate: window.analyticsManager.metrics?.bounceRate || 0,
            conversionRate: window.analyticsManager.metrics?.conversionRate || 0,
            topPages: window.analyticsManager.metrics?.topPages || [],
            userFlow: window.analyticsManager.metrics?.userFlow || [],
            deviceBreakdown: window.analyticsManager.metrics?.deviceBreakdown || {}
        };
    }

    gatherVehicleData() {
        const vehicles = window.vehicleDatabase?.vehicles || [];
        const diagnosticSessions = JSON.parse(localStorage.getItem('diagnostic_sessions') || '[]');

        return {
            totalVehicles: vehicles.length,
            makeDistribution: this.getMakeDistribution(vehicles),
            yearDistribution: this.getYearDistribution(vehicles),
            mostDiagnosedVehicles: this.getMostDiagnosedVehicles(vehicles, diagnosticSessions),
            avgVehicleAge: this.calculateAverageVehicleAge(vehicles),
            fuelTypeDistribution: this.getFuelTypeDistribution(vehicles)
        };
    }

    createReport(template, data, customOptions) {
        const report = {
            id: this.generateReportId(),
            templateId: template.name,
            title: customOptions.title || template.name,
            description: template.description,
            generatedAt: new Date().toISOString(),
            generatedBy: 'System',
            period: customOptions.period || this.getDefaultPeriod(),
            format: customOptions.format || template.format,
            data: data,
            summary: this.generateSummary(data, template),
            recommendations: this.generateRecommendations(data, template),
            charts: this.generateChartData(data, template),
            tables: this.generateTableData(data, template)
        };

        return report;
    }

    generateSummary(data, template) {
        const summary = {
            keyMetrics: [],
            highlights: [],
            concerns: []
        };

        // Work Orders Summary
        if (data.workOrders) {
            summary.keyMetrics.push({
                label: 'Total Work Orders',
                value: data.workOrders.total,
                trend: this.calculateTrend(data.workOrders.thisWeek, data.workOrders.thisMonth)
            });

            summary.keyMetrics.push({
                label: 'Completion Rate',
                value: `${Math.round((data.workOrders.completed / data.workOrders.total) * 100)}%`,
                trend: 'stable'
            });

            if (data.workOrders.overdue > 0) {
                summary.concerns.push(`${data.workOrders.overdue} work orders are overdue`);
            }
        }

        // Inventory Summary
        if (data.inventory) {
            summary.keyMetrics.push({
                label: 'Inventory Value',
                value: `$${data.inventory.totalValue.toLocaleString()}`,
                trend: 'stable'
            });

            if (data.inventory.lowStockCount > 0) {
                summary.concerns.push(`${data.inventory.lowStockCount} items are running low on stock`);
            }

            if (data.inventory.outOfStockCount > 0) {
                summary.concerns.push(`${data.inventory.outOfStockCount} items are out of stock`);
            }
        }

        // Marketplace Summary
        if (data.marketplace) {
            summary.keyMetrics.push({
                label: 'Total Revenue',
                value: `$${data.marketplace.totalRevenue.toLocaleString()}`,
                trend: 'up'
            });

            summary.keyMetrics.push({
                label: 'Average Order Value',
                value: `$${Math.round(data.marketplace.averageOrderValue)}`,
                trend: 'stable'
            });
        }

        return summary;
    }

    generateRecommendations(data, template) {
        const recommendations = [];

        // Work Order Recommendations
        if (data.workOrders) {
            if (data.workOrders.overdue > 0) {
                recommendations.push({
                    priority: 'high',
                    category: 'Operations',
                    title: 'Address Overdue Work Orders',
                    description: `${data.workOrders.overdue} work orders are overdue. Consider reallocating resources or adjusting schedules.`,
                    action: 'Review overdue orders and create action plan'
                });
            }

            if (data.workOrders.completed / data.workOrders.total < 0.8) {
                recommendations.push({
                    priority: 'medium',
                    category: 'Efficiency',
                    title: 'Improve Completion Rate',
                    description: 'Work order completion rate is below 80%. Analyze bottlenecks and streamline processes.',
                    action: 'Conduct workflow analysis'
                });
            }
        }

        // Inventory Recommendations
        if (data.inventory) {
            if (data.inventory.lowStockCount > 0) {
                recommendations.push({
                    priority: 'medium',
                    category: 'Inventory',
                    title: 'Restock Low Inventory Items',
                    description: `${data.inventory.lowStockCount} items need restocking to prevent stockouts.`,
                    action: 'Generate purchase orders for low stock items'
                });
            }

            if (data.inventory.outOfStockCount > 0) {
                recommendations.push({
                    priority: 'high',
                    category: 'Inventory',
                    title: 'Urgent Restocking Required',
                    description: `${data.inventory.outOfStockCount} items are completely out of stock.`,
                    action: 'Immediate procurement action required'
                });
            }
        }

        // Marketplace Recommendations
        if (data.marketplace) {
            if (data.marketplace.conversionRate < 0.05) {
                recommendations.push({
                    priority: 'medium',
                    category: 'Sales',
                    title: 'Improve Conversion Rate',
                    description: 'Marketplace conversion rate is below 5%. Consider improving product descriptions and pricing.',
                    action: 'Optimize product listings and user experience'
                });
            }
        }

        return recommendations;
    }

    generateChartData(data, template) {
        const charts = [];

        // Work Orders Chart
        if (data.workOrders) {
            charts.push({
                type: 'doughnut',
                title: 'Work Order Status Distribution',
                data: {
                    labels: ['Completed', 'In Progress', 'Pending'],
                    datasets: [{
                        data: [data.workOrders.completed, data.workOrders.inProgress, data.workOrders.pending],
                        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444']
                    }]
                }
            });

            charts.push({
                type: 'bar',
                title: 'Service Type Distribution',
                data: {
                    labels: Object.keys(data.workOrders.serviceTypes || {}),
                    datasets: [{
                        label: 'Number of Orders',
                        data: Object.values(data.workOrders.serviceTypes || {}),
                        backgroundColor: '#4facfe'
                    }]
                }
            });
        }

        // Inventory Chart
        if (data.inventory) {
            charts.push({
                type: 'bar',
                title: 'Inventory by Category',
                data: {
                    labels: Object.keys(data.inventory.categoryDistribution || {}),
                    datasets: [{
                        label: 'Number of Items',
                        data: Object.values(data.inventory.categoryDistribution || {}),
                        backgroundColor: '#8b5cf6'
                    }]
                }
            });
        }

        // Marketplace Chart
        if (data.marketplace) {
            charts.push({
                type: 'line',
                title: 'Revenue Trend',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue',
                        data: data.marketplace.seasonalTrends || [0, 0, 0, 0, 0, 0],
                        borderColor: '#10b981',
                        fill: false
                    }]
                }
            });
        }

        return charts;
    }

    generateTableData(data, template) {
        const tables = [];

        // Low Stock Items Table
        if (data.inventory && data.inventory.lowStockItems) {
            tables.push({
                title: 'Low Stock Items',
                headers: ['Item Name', 'Current Stock', 'Min Stock', 'Category'],
                rows: data.inventory.lowStockItems.map(item => [
                    item.name,
                    item.quantity,
                    item.minStock,
                    item.category
                ])
            });
        }

        // Top Customers Table
        if (data.workOrders && data.workOrders.topCustomers) {
            tables.push({
                title: 'Top Customers',
                headers: ['Customer', 'Orders', 'Revenue'],
                rows: data.workOrders.topCustomers.map(customer => [
                    customer.name,
                    customer.orders,
                    `$${customer.revenue.toLocaleString()}`
                ])
            });
        }

        // Top Products Table
        if (data.marketplace && data.marketplace.topProducts) {
            tables.push({
                title: 'Top Products',
                headers: ['Product', 'Orders', 'Revenue'],
                rows: data.marketplace.topProducts.map(product => [
                    product.name,
                    product.orders,
                    `$${product.revenue.toLocaleString()}`
                ])
            });
        }

        return tables;
    }

    renderReportingInterface() {
        const reportingSection = document.getElementById('reporting');
        if (!reportingSection) return;

        reportingSection.innerHTML = `
            <div class="reporting-system">
                <div class="reporting-header">
                    <h2><i class="fas fa-chart-line"></i> Reporting System</h2>
                    <div class="reporting-actions">
                        <button class="generate-report-btn" onclick="reportingSystem.showReportGenerator()">
                            <i class="fas fa-plus"></i> Generate Report
                        </button>
                        <button class="schedule-report-btn" onclick="reportingSystem.showScheduleDialog()">
                            <i class="fas fa-clock"></i> Schedule Report
                        </button>
                    </div>
                </div>

                <div class="report-templates">
                    <h3>Available Report Templates</h3>
                    <div class="template-grid">
                        ${Object.entries(this.reportTemplates).map(([id, template]) => `
                            <div class="template-card" onclick="reportingSystem.generateReport('${id}')">
                                <div class="template-icon">
                                    <i class="fas fa-${this.getTemplateIcon(id)}"></i>
                                </div>
                                <div class="template-content">
                                    <h4>${template.name}</h4>
                                    <p>${template.description}</p>
                                    <div class="template-info">
                                        <span class="schedule">Schedule: ${template.schedule}</span>
                                        <span class="format">Format: ${template.format}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="recent-reports">
                    <h3>Recent Reports</h3>
                    <div class="reports-list">
                        ${this.reports.slice(0, 10).map(report => `
                            <div class="report-item" onclick="reportingSystem.viewReport('${report.id}')">
                                <div class="report-icon">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="report-content">
                                    <h4>${report.title}</h4>
                                    <p>${report.description}</p>
                                    <div class="report-meta">
                                        <span class="generated-at">${new Date(report.generatedAt).toLocaleDateString()}</span>
                                        <span class="format">${report.format}</span>
                                    </div>
                                </div>
                                <div class="report-actions">
                                    <button onclick="event.stopPropagation(); reportingSystem.downloadReport('${report.id}')" title="Download">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button onclick="event.stopPropagation(); reportingSystem.shareReport('${report.id}')" title="Share">
                                        <i class="fas fa-share"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showReportGenerator() {
        // Show report generation dialog
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content report-generator">
                <div class="modal-header">
                    <h3>Generate Custom Report</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Report Template</label>
                        <select id="reportTemplate">
                            ${Object.entries(this.reportTemplates).map(([id, template]) => `
                                <option value="${id}">${template.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Report Title</label>
                        <input type="text" id="reportTitle" placeholder="Enter custom title">
                    </div>
                    <div class="form-group">
                        <label>Date Range</label>
                        <div class="date-range">
                            <input type="date" id="startDate">
                            <span>to</span>
                            <input type="date" id="endDate">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Format</label>
                        <select id="reportFormat">
                            <option value="comprehensive">Comprehensive</option>
                            <option value="summary">Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="executive">Executive</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                    <button class="generate-btn" onclick="reportingSystem.generateCustomReport()">Generate Report</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateCustomReport() {
        const templateId = document.getElementById('reportTemplate').value;
        const title = document.getElementById('reportTitle').value;
        const format = document.getElementById('reportFormat').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const customOptions = {
            title: title || undefined,
            format: format,
            period: {
                start: startDate,
                end: endDate
            }
        };

        const report = this.generateReport(templateId, customOptions);
        
        // Close modal
        document.querySelector('.modal-overlay').remove();
        
        // Show success notification
        if (window.notificationManager) {
            window.notificationManager.showNotification('Report generated successfully!', 'success');
        }
        
        // Refresh interface
        this.renderReportingInterface();
        
        // View the new report
        this.viewReport(report.id);
    }

    viewReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Create report viewer modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay report-viewer';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${report.title}</h3>
                    <div class="report-actions">
                        <button onclick="reportingSystem.downloadReport('${report.id}')" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button onclick="reportingSystem.shareReport('${report.id}')" title="Share">
                            <i class="fas fa-share"></i>
                        </button>
                        <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="modal-body">
                    ${this.renderReportContent(report)}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    renderReportContent(report) {
        return `
            <div class="report-content">
                <div class="report-header">
                    <h1>${report.title}</h1>
                    <div class="report-meta">
                        <span>Generated: ${new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span>Period: ${report.period?.start || 'All time'} - ${report.period?.end || 'Present'}</span>
                    </div>
                </div>

                <div class="report-summary">
                    <h2>Executive Summary</h2>
                    <div class="key-metrics">
                        ${report.summary.keyMetrics.map(metric => `
                            <div class="metric-card">
                                <div class="metric-value">${metric.value}</div>
                                <div class="metric-label">${metric.label}</div>
                                <div class="metric-trend ${metric.trend}">${metric.trend}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${report.summary.concerns.length > 0 ? `
                        <div class="concerns">
                            <h3>Areas of Concern</h3>
                            <ul>
                                ${report.summary.concerns.map(concern => `<li>${concern}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>

                <div class="report-charts">
                    <h2>Visual Analysis</h2>
                    <div class="charts-grid">
                        ${report.charts.map((chart, index) => `
                            <div class="chart-container">
                                <h3>${chart.title}</h3>
                                <canvas id="reportChart${index}" width="400" height="200"></canvas>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="report-tables">
                    <h2>Detailed Data</h2>
                    ${report.tables.map(table => `
                        <div class="table-section">
                            <h3>${table.title}</h3>
                            <table class="report-table">
                                <thead>
                                    <tr>
                                        ${table.headers.map(header => `<th>${header}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${table.rows.map(row => `
                                        <tr>
                                            ${row.map(cell => `<td>${cell}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    `).join('')}
                </div>

                <div class="report-recommendations">
                    <h2>Recommendations</h2>
                    <div class="recommendations-list">
                        ${report.recommendations.map(rec => `
                            <div class="recommendation-item priority-${rec.priority}">
                                <div class="recommendation-header">
                                    <span class="priority-badge">${rec.priority}</span>
                                    <span class="category">${rec.category}</span>
                                    <h4>${rec.title}</h4>
                                </div>
                                <p>${rec.description}</p>
                                <div class="action">${rec.action}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    downloadReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Create downloadable content
        const content = this.generateDownloadableReport(report);
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    generateDownloadableReport(report) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${report.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { border-bottom: 2px solid #333; padding-bottom: 10px; }
                    .metric-card { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; }
                    .chart-container { margin: 20px 0; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .recommendation-item { margin: 15px 0; padding: 15px; border-left: 4px solid #007cba; }
                    .priority-high { border-left-color: #dc3545; }
                    .priority-medium { border-left-color: #ffc107; }
                    .priority-low { border-left-color: #28a745; }
                </style>
            </head>
            <body>
                ${this.renderReportContent(report)}
            </body>
            </html>
        `;
    }

    shareReport(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return;

        // Create share URL (in real implementation, this would be uploaded to a server)
        const shareData = {
            title: report.title,
            text: `Check out this report: ${report.title}`,
            url: window.location.href + `#report=${reportId}`
        };

        if (navigator.share) {
            navigator.share(shareData);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url);
            if (window.notificationManager) {
                window.notificationManager.showNotification('Report link copied to clipboard!', 'success');
            }
        }
    }

    setupAutomaticReports() {
        // Setup automatic report generation
        setInterval(() => {
            const now = new Date();
            const hour = now.getHours();
            
            // Generate daily report at 8 AM
            if (hour === 8 && now.getMinutes() === 0) {
                this.generateReport('daily');
            }
            
            // Generate weekly report on Mondays at 9 AM
            if (now.getDay() === 1 && hour === 9 && now.getMinutes() === 0) {
                this.generateReport('weekly');
            }
            
            // Generate monthly report on the 1st at 10 AM
            if (now.getDate() === 1 && hour === 10 && now.getMinutes() === 0) {
                this.generateReport('monthly');
            }
        }, 60000); // Check every minute
    }

    // Utility methods
    generateReportId() {
        return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getTemplateIcon(templateId) {
        const icons = {
            daily: 'calendar-day',
            weekly: 'calendar-week',
            monthly: 'calendar-alt',
            inventory: 'boxes',
            diagnostic: 'stethoscope',
            financial: 'dollar-sign'
        };
        return icons[templateId] || 'chart-bar';
    }

    getDefaultPeriod() {
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        return {
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0]
        };
    }

    calculateTrend(current, previous) {
        if (!previous || previous === 0) return 'stable';
        const change = ((current - previous) / previous) * 100;
        if (change > 5) return 'up';
        if (change < -5) return 'down';
        return 'stable';
    }

    // Helper calculation methods
    calculateAverageCompletionTime(workOrders) {
        const completed = workOrders.filter(wo => wo.status === 'Completed');
        if (completed.length === 0) return 0;
        
        const totalTime = completed.reduce((sum, wo) => {
            const start = new Date(wo.createdAt);
            const end = new Date(wo.completedAt || wo.updatedAt);
            return sum + (end - start);
        }, 0);
        
        return Math.round(totalTime / completed.length / (1000 * 60 * 60 * 24)); // Days
    }

    getTopCustomers(workOrders) {
        const customerMap = {};
        workOrders.forEach(wo => {
            if (!customerMap[wo.customer]) {
                customerMap[wo.customer] = { name: wo.customer, orders: 0, revenue: 0 };
            }
            customerMap[wo.customer].orders++;
            customerMap[wo.customer].revenue += wo.totalCost || 0;
        });
        
        return Object.values(customerMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    }

    getServiceTypeDistribution(workOrders) {
        const distribution = {};
        workOrders.forEach(wo => {
            const type = wo.serviceType || 'General';
            distribution[type] = (distribution[type] || 0) + 1;
        });
        return distribution;
    }

    getCategoryDistribution(inventory) {
        const distribution = {};
        inventory.forEach(item => {
            distribution[item.category] = (distribution[item.category] || 0) + 1;
        });
        return distribution;
    }

    getMostCommonCodes(dtcCodes) {
        const codeMap = {};
        dtcCodes.forEach(code => {
            codeMap[code.code] = (codeMap[code.code] || 0) + 1;
        });
        
        return Object.entries(codeMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([code, count]) => ({ code, count }));
    }

    getSessionsByVehicle(sessions) {
        const vehicleMap = {};
        sessions.forEach(session => {
            const vehicle = session.vehicle || 'Unknown';
            vehicleMap[vehicle] = (vehicleMap[vehicle] || 0) + 1;
        });
        return vehicleMap;
    }

    calculateAverageSessionDuration(sessions) {
        if (sessions.length === 0) return 0;
        const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
        return Math.round(totalDuration / sessions.length);
    }

    calculateResolutionRate(sessions) {
        if (sessions.length === 0) return 0;
        const resolved = sessions.filter(session => session.resolved).length;
        return Math.round((resolved / sessions.length) * 100);
    }

    getTopIssues(sessions) {
        const issueMap = {};
        sessions.forEach(session => {
            const issue = session.issue || 'Unknown';
            issueMap[issue] = (issueMap[issue] || 0) + 1;
        });
        
        return Object.entries(issueMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([issue, count]) => ({ issue, count }));
    }

    getTopProducts(orders) {
        const productMap = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                if (!productMap[item.name]) {
                    productMap[item.name] = { name: item.name, orders: 0, revenue: 0 };
                }
                productMap[item.name].orders += item.quantity;
                productMap[item.name].revenue += item.price * item.quantity;
            });
        });
        
        return Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);
    }

    getCustomerMetrics(orders) {
        const uniqueCustomers = new Set(orders.map(o => o.customer)).size;
        const returningCustomers = orders.filter(o => o.isReturning).length;
        
        return {
            total: uniqueCustomers,
            returning: returningCustomers,
            retentionRate: uniqueCustomers > 0 ? Math.round((returningCustomers / uniqueCustomers) * 100) : 0
        };
    }

    calculateConversionRate(orders, cartItems) {
        const totalSessions = orders.length + cartItems.length;
        return totalSessions > 0 ? Math.round((orders.length / totalSessions) * 100) : 0;
    }

    getSeasonalTrends(orders) {
        const monthlyRevenue = new Array(12).fill(0);
        orders.forEach(order => {
            const month = new Date(order.date).getMonth();
            monthlyRevenue[month] += order.total;
        });
        return monthlyRevenue;
    }

    getMakeDistribution(vehicles) {
        const distribution = {};
        vehicles.forEach(vehicle => {
            distribution[vehicle.make] = (distribution[vehicle.make] || 0) + 1;
        });
        return distribution;
    }

    getYearDistribution(vehicles) {
        const distribution = {};
        vehicles.forEach(vehicle => {
            const year = vehicle.year || 'Unknown';
            distribution[year] = (distribution[year] || 0) + 1;
        });
        return distribution;
    }

    getMostDiagnosedVehicles(vehicles, sessions) {
        const vehicleMap = {};
        sessions.forEach(session => {
            const vehicleId = session.vehicleId;
            if (vehicleId) {
                vehicleMap[vehicleId] = (vehicleMap[vehicleId] || 0) + 1;
            }
        });
        
        return Object.entries(vehicleMap)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([vehicleId, count]) => {
                const vehicle = vehicles.find(v => v.id === vehicleId);
                return {
                    vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown',
                    sessions: count
                };
            });
    }

    calculateAverageVehicleAge(vehicles) {
        const currentYear = new Date().getFullYear();
        const totalAge = vehicles.reduce((sum, vehicle) => sum + (currentYear - vehicle.year), 0);
        return Math.round(totalAge / vehicles.length);
    }

    getFuelTypeDistribution(vehicles) {
        const distribution = {};
        vehicles.forEach(vehicle => {
            const fuelType = vehicle.fuelType || 'Unknown';
            distribution[fuelType] = (distribution[fuelType] || 0) + 1;
        });
        return distribution;
    }
}

// Initialize reporting system
window.reportingSystem = new ReportingSystem();
