/**
 * Inventory Management System
 * Handles parts inventory, suppliers, ordering, and stock tracking
 */

class InventoryManager {
    constructor() {
        this.inventory = [];
        this.suppliers = [];
        this.orders = [];
        this.categories = [];
        this.lowStockAlerts = [];
        this.transactions = [];
        
        this.initializeInventorySystem();
        this.loadInventoryData();
        this.setupAutomatedTasks();
    }

    initializeInventorySystem() {
        // Load existing inventory
        const savedInventory = localStorage.getItem('repairbridge_inventory');
        if (savedInventory) {
            this.inventory = JSON.parse(savedInventory);
        } else {
            this.generateSampleInventory();
        }

        // Load suppliers
        const savedSuppliers = localStorage.getItem('repairbridge_suppliers');
        if (savedSuppliers) {
            this.suppliers = JSON.parse(savedSuppliers);
        } else {
            this.generateSampleSuppliers();
        }

        // Load orders
        const savedOrders = localStorage.getItem('repairbridge_orders');
        if (savedOrders) {
            this.orders = JSON.parse(savedOrders);
        } else {
            this.generateSampleOrders();
        }

        // Load categories
        const savedCategories = localStorage.getItem('repairbridge_categories');
        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        } else {
            this.generateSampleCategories();
        }

        // Load transactions
        const savedTransactions = localStorage.getItem('repairbridge_transactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            this.transactions = [];
        }
    }

    generateSampleInventory() {
        this.inventory = [
            {
                id: 'INV-001',
                partNumber: 'OF-001',
                name: 'Engine Oil Filter',
                description: 'Premium oil filter for most vehicles',
                category: 'Filters',
                brand: 'AC Delco',
                supplier: 'AutoZone',
                costPrice: 6.99,
                retailPrice: 12.99,
                currentStock: 45,
                minStockLevel: 10,
                maxStockLevel: 100,
                reorderQuantity: 50,
                location: 'A1-B2',
                barcode: '123456789012',
                weight: 0.5,
                dimensions: '4x4x6 inches',
                vehicleCompatibility: ['Ford', 'Chevrolet', 'Toyota'],
                lastRestocked: '2025-07-10',
                expirationDate: null,
                warranty: '12 months',
                notes: 'High-quality OEM replacement filter'
            },
            {
                id: 'INV-002',
                partNumber: 'BP-001',
                name: 'Brake Pads Set (Front)',
                description: 'Ceramic brake pads for front wheels',
                category: 'Brakes',
                brand: 'Brembo',
                supplier: 'NAPA Auto Parts',
                costPrice: 65.99,
                retailPrice: 89.99,
                currentStock: 12,
                minStockLevel: 5,
                maxStockLevel: 30,
                reorderQuantity: 20,
                location: 'B2-C3',
                barcode: '234567890123',
                weight: 3.2,
                dimensions: '8x6x2 inches',
                vehicleCompatibility: ['Honda', 'Toyota', 'Nissan'],
                lastRestocked: '2025-07-05',
                expirationDate: null,
                warranty: '24 months',
                notes: 'Premium ceramic compound for quiet operation'
            },
            {
                id: 'INV-003',
                partNumber: 'SP-001',
                name: 'Spark Plugs (Set of 4)',
                description: 'Iridium spark plugs for improved performance',
                category: 'Ignition',
                brand: 'NGK',
                supplier: 'AutoZone',
                costPrice: 28.99,
                retailPrice: 45.99,
                currentStock: 8,
                minStockLevel: 12,
                maxStockLevel: 48,
                reorderQuantity: 24,
                location: 'C1-D2',
                barcode: '345678901234',
                weight: 0.8,
                dimensions: '6x4x2 inches',
                vehicleCompatibility: ['Ford', 'Chevrolet', 'Dodge'],
                lastRestocked: '2025-06-28',
                expirationDate: null,
                warranty: '100,000 miles',
                notes: 'Long-life iridium plugs for extended service intervals'
            },
            {
                id: 'INV-004',
                partNumber: 'EO-001',
                name: 'Engine Oil (5W-30)',
                description: 'Full synthetic motor oil',
                category: 'Fluids',
                brand: 'Mobil 1',
                supplier: 'O\'Reilly Auto Parts',
                costPrice: 18.99,
                retailPrice: 24.99,
                currentStock: 24,
                minStockLevel: 20,
                maxStockLevel: 60,
                reorderQuantity: 36,
                location: 'D1-E2',
                barcode: '456789012345',
                weight: 8.5,
                dimensions: '10x6x10 inches',
                vehicleCompatibility: ['Universal'],
                lastRestocked: '2025-07-12',
                expirationDate: '2027-07-12',
                warranty: 'N/A',
                notes: 'High-performance synthetic oil for all seasons'
            },
            {
                id: 'INV-005',
                partNumber: 'AF-001',
                name: 'Air Filter',
                description: 'High-flow air filter for improved performance',
                category: 'Filters',
                brand: 'K&N',
                supplier: 'Summit Racing',
                costPrice: 35.99,
                retailPrice: 49.99,
                currentStock: 6,
                minStockLevel: 8,
                maxStockLevel: 32,
                reorderQuantity: 16,
                location: 'A2-B3',
                barcode: '567890123456',
                weight: 1.2,
                dimensions: '12x8x2 inches',
                vehicleCompatibility: ['Ford', 'Chevrolet'],
                lastRestocked: '2025-06-15',
                expirationDate: null,
                warranty: '1 million miles',
                notes: 'Reusable high-performance air filter'
            },
            {
                id: 'INV-006',
                partNumber: 'BR-001',
                name: 'Brake Rotors (Front Pair)',
                description: 'Vented brake rotors for superior cooling',
                category: 'Brakes',
                brand: 'PowerStop',
                supplier: 'NAPA Auto Parts',
                costPrice: 125.99,
                retailPrice: 156.99,
                currentStock: 4,
                minStockLevel: 6,
                maxStockLevel: 18,
                reorderQuantity: 12,
                location: 'B3-C4',
                barcode: '678901234567',
                weight: 25.0,
                dimensions: '12x12x4 inches',
                vehicleCompatibility: ['Honda', 'Toyota', 'Nissan'],
                lastRestocked: '2025-07-01',
                expirationDate: null,
                warranty: '36 months',
                notes: 'Cross-drilled and slotted for performance applications'
            }
        ];
        
        this.saveInventory();
        this.checkLowStockAlerts();
    }

    generateSampleSuppliers() {
        this.suppliers = [
            {
                id: 'SUP-001',
                name: 'AutoZone',
                contactPerson: 'Mike Johnson',
                phone: '(555) 123-4567',
                email: 'mike.johnson@autozone.com',
                address: '123 Industrial Blvd, Parts City, ST 12345',
                website: 'www.autozone.com',
                accountNumber: 'AZ-12345',
                paymentTerms: 'Net 30',
                discountRate: 0.15,
                deliveryTime: 2,
                minimumOrder: 500.00,
                rating: 4.5,
                categories: ['Filters', 'Ignition', 'Fluids'],
                notes: 'Reliable supplier with fast delivery'
            },
            {
                id: 'SUP-002',
                name: 'NAPA Auto Parts',
                contactPerson: 'Sarah Williams',
                phone: '(555) 987-6543',
                email: 'sarah.williams@napaparts.com',
                address: '456 Commerce Ave, Supply Town, ST 67890',
                website: 'www.napaonline.com',
                accountNumber: 'NAPA-67890',
                paymentTerms: 'Net 45',
                discountRate: 0.12,
                deliveryTime: 3,
                minimumOrder: 750.00,
                rating: 4.8,
                categories: ['Brakes', 'Suspension', 'Engine'],
                notes: 'Premium quality parts with excellent support'
            },
            {
                id: 'SUP-003',
                name: 'O\'Reilly Auto Parts',
                contactPerson: 'David Brown',
                phone: '(555) 456-7890',
                email: 'david.brown@oreillyauto.com',
                address: '789 Distribution Dr, Warehouse City, ST 54321',
                website: 'www.oreillyauto.com',
                accountNumber: 'ORA-54321',
                paymentTerms: 'Net 30',
                discountRate: 0.10,
                deliveryTime: 1,
                minimumOrder: 300.00,
                rating: 4.3,
                categories: ['Fluids', 'Electrical', 'Tools'],
                notes: 'Local supplier with same-day delivery'
            },
            {
                id: 'SUP-004',
                name: 'Summit Racing',
                contactPerson: 'Jennifer Davis',
                phone: '(555) 321-6547',
                email: 'jennifer.davis@summitracing.com',
                address: '321 Performance Rd, Speed City, ST 98765',
                website: 'www.summitracing.com',
                accountNumber: 'SUM-98765',
                paymentTerms: 'Net 30',
                discountRate: 0.08,
                deliveryTime: 4,
                minimumOrder: 1000.00,
                rating: 4.7,
                categories: ['Performance', 'Racing', 'Specialty'],
                notes: 'Specialized performance parts supplier'
            }
        ];
        
        this.saveSuppliers();
    }

    generateSampleOrders() {
        this.orders = [
            {
                id: 'PO-001',
                supplier: 'AutoZone',
                orderDate: '2025-07-15',
                expectedDelivery: '2025-07-17',
                status: 'Pending',
                items: [
                    { partNumber: 'OF-001', quantity: 50, unitCost: 6.99, totalCost: 349.50 },
                    { partNumber: 'SP-001', quantity: 24, unitCost: 28.99, totalCost: 695.76 }
                ],
                subtotal: 1045.26,
                tax: 86.23,
                shipping: 25.00,
                total: 1156.49,
                notes: 'Rush order for low stock items'
            },
            {
                id: 'PO-002',
                supplier: 'NAPA Auto Parts',
                orderDate: '2025-07-12',
                expectedDelivery: '2025-07-18',
                status: 'Shipped',
                items: [
                    { partNumber: 'BP-001', quantity: 20, unitCost: 65.99, totalCost: 1319.80 },
                    { partNumber: 'BR-001', quantity: 12, unitCost: 125.99, totalCost: 1511.88 }
                ],
                subtotal: 2831.68,
                tax: 233.61,
                shipping: 45.00,
                total: 3110.29,
                notes: 'Brake system restock order'
            },
            {
                id: 'PO-003',
                supplier: 'O\'Reilly Auto Parts',
                orderDate: '2025-07-10',
                expectedDelivery: '2025-07-11',
                status: 'Delivered',
                items: [
                    { partNumber: 'EO-001', quantity: 36, unitCost: 18.99, totalCost: 683.64 }
                ],
                subtotal: 683.64,
                tax: 56.40,
                shipping: 0.00,
                total: 740.04,
                notes: 'Regular oil stock replenishment'
            }
        ];
        
        this.saveOrders();
    }

    generateSampleCategories() {
        this.categories = [
            {
                id: 'CAT-001',
                name: 'Filters',
                description: 'Oil, air, fuel, and cabin filters',
                icon: 'fas fa-filter',
                color: '#4facfe',
                parentCategory: null,
                subcategories: ['Oil Filters', 'Air Filters', 'Fuel Filters', 'Cabin Filters']
            },
            {
                id: 'CAT-002',
                name: 'Brakes',
                description: 'Brake pads, rotors, calipers, and fluid',
                icon: 'fas fa-stop-circle',
                color: '#ef4444',
                parentCategory: null,
                subcategories: ['Brake Pads', 'Brake Rotors', 'Brake Fluid', 'Brake Lines']
            },
            {
                id: 'CAT-003',
                name: 'Ignition',
                description: 'Spark plugs, ignition coils, and wires',
                icon: 'fas fa-bolt',
                color: '#f59e0b',
                parentCategory: null,
                subcategories: ['Spark Plugs', 'Ignition Coils', 'Ignition Wires', 'Distributors']
            },
            {
                id: 'CAT-004',
                name: 'Fluids',
                description: 'Motor oil, transmission fluid, coolant',
                icon: 'fas fa-tint',
                color: '#22c55e',
                parentCategory: null,
                subcategories: ['Motor Oil', 'Transmission Fluid', 'Coolant', 'Brake Fluid']
            },
            {
                id: 'CAT-005',
                name: 'Engine',
                description: 'Engine components and accessories',
                icon: 'fas fa-cog',
                color: '#8b5cf6',
                parentCategory: null,
                subcategories: ['Pistons', 'Gaskets', 'Belts', 'Hoses']
            },
            {
                id: 'CAT-006',
                name: 'Electrical',
                description: 'Batteries, alternators, starters',
                icon: 'fas fa-battery-three-quarters',
                color: '#06b6d4',
                parentCategory: null,
                subcategories: ['Batteries', 'Alternators', 'Starters', 'Fuses']
            }
        ];
        
        this.saveCategories();
    }

    renderInventoryManagement() {
        const inventorySection = document.getElementById('inventory');
        if (!inventorySection) return;

        inventorySection.innerHTML = `
            <div class="inventory-management">
                <div class="inventory-header">
                    <h2><i class="fas fa-boxes"></i> Inventory Management</h2>
                    <div class="inventory-actions">
                        <button class="add-item-btn" onclick="inventoryManager.showAddItemModal()">
                            <i class="fas fa-plus"></i> Add Item
                        </button>
                        <button class="reorder-btn" onclick="inventoryManager.showReorderReport()">
                            <i class="fas fa-shopping-cart"></i> Reorder Report
                        </button>
                        <button class="import-btn" onclick="inventoryManager.showImportModal()">
                            <i class="fas fa-file-import"></i> Import
                        </button>
                        <button class="export-btn" onclick="inventoryManager.exportInventory()">
                            <i class="fas fa-file-export"></i> Export
                        </button>
                    </div>
                </div>

                <div class="inventory-overview">
                    <div class="overview-stats">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-boxes"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.inventory.length}</h3>
                                <p>Total Items</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-content">
                                <h3>$${this.calculateTotalInventoryValue().toLocaleString()}</h3>
                                <p>Total Value</p>
                            </div>
                        </div>
                        <div class="stat-card warning">
                            <div class="stat-icon">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.getLowStockItems().length}</h3>
                                <p>Low Stock Items</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <i class="fas fa-truck"></i>
                            </div>
                            <div class="stat-content">
                                <h3>${this.orders.filter(o => o.status === 'Pending').length}</h3>
                                <p>Pending Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="inventory-tabs">
                    <button class="tab-btn active" data-tab="inventory-list">
                        <i class="fas fa-list"></i> Inventory List
                    </button>
                    <button class="tab-btn" data-tab="categories">
                        <i class="fas fa-tags"></i> Categories
                    </button>
                    <button class="tab-btn" data-tab="suppliers">
                        <i class="fas fa-truck"></i> Suppliers
                    </button>
                    <button class="tab-btn" data-tab="orders">
                        <i class="fas fa-shopping-cart"></i> Orders
                    </button>
                    <button class="tab-btn" data-tab="reports">
                        <i class="fas fa-chart-bar"></i> Reports
                    </button>
                </div>

                <div class="inventory-content">
                    <div class="tab-content active" id="inventory-list">
                        <div class="inventory-filters">
                            <div class="filter-group">
                                <label>Category:</label>
                                <select id="categoryFilter" onchange="inventoryManager.applyFilters()">
                                    <option value="">All Categories</option>
                                    ${this.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Supplier:</label>
                                <select id="supplierFilter" onchange="inventoryManager.applyFilters()">
                                    <option value="">All Suppliers</option>
                                    ${this.suppliers.map(sup => `<option value="${sup.name}">${sup.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="filter-group">
                                <label>Stock Status:</label>
                                <select id="stockFilter" onchange="inventoryManager.applyFilters()">
                                    <option value="">All Items</option>
                                    <option value="low">Low Stock</option>
                                    <option value="normal">Normal Stock</option>
                                    <option value="overstock">Overstock</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <input type="text" id="searchFilter" placeholder="Search items..." oninput="inventoryManager.applyFilters()">
                            </div>
                        </div>

                        <div class="inventory-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Part Number</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Supplier</th>
                                        <th>Current Stock</th>
                                        <th>Min Level</th>
                                        <th>Cost</th>
                                        <th>Retail</th>
                                        <th>Location</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="inventoryTableBody">
                                    ${this.renderInventoryRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="tab-content" id="categories">
                        <div class="categories-grid">
                            ${this.renderCategoriesGrid()}
                        </div>
                    </div>

                    <div class="tab-content" id="suppliers">
                        <div class="suppliers-grid">
                            ${this.renderSuppliersGrid()}
                        </div>
                    </div>

                    <div class="tab-content" id="orders">
                        <div class="orders-list">
                            ${this.renderOrdersList()}
                        </div>
                    </div>

                    <div class="tab-content" id="reports">
                        <div class="reports-dashboard">
                            ${this.renderReportsDashboard()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachInventoryEventListeners();
    }

    renderInventoryRows() {
        return this.inventory.map(item => {
            const stockStatus = this.getStockStatus(item);
            const stockClass = stockStatus.toLowerCase().replace(' ', '-');
            
            return `
                <tr class="inventory-row ${stockClass}" data-id="${item.id}">
                    <td class="part-number">${item.partNumber}</td>
                    <td class="item-name">
                        <div class="name-info">
                            <strong>${item.name}</strong>
                            <small>${item.brand}</small>
                        </div>
                    </td>
                    <td class="category">${item.category}</td>
                    <td class="supplier">${item.supplier}</td>
                    <td class="stock-level">
                        <span class="stock-badge ${stockClass}">
                            ${item.currentStock}
                        </span>
                    </td>
                    <td class="min-level">${item.minStockLevel}</td>
                    <td class="cost-price">$${item.costPrice.toFixed(2)}</td>
                    <td class="retail-price">$${item.retailPrice.toFixed(2)}</td>
                    <td class="location">${item.location}</td>
                    <td class="actions">
                        <button class="action-btn view-btn" onclick="inventoryManager.viewItem('${item.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="inventoryManager.editItem('${item.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn adjust-btn" onclick="inventoryManager.adjustStock('${item.id}')" title="Adjust Stock">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="action-btn reorder-btn" onclick="inventoryManager.reorderItem('${item.id}')" title="Reorder">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    renderCategoriesGrid() {
        return this.categories.map(category => `
            <div class="category-card">
                <div class="category-header">
                    <div class="category-icon" style="color: ${category.color}">
                        <i class="${category.icon}"></i>
                    </div>
                    <h3>${category.name}</h3>
                </div>
                <div class="category-content">
                    <p>${category.description}</p>
                    <div class="category-stats">
                        <span class="item-count">${this.getItemCountByCategory(category.name)} items</span>
                        <span class="value">$${this.getCategoryValue(category.name).toLocaleString()}</span>
                    </div>
                </div>
                <div class="category-actions">
                    <button class="category-btn" onclick="inventoryManager.filterByCategory('${category.name}')">
                        <i class="fas fa-filter"></i> Filter
                    </button>
                    <button class="category-btn" onclick="inventoryManager.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderSuppliersGrid() {
        return this.suppliers.map(supplier => `
            <div class="supplier-card">
                <div class="supplier-header">
                    <h3>${supplier.name}</h3>
                    <div class="supplier-rating">
                        ${this.renderStarRating(supplier.rating)}
                    </div>
                </div>
                <div class="supplier-content">
                    <div class="supplier-info">
                        <p><i class="fas fa-user"></i> ${supplier.contactPerson}</p>
                        <p><i class="fas fa-phone"></i> ${supplier.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${supplier.email}</p>
                        <p><i class="fas fa-credit-card"></i> ${supplier.paymentTerms}</p>
                        <p><i class="fas fa-truck"></i> ${supplier.deliveryTime} days</p>
                    </div>
                    <div class="supplier-stats">
                        <div class="stat-item">
                            <span class="stat-label">Items</span>
                            <span class="stat-value">${this.getItemCountBySupplier(supplier.name)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Discount</span>
                            <span class="stat-value">${(supplier.discountRate * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
                <div class="supplier-actions">
                    <button class="supplier-btn" onclick="inventoryManager.contactSupplier('${supplier.id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="supplier-btn" onclick="inventoryManager.createOrder('${supplier.id}')">
                        <i class="fas fa-shopping-cart"></i> Order
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderOrdersList() {
        return this.orders.map(order => {
            const statusClass = order.status.toLowerCase().replace(' ', '-');
            
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <h3>${order.id}</h3>
                            <span class="order-supplier">${order.supplier}</span>
                        </div>
                        <div class="order-status">
                            <span class="status-badge ${statusClass}">${order.status}</span>
                        </div>
                    </div>
                    <div class="order-content">
                        <div class="order-details">
                            <p><i class="fas fa-calendar"></i> Order Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
                            <p><i class="fas fa-truck"></i> Expected: ${new Date(order.expectedDelivery).toLocaleDateString()}</p>
                            <p><i class="fas fa-dollar-sign"></i> Total: $${order.total.toFixed(2)}</p>
                        </div>
                        <div class="order-items">
                            <h4>Items (${order.items.length})</h4>
                            <div class="items-list">
                                ${order.items.map(item => `
                                    <div class="item-summary">
                                        <span>${item.partNumber}</span>
                                        <span>Qty: ${item.quantity}</span>
                                        <span>$${item.totalCost.toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="order-btn" onclick="inventoryManager.viewOrder('${order.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="order-btn" onclick="inventoryManager.trackOrder('${order.id}')">
                            <i class="fas fa-map-marker-alt"></i> Track
                        </button>
                        ${order.status === 'Delivered' ? `
                            <button class="order-btn" onclick="inventoryManager.receiveOrder('${order.id}')">
                                <i class="fas fa-check"></i> Receive
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderReportsDashboard() {
        return `
            <div class="reports-grid">
                <div class="report-card">
                    <div class="report-header">
                        <h3>Stock Valuation Report</h3>
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <div class="report-content">
                        <div class="report-stat">
                            <span class="stat-label">Total Inventory Value</span>
                            <span class="stat-value">$${this.calculateTotalInventoryValue().toLocaleString()}</span>
                        </div>
                        <div class="report-stat">
                            <span class="stat-label">Average Item Value</span>
                            <span class="stat-value">$${this.calculateAverageItemValue().toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="report-btn" onclick="inventoryManager.generateStockReport()">
                        Generate Report
                    </button>
                </div>

                <div class="report-card">
                    <div class="report-header">
                        <h3>Low Stock Alert</h3>
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="report-content">
                        <div class="alert-list">
                            ${this.getLowStockItems().slice(0, 5).map(item => `
                                <div class="alert-item">
                                    <span class="item-name">${item.name}</span>
                                    <span class="stock-level">${item.currentStock}/${item.minStockLevel}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="report-btn" onclick="inventoryManager.generateLowStockReport()">
                        View All Alerts
                    </button>
                </div>

                <div class="report-card">
                    <div class="report-header">
                        <h3>Movement Analysis</h3>
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="report-content">
                        <div class="movement-stats">
                            <div class="stat-item">
                                <span class="stat-label">Fast Moving Items</span>
                                <span class="stat-value">24</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Slow Moving Items</span>
                                <span class="stat-value">8</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Dead Stock</span>
                                <span class="stat-value">2</span>
                            </div>
                        </div>
                    </div>
                    <button class="report-btn" onclick="inventoryManager.generateMovementReport()">
                        Generate Report
                    </button>
                </div>
            </div>
        `;
    }

    attachInventoryEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.closest('.tab-btn').dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Inventory row interactions
        const inventoryRows = document.querySelectorAll('.inventory-row');
        inventoryRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.actions')) {
                    const itemId = row.dataset.id;
                    this.viewItem(itemId);
                }
            });
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Utility methods
    getStockStatus(item) {
        if (item.currentStock <= item.minStockLevel) return 'Low Stock';
        if (item.currentStock >= item.maxStockLevel) return 'Overstock';
        return 'Normal';
    }

    getLowStockItems() {
        return this.inventory.filter(item => item.currentStock <= item.minStockLevel);
    }

    calculateTotalInventoryValue() {
        return this.inventory.reduce((total, item) => total + (item.currentStock * item.costPrice), 0);
    }

    calculateAverageItemValue() {
        if (this.inventory.length === 0) return 0;
        return this.calculateTotalInventoryValue() / this.inventory.length;
    }

    getItemCountByCategory(category) {
        return this.inventory.filter(item => item.category === category).length;
    }

    getCategoryValue(category) {
        return this.inventory
            .filter(item => item.category === category)
            .reduce((total, item) => total + (item.currentStock * item.costPrice), 0);
    }

    getItemCountBySupplier(supplier) {
        return this.inventory.filter(item => item.supplier === supplier).length;
    }

    renderStarRating(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push('<i class="fas fa-star"></i>');
            } else if (i - 0.5 <= rating) {
                stars.push('<i class="fas fa-star-half-alt"></i>');
            } else {
                stars.push('<i class="far fa-star"></i>');
            }
        }
        return stars.join('');
    }

    // Action methods
    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const supplierFilter = document.getElementById('supplierFilter').value;
        const stockFilter = document.getElementById('stockFilter').value;
        const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

        let filteredItems = this.inventory;

        if (categoryFilter) {
            filteredItems = filteredItems.filter(item => item.category === categoryFilter);
        }

        if (supplierFilter) {
            filteredItems = filteredItems.filter(item => item.supplier === supplierFilter);
        }

        if (stockFilter) {
            filteredItems = filteredItems.filter(item => {
                const status = this.getStockStatus(item).toLowerCase().replace(' ', '');
                return status === stockFilter;
            });
        }

        if (searchFilter) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchFilter) ||
                item.partNumber.toLowerCase().includes(searchFilter) ||
                item.brand.toLowerCase().includes(searchFilter)
            );
        }

        // Update table with filtered results
        const tbody = document.getElementById('inventoryTableBody');
        if (tbody) {
            tbody.innerHTML = this.renderFilteredInventoryRows(filteredItems);
        }
    }

    renderFilteredInventoryRows(filteredItems) {
        return filteredItems.map(item => {
            const stockStatus = this.getStockStatus(item);
            const stockClass = stockStatus.toLowerCase().replace(' ', '-');
            
            return `
                <tr class="inventory-row ${stockClass}" data-id="${item.id}">
                    <td class="part-number">${item.partNumber}</td>
                    <td class="item-name">
                        <div class="name-info">
                            <strong>${item.name}</strong>
                            <small>${item.brand}</small>
                        </div>
                    </td>
                    <td class="category">${item.category}</td>
                    <td class="supplier">${item.supplier}</td>
                    <td class="stock-level">
                        <span class="stock-badge ${stockClass}">
                            ${item.currentStock}
                        </span>
                    </td>
                    <td class="min-level">${item.minStockLevel}</td>
                    <td class="cost-price">$${item.costPrice.toFixed(2)}</td>
                    <td class="retail-price">$${item.retailPrice.toFixed(2)}</td>
                    <td class="location">${item.location}</td>
                    <td class="actions">
                        <button class="action-btn view-btn" onclick="inventoryManager.viewItem('${item.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" onclick="inventoryManager.editItem('${item.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn adjust-btn" onclick="inventoryManager.adjustStock('${item.id}')" title="Adjust Stock">
                            <i class="fas fa-plus-minus"></i>
                        </button>
                        <button class="action-btn reorder-btn" onclick="inventoryManager.reorderItem('${item.id}')" title="Reorder">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Modal and action methods
    showAddItemModal() {
        window.app.showNotification('Add item modal opening...', 'info');
    }

    showReorderReport() {
        window.app.showNotification('Reorder report generating...', 'info');
    }

    showImportModal() {
        window.app.showNotification('Import modal opening...', 'info');
    }

    exportInventory() {
        const csvData = [
            ['Part Number', 'Name', 'Category', 'Brand', 'Supplier', 'Current Stock', 'Min Level', 'Cost Price', 'Retail Price', 'Location'],
            ...this.inventory.map(item => [
                item.partNumber,
                item.name,
                item.category,
                item.brand,
                item.supplier,
                item.currentStock,
                item.minStockLevel,
                item.costPrice,
                item.retailPrice,
                item.location
            ])
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
        window.app.showNotification('Inventory exported successfully!', 'success');
    }

    viewItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            window.app.showNotification(`Viewing item: ${item.name}`, 'info');
        }
    }

    editItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            window.app.showNotification(`Editing item: ${item.name}`, 'info');
        }
    }

    adjustStock(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            window.app.showNotification(`Adjusting stock for: ${item.name}`, 'info');
        }
    }

    reorderItem(id) {
        const item = this.inventory.find(i => i.id === id);
        if (item) {
            window.app.showNotification(`Reordering: ${item.name}`, 'info');
        }
    }

    filterByCategory(category) {
        document.getElementById('categoryFilter').value = category;
        this.applyFilters();
        this.switchTab('inventory-list');
    }

    // Setup automated tasks
    setupAutomatedTasks() {
        // Check for low stock alerts every 5 minutes
        setInterval(() => {
            this.checkLowStockAlerts();
        }, 300000);

        // Update order statuses every 10 minutes
        setInterval(() => {
            this.updateOrderStatuses();
        }, 600000);
    }

    checkLowStockAlerts() {
        this.lowStockAlerts = this.getLowStockItems();
        
        if (this.lowStockAlerts.length > 0) {
            console.log(`Low stock alert: ${this.lowStockAlerts.length} items need reordering`);
        }
    }

    updateOrderStatuses() {
        // Simulate order status updates
        this.orders.forEach(order => {
            if (order.status === 'Pending' && Math.random() > 0.7) {
                order.status = 'Shipped';
            } else if (order.status === 'Shipped' && Math.random() > 0.8) {
                order.status = 'Delivered';
            }
        });
        
        this.saveOrders();
    }

    // Save methods
    saveInventory() {
        localStorage.setItem('repairbridge_inventory', JSON.stringify(this.inventory));
    }

    saveSuppliers() {
        localStorage.setItem('repairbridge_suppliers', JSON.stringify(this.suppliers));
    }

    saveOrders() {
        localStorage.setItem('repairbridge_orders', JSON.stringify(this.orders));
    }

    saveCategories() {
        localStorage.setItem('repairbridge_categories', JSON.stringify(this.categories));
    }

    loadInventoryData() {
        console.log('Inventory system loaded successfully');
    }
}

// Initialize inventory manager
window.inventoryManager = new InventoryManager();
