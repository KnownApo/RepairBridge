/**
 * Work Order Management System
 * Handles service requests, work orders, and customer management
 */

class WorkOrderManager {
    constructor() {
        this.workOrders = [];
        this.customers = [];
        this.services = [];
        this.templates = [];
        this.currentWorkOrder = null;
        
        this.initializeWorkOrderSystem();
        this.loadWorkOrderData();
    }

    initializeWorkOrderSystem() {
        // Load existing work orders
        const savedOrders = localStorage.getItem('repairbridge_workorders');
        if (savedOrders) {
            this.workOrders = JSON.parse(savedOrders);
        } else {
            this.generateSampleWorkOrders();
        }

        // Load customers
        const savedCustomers = localStorage.getItem('repairbridge_customers');
        if (savedCustomers) {
            this.customers = JSON.parse(savedCustomers);
        } else {
            this.generateSampleCustomers();
        }

        // Load services
        const savedServices = localStorage.getItem('repairbridge_services');
        if (savedServices) {
            this.services = JSON.parse(savedServices);
        } else {
            this.generateSampleServices();
        }

        // Load templates
        const savedTemplates = localStorage.getItem('repairbridge_templates');
        if (savedTemplates) {
            this.templates = JSON.parse(savedTemplates);
        } else {
            this.generateSampleTemplates();
        }
    }

    generateSampleWorkOrders() {
        const statuses = ['Open', 'In Progress', 'Waiting for Parts', 'Completed', 'Cancelled'];
        const priorities = ['Low', 'Medium', 'High', 'Critical'];
        
        this.workOrders = [
            {
                id: 'WO-001',
                customerName: 'John Doe',
                customerPhone: '(555) 123-4567',
                customerEmail: 'john.doe@email.com',
                vehicleVin: '1FTFW1E50NFB12345',
                vehicleYear: '2023',
                vehicleMake: 'Ford',
                vehicleModel: 'F-150',
                vehicleMileage: '15,432',
                status: 'In Progress',
                priority: 'High',
                createdDate: '2025-07-15',
                dueDate: '2025-07-20',
                assignedTechnician: 'John Smith',
                customerComplaint: 'Engine making strange noise, check engine light is on',
                diagnosticCodes: ['P0300', 'P0171'],
                services: [
                    {
                        name: 'Diagnostic Scan',
                        hours: 1.0,
                        rate: 125.00,
                        parts: [],
                        completed: true
                    },
                    {
                        name: 'Engine Inspection',
                        hours: 2.0,
                        rate: 125.00,
                        parts: [
                            { name: 'Spark Plugs (Set of 8)', cost: 45.99, quantity: 1 },
                            { name: 'Air Filter', cost: 19.99, quantity: 1 }
                        ],
                        completed: false
                    }
                ],
                laborTotal: 375.00,
                partsTotal: 65.98,
                taxRate: 0.0825,
                notes: 'Customer mentioned noise started after last oil change. Investigating possible connection.',
                images: [],
                timeEntries: [
                    { date: '2025-07-15', technician: 'John Smith', hours: 1.0, description: 'Initial diagnostic scan' },
                    { date: '2025-07-16', technician: 'John Smith', hours: 1.5, description: 'Engine inspection and testing' }
                ]
            },
            {
                id: 'WO-002',
                customerName: 'Sarah Johnson',
                customerPhone: '(555) 987-6543',
                customerEmail: 'sarah.johnson@email.com',
                vehicleVin: '2FMDK3GC4MBA12345',
                vehicleYear: '2022',
                vehicleMake: 'Ford',
                vehicleModel: 'Edge',
                vehicleMileage: '28,567',
                status: 'Waiting for Parts',
                priority: 'Medium',
                createdDate: '2025-07-12',
                dueDate: '2025-07-18',
                assignedTechnician: 'Sarah Johnson',
                customerComplaint: 'Brake pedal feels spongy, grinding noise when braking',
                diagnosticCodes: [],
                services: [
                    {
                        name: 'Brake System Inspection',
                        hours: 1.5,
                        rate: 125.00,
                        parts: [
                            { name: 'Brake Pads (Front)', cost: 89.99, quantity: 1 },
                            { name: 'Brake Rotors (Front)', cost: 156.99, quantity: 1 },
                            { name: 'Brake Fluid', cost: 12.99, quantity: 1 }
                        ],
                        completed: false
                    }
                ],
                laborTotal: 187.50,
                partsTotal: 259.97,
                taxRate: 0.0825,
                notes: 'Parts ordered from supplier. ETA: 2 business days.',
                images: [],
                timeEntries: [
                    { date: '2025-07-12', technician: 'Sarah Johnson', hours: 1.5, description: 'Brake system inspection and diagnosis' }
                ]
            },
            {
                id: 'WO-003',
                customerName: 'Mike Wilson',
                customerPhone: '(555) 456-7890',
                customerEmail: 'mike.wilson@email.com',
                vehicleVin: '3GNKBERS5JG123456',
                vehicleYear: '2021',
                vehicleMake: 'Chevrolet',
                vehicleModel: 'Equinox',
                vehicleMileage: '45,123',
                status: 'Completed',
                priority: 'Low',
                createdDate: '2025-07-10',
                dueDate: '2025-07-14',
                assignedTechnician: 'John Smith',
                customerComplaint: 'Routine maintenance - oil change and inspection',
                diagnosticCodes: [],
                services: [
                    {
                        name: 'Oil Change Service',
                        hours: 0.5,
                        rate: 125.00,
                        parts: [
                            { name: 'Engine Oil (5W-30)', cost: 24.99, quantity: 1 },
                            { name: 'Oil Filter', cost: 8.99, quantity: 1 }
                        ],
                        completed: true
                    },
                    {
                        name: 'Multi-Point Inspection',
                        hours: 1.0,
                        rate: 125.00,
                        parts: [],
                        completed: true
                    }
                ],
                laborTotal: 187.50,
                partsTotal: 33.98,
                taxRate: 0.0825,
                notes: 'All systems checked and operating normally. Next service due in 5,000 miles.',
                images: [],
                timeEntries: [
                    { date: '2025-07-10', technician: 'John Smith', hours: 0.5, description: 'Oil change' },
                    { date: '2025-07-10', technician: 'John Smith', hours: 1.0, description: 'Multi-point inspection' }
                ]
            }
        ];
        
        this.saveWorkOrders();
    }

    generateSampleCustomers() {
        this.customers = [
            {
                id: 'CUST-001',
                name: 'John Doe',
                phone: '(555) 123-4567',
                email: 'john.doe@email.com',
                address: '123 Main St, Anytown, ST 12345',
                vehicles: [
                    { vin: '1FTFW1E50NFB12345', year: '2023', make: 'Ford', model: 'F-150' }
                ],
                notes: 'Preferred customer, fleet account',
                createdDate: '2023-01-15'
            },
            {
                id: 'CUST-002',
                name: 'Sarah Johnson',
                phone: '(555) 987-6543',
                email: 'sarah.johnson@email.com',
                address: '456 Oak Ave, Somewhere, ST 67890',
                vehicles: [
                    { vin: '2FMDK3GC4MBA12345', year: '2022', make: 'Ford', model: 'Edge' }
                ],
                notes: 'Regular customer, always on time',
                createdDate: '2022-03-22'
            },
            {
                id: 'CUST-003',
                name: 'Mike Wilson',
                phone: '(555) 456-7890',
                email: 'mike.wilson@email.com',
                address: '789 Pine Rd, Elsewhere, ST 54321',
                vehicles: [
                    { vin: '3GNKBERS5JG123456', year: '2021', make: 'Chevrolet', model: 'Equinox' }
                ],
                notes: 'Prefers early morning appointments',
                createdDate: '2021-06-10'
            }
        ];
        
        this.saveCustomers();
    }

    generateSampleServices() {
        this.services = [
            {
                id: 'SVC-001',
                name: 'Oil Change Service',
                description: 'Complete oil and filter change',
                category: 'Maintenance',
                laborHours: 0.5,
                laborRate: 125.00,
                commonParts: [
                    { name: 'Engine Oil (5W-30)', cost: 24.99 },
                    { name: 'Oil Filter', cost: 8.99 }
                ]
            },
            {
                id: 'SVC-002',
                name: 'Brake System Inspection',
                description: 'Complete brake system diagnosis and repair',
                category: 'Brakes',
                laborHours: 1.5,
                laborRate: 125.00,
                commonParts: [
                    { name: 'Brake Pads (Front)', cost: 89.99 },
                    { name: 'Brake Rotors (Front)', cost: 156.99 },
                    { name: 'Brake Fluid', cost: 12.99 }
                ]
            },
            {
                id: 'SVC-003',
                name: 'Engine Diagnostic',
                description: 'Comprehensive engine diagnostic scan',
                category: 'Diagnostics',
                laborHours: 1.0,
                laborRate: 125.00,
                commonParts: []
            },
            {
                id: 'SVC-004',
                name: 'Transmission Service',
                description: 'Transmission fluid and filter service',
                category: 'Transmission',
                laborHours: 2.0,
                laborRate: 125.00,
                commonParts: [
                    { name: 'Transmission Fluid', cost: 35.99 },
                    { name: 'Transmission Filter', cost: 45.99 }
                ]
            }
        ];
        
        this.saveServices();
    }

    generateSampleTemplates() {
        this.templates = [
            {
                id: 'TMPL-001',
                name: 'Basic Oil Change',
                description: 'Standard oil change template',
                services: ['SVC-001'],
                estimatedTime: 0.5,
                estimatedCost: 62.48
            },
            {
                id: 'TMPL-002',
                name: 'Brake Service Package',
                description: 'Complete brake service including pads and rotors',
                services: ['SVC-002'],
                estimatedTime: 3.0,
                estimatedCost: 447.47
            },
            {
                id: 'TMPL-003',
                name: 'Engine Diagnostic Package',
                description: 'Comprehensive engine diagnostic and basic repairs',
                services: ['SVC-003'],
                estimatedTime: 2.0,
                estimatedCost: 250.00
            }
        ];
        
        this.saveTemplates();
    }

    createWorkOrder(workOrderData) {
        const newId = this.generateWorkOrderId();
        const workOrder = {
            id: newId,
            ...workOrderData,
            status: 'Open',
            createdDate: new Date().toISOString().split('T')[0],
            services: [],
            laborTotal: 0,
            partsTotal: 0,
            taxRate: 0.0825,
            notes: '',
            images: [],
            timeEntries: []
        };

        this.workOrders.push(workOrder);
        this.saveWorkOrders();
        
        return workOrder;
    }

    updateWorkOrder(id, updates) {
        const index = this.workOrders.findIndex(wo => wo.id === id);
        if (index !== -1) {
            this.workOrders[index] = { ...this.workOrders[index], ...updates };
            this.saveWorkOrders();
            return this.workOrders[index];
        }
        return null;
    }

    deleteWorkOrder(id) {
        this.workOrders = this.workOrders.filter(wo => wo.id !== id);
        this.saveWorkOrders();
    }

    getWorkOrder(id) {
        return this.workOrders.find(wo => wo.id === id);
    }

    getWorkOrdersByStatus(status) {
        return this.workOrders.filter(wo => wo.status === status);
    }

    getWorkOrdersByTechnician(technician) {
        return this.workOrders.filter(wo => wo.assignedTechnician === technician);
    }

    renderWorkOrderManagement() {
        const workOrderSection = document.getElementById('work-orders');
        if (!workOrderSection) return;

        workOrderSection.innerHTML = `
            <div class="work-order-management">
                <div class="work-order-header">
                    <h2><i class="fas fa-clipboard-list"></i> Work Order Management</h2>
                    <div class="work-order-actions">
                        <button class="create-wo-btn" onclick="workOrderManager.showCreateWorkOrderModal()">
                            <i class="fas fa-plus"></i> New Work Order
                        </button>
                        <button class="template-btn" onclick="workOrderManager.showTemplateManager()">
                            <i class="fas fa-file-alt"></i> Templates
                        </button>
                    </div>
                </div>

                <div class="work-order-filters">
                    <div class="filter-group">
                        <label>Status:</label>
                        <select id="statusFilter" onchange="workOrderManager.applyFilters()">
                            <option value="">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Waiting for Parts">Waiting for Parts</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Technician:</label>
                        <select id="technicianFilter" onchange="workOrderManager.applyFilters()">
                            <option value="">All Technicians</option>
                            <option value="John Smith">John Smith</option>
                            <option value="Sarah Johnson">Sarah Johnson</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Priority:</label>
                        <select id="priorityFilter" onchange="workOrderManager.applyFilters()">
                            <option value="">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <input type="text" id="searchFilter" placeholder="Search work orders..." oninput="workOrderManager.applyFilters()">
                    </div>
                </div>

                <div class="work-order-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-folder-open"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${this.getWorkOrdersByStatus('Open').length}</h3>
                            <p>Open Orders</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${this.getWorkOrdersByStatus('In Progress').length}</h3>
                            <p>In Progress</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${this.getWorkOrdersByStatus('Waiting for Parts').length}</h3>
                            <p>Waiting for Parts</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <h3>${this.getWorkOrdersByStatus('Completed').length}</h3>
                            <p>Completed</p>
                        </div>
                    </div>
                </div>

                <div class="work-order-list">
                    <div class="work-order-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Work Order #</th>
                                    <th>Customer</th>
                                    <th>Vehicle</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Technician</th>
                                    <th>Due Date</th>
                                    <th>Total</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="workOrderTableBody">
                                ${this.renderWorkOrderRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.attachWorkOrderEventListeners();
    }

    renderWorkOrderRows() {
        return this.workOrders.map(wo => {
            const total = wo.laborTotal + wo.partsTotal + (wo.laborTotal + wo.partsTotal) * wo.taxRate;
            const statusClass = wo.status.toLowerCase().replace(/\s+/g, '-');
            const priorityClass = wo.priority.toLowerCase();
            
            return `
                <tr class="work-order-row" data-id="${wo.id}">
                    <td class="wo-id">${wo.id}</td>
                    <td class="customer-info">
                        <div class="customer-name">${wo.customerName}</div>
                        <div class="customer-contact">${wo.customerPhone}</div>
                    </td>
                    <td class="vehicle-info">
                        <div class="vehicle-details">${wo.vehicleYear} ${wo.vehicleMake} ${wo.vehicleModel}</div>
                        <div class="vehicle-vin">${wo.vehicleVin}</div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${wo.status}</span>
                    </td>
                    <td>
                        <span class="priority-badge ${priorityClass}">${wo.priority}</span>
                    </td>
                    <td class="technician">${wo.assignedTechnician}</td>
                    <td class="due-date">${new Date(wo.dueDate).toLocaleDateString()}</td>
                    <td class="total-cost">$${total.toFixed(2)}</td>
                    <td class="actions">
                        <button class="action-btn view-btn" onclick="workOrderManager.viewWorkOrder('${wo.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="workOrderManager.editWorkOrder('${wo.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn print-btn" onclick="workOrderManager.printWorkOrder('${wo.id}')" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="workOrderManager.deleteWorkOrderConfirm('${wo.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    attachWorkOrderEventListeners() {
        // Work order row click events
        const workOrderRows = document.querySelectorAll('.work-order-row');
        workOrderRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.actions')) {
                    const workOrderId = row.dataset.id;
                    this.viewWorkOrder(workOrderId);
                }
            });
        });
    }

    applyFilters() {
        const statusFilter = document.getElementById('statusFilter').value;
        const technicianFilter = document.getElementById('technicianFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

        let filteredOrders = this.workOrders;

        if (statusFilter) {
            filteredOrders = filteredOrders.filter(wo => wo.status === statusFilter);
        }

        if (technicianFilter) {
            filteredOrders = filteredOrders.filter(wo => wo.assignedTechnician === technicianFilter);
        }

        if (priorityFilter) {
            filteredOrders = filteredOrders.filter(wo => wo.priority === priorityFilter);
        }

        if (searchFilter) {
            filteredOrders = filteredOrders.filter(wo => 
                wo.customerName.toLowerCase().includes(searchFilter) ||
                wo.vehicleVin.toLowerCase().includes(searchFilter) ||
                wo.id.toLowerCase().includes(searchFilter)
            );
        }

        // Update the table with filtered results
        const tbody = document.getElementById('workOrderTableBody');
        if (tbody) {
            tbody.innerHTML = this.renderFilteredWorkOrderRows(filteredOrders);
        }
    }

    renderFilteredWorkOrderRows(filteredOrders) {
        return filteredOrders.map(wo => {
            const total = wo.laborTotal + wo.partsTotal + (wo.laborTotal + wo.partsTotal) * wo.taxRate;
            const statusClass = wo.status.toLowerCase().replace(/\s+/g, '-');
            const priorityClass = wo.priority.toLowerCase();
            
            return `
                <tr class="work-order-row" data-id="${wo.id}">
                    <td class="wo-id">${wo.id}</td>
                    <td class="customer-info">
                        <div class="customer-name">${wo.customerName}</div>
                        <div class="customer-contact">${wo.customerPhone}</div>
                    </td>
                    <td class="vehicle-info">
                        <div class="vehicle-details">${wo.vehicleYear} ${wo.vehicleMake} ${wo.vehicleModel}</div>
                        <div class="vehicle-vin">${wo.vehicleVin}</div>
                    </td>
                    <td>
                        <span class="status-badge ${statusClass}">${wo.status}</span>
                    </td>
                    <td>
                        <span class="priority-badge ${priorityClass}">${wo.priority}</span>
                    </td>
                    <td class="technician">${wo.assignedTechnician}</td>
                    <td class="due-date">${new Date(wo.dueDate).toLocaleDateString()}</td>
                    <td class="total-cost">$${total.toFixed(2)}</td>
                    <td class="actions">
                        <button class="action-btn view-btn" onclick="workOrderManager.viewWorkOrder('${wo.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="workOrderManager.editWorkOrder('${wo.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn print-btn" onclick="workOrderManager.printWorkOrder('${wo.id}')" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="workOrderManager.deleteWorkOrderConfirm('${wo.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    showCreateWorkOrderModal() {
        window.app.showNotification('Work Order creation modal opening...', 'info');
        // This would show a comprehensive work order creation form
    }

    showTemplateManager() {
        window.app.showNotification('Template manager opening...', 'info');
        // This would show template management interface
    }

    viewWorkOrder(id) {
        const workOrder = this.getWorkOrder(id);
        if (workOrder) {
            window.app.showNotification(`Viewing work order ${id}`, 'info');
            // This would show detailed work order view
        }
    }

    editWorkOrder(id) {
        const workOrder = this.getWorkOrder(id);
        if (workOrder) {
            window.app.showNotification(`Editing work order ${id}`, 'info');
            // This would show work order editing interface
        }
    }

    printWorkOrder(id) {
        const workOrder = this.getWorkOrder(id);
        if (workOrder) {
            window.app.showNotification(`Printing work order ${id}`, 'info');
            // This would trigger print functionality
        }
    }

    deleteWorkOrderConfirm(id) {
        if (confirm('Are you sure you want to delete this work order?')) {
            this.deleteWorkOrder(id);
            window.app.showNotification('Work order deleted successfully', 'success');
            this.renderWorkOrderManagement();
        }
    }

    generateWorkOrderId() {
        const prefix = 'WO-';
        const lastId = this.workOrders.length > 0 ? 
            Math.max(...this.workOrders.map(wo => parseInt(wo.id.replace(prefix, '')))) : 0;
        return prefix + String(lastId + 1).padStart(3, '0');
    }

    saveWorkOrders() {
        localStorage.setItem('repairbridge_workorders', JSON.stringify(this.workOrders));
    }

    saveCustomers() {
        localStorage.setItem('repairbridge_customers', JSON.stringify(this.customers));
    }

    saveServices() {
        localStorage.setItem('repairbridge_services', JSON.stringify(this.services));
    }

    saveTemplates() {
        localStorage.setItem('repairbridge_templates', JSON.stringify(this.templates));
    }

    loadWorkOrderData() {
        // Load any additional work order data
        console.log('Work order data loaded successfully');
    }
}

// Initialize work order manager
window.workOrderManager = new WorkOrderManager();
