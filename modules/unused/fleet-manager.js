/**
 * Fleet Management System
 * Provides comprehensive fleet tracking, maintenance scheduling, driver management, and operational analytics
 */

class FleetManager {
    constructor() {
        this.vehicles = [];
        this.drivers = [];
        this.maintenanceSchedules = [];
        this.routes = [];
        this.fuelRecords = [];
        this.inspections = [];
        this.alerts = [];
        this.fleetMetrics = {
            totalVehicles: 0,
            activeVehicles: 0,
            inMaintenanceVehicles: 0,
            totalDrivers: 0,
            activeDrivers: 0,
            totalMileage: 0,
            fuelEfficiency: 0,
            maintenanceCosts: 0,
            operationalCosts: 0
        };
        this.geofences = [];
        this.telemetryData = [];
        
        this.initializeFleetManager();
        this.loadFleetData();
        this.startFleetMonitoring();
    }

    initializeFleetManager() {
        // Initialize fleet management system
        this.createMockFleetData();
        this.setupFleetMonitoring();
        this.calculateFleetMetrics();
    }

    loadFleetData() {
        const savedVehicles = localStorage.getItem('repairbridge_fleet_vehicles');
        if (savedVehicles) {
            try {
                this.vehicles = JSON.parse(savedVehicles);
            } catch (error) {
                console.warn('Failed to load fleet vehicles:', error);
                this.createMockFleetData();
            }
        } else {
            this.createMockFleetData();
        }

        const savedDrivers = localStorage.getItem('repairbridge_fleet_drivers');
        if (savedDrivers) {
            try {
                this.drivers = JSON.parse(savedDrivers);
            } catch (error) {
                console.warn('Failed to load drivers:', error);
                this.createMockDriverData();
            }
        } else {
            this.createMockDriverData();
        }

        const savedMaintenance = localStorage.getItem('repairbridge_fleet_maintenance');
        if (savedMaintenance) {
            try {
                this.maintenanceSchedules = JSON.parse(savedMaintenance);
            } catch (error) {
                console.warn('Failed to load maintenance schedules:', error);
                this.createMockMaintenanceData();
            }
        } else {
            this.createMockMaintenanceData();
        }
    }

    saveFleetData() {
        localStorage.setItem('repairbridge_fleet_vehicles', JSON.stringify(this.vehicles));
        localStorage.setItem('repairbridge_fleet_drivers', JSON.stringify(this.drivers));
        localStorage.setItem('repairbridge_fleet_maintenance', JSON.stringify(this.maintenanceSchedules));
    }

    renderFleetInterface() {
        const fleetSection = document.getElementById('fleet');
        if (!fleetSection) return;

        fleetSection.innerHTML = `
            <div class="fleet-system">
                <div class="fleet-header">
                    <h2><i class="fas fa-truck"></i> Fleet Management</h2>
                    <div class="fleet-actions">
                        <button class="fleet-btn primary" onclick="fleetManager.addVehicle()">
                            <i class="fas fa-plus"></i> Add Vehicle
                        </button>
                        <button class="fleet-btn secondary" onclick="fleetManager.scheduleMaintenance()">
                            <i class="fas fa-wrench"></i> Schedule Maintenance
                        </button>
                        <button class="fleet-btn tertiary" onclick="fleetManager.exportFleetReport()">
                            <i class="fas fa-file-export"></i> Export Report
                        </button>
                    </div>
                </div>

                <div class="fleet-content">
                    <div class="fleet-main">
                        <div class="fleet-metrics">
                            <div class="metrics-cards">
                                <div class="metric-card vehicles">
                                    <div class="metric-icon">
                                        <i class="fas fa-car"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.totalVehicles}</h3>
                                        <p>Total Vehicles</p>
                                        <span class="metric-change positive">+2 this month</span>
                                    </div>
                                </div>

                                <div class="metric-card active">
                                    <div class="metric-icon">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.activeVehicles}</h3>
                                        <p>Active Vehicles</p>
                                        <span class="metric-change neutral">${((this.fleetMetrics.activeVehicles / this.fleetMetrics.totalVehicles) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>

                                <div class="metric-card maintenance">
                                    <div class="metric-icon">
                                        <i class="fas fa-tools"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.inMaintenanceVehicles}</h3>
                                        <p>In Maintenance</p>
                                        <span class="metric-change negative">-1 this week</span>
                                    </div>
                                </div>

                                <div class="metric-card drivers">
                                    <div class="metric-icon">
                                        <i class="fas fa-user-tie"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.totalDrivers}</h3>
                                        <p>Total Drivers</p>
                                        <span class="metric-change positive">+1 this month</span>
                                    </div>
                                </div>

                                <div class="metric-card mileage">
                                    <div class="metric-icon">
                                        <i class="fas fa-road"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.totalMileage.toLocaleString()}</h3>
                                        <p>Total Miles</p>
                                        <span class="metric-change positive">+5,240 this month</span>
                                    </div>
                                </div>

                                <div class="metric-card fuel">
                                    <div class="metric-icon">
                                        <i class="fas fa-gas-pump"></i>
                                    </div>
                                    <div class="metric-info">
                                        <h3>${this.fleetMetrics.fuelEfficiency}</h3>
                                        <p>Avg MPG</p>
                                        <span class="metric-change positive">+0.5 this month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="fleet-tabs">
                            <div class="tab-nav">
                                <button class="tab-btn active" data-tab="vehicles">
                                    <i class="fas fa-car"></i> Vehicles
                                </button>
                                <button class="tab-btn" data-tab="drivers">
                                    <i class="fas fa-user-tie"></i> Drivers
                                </button>
                                <button class="tab-btn" data-tab="maintenance">
                                    <i class="fas fa-wrench"></i> Maintenance
                                </button>
                                <button class="tab-btn" data-tab="routes">
                                    <i class="fas fa-route"></i> Routes
                                </button>
                                <button class="tab-btn" data-tab="fuel">
                                    <i class="fas fa-gas-pump"></i> Fuel
                                </button>
                                <button class="tab-btn" data-tab="tracking">
                                    <i class="fas fa-map-marked-alt"></i> Tracking
                                </button>
                            </div>

                            <div class="tab-content">
                                <div id="vehicles-tab" class="tab-panel active">
                                    ${this.renderVehiclesPanel()}
                                </div>
                                <div id="drivers-tab" class="tab-panel">
                                    ${this.renderDriversPanel()}
                                </div>
                                <div id="maintenance-tab" class="tab-panel">
                                    ${this.renderMaintenancePanel()}
                                </div>
                                <div id="routes-tab" class="tab-panel">
                                    ${this.renderRoutesPanel()}
                                </div>
                                <div id="fuel-tab" class="tab-panel">
                                    ${this.renderFuelPanel()}
                                </div>
                                <div id="tracking-tab" class="tab-panel">
                                    ${this.renderTrackingPanel()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="fleet-sidebar">
                        <div class="fleet-alerts">
                            <h3>Fleet Alerts</h3>
                            <div class="alerts-list">
                                ${this.renderFleetAlerts()}
                            </div>
                        </div>

                        <div class="upcoming-maintenance">
                            <h3>Upcoming Maintenance</h3>
                            <div class="maintenance-list">
                                ${this.renderUpcomingMaintenance()}
                            </div>
                        </div>

                        <div class="fleet-map">
                            <h3>Fleet Location</h3>
                            <div class="map-container">
                                <canvas id="fleetMap" width="300" height="200"></canvas>
                            </div>
                        </div>

                        <div class="fleet-performance">
                            <h3>Performance Metrics</h3>
                            <div class="performance-chart">
                                <canvas id="fleetPerformanceChart" width="300" height="150"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupFleetTabs();
        this.setupFleetHandlers();
        this.renderFleetMap();
        this.renderPerformanceChart();
    }

    renderVehiclesPanel() {
        return `
            <div class="vehicles-panel">
                <div class="panel-header">
                    <h3>Fleet Vehicles</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.addVehicle()">
                            <i class="fas fa-plus"></i> Add Vehicle
                        </button>
                        <button class="panel-btn" onclick="fleetManager.importVehicles()">
                            <i class="fas fa-upload"></i> Import
                        </button>
                    </div>
                </div>

                <div class="vehicles-filters">
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="vehicle-status-filter">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="maintenance">In Maintenance</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Type</label>
                        <select id="vehicle-type-filter">
                            <option value="all">All Types</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="car">Car</option>
                            <option value="motorcycle">Motorcycle</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Location</label>
                        <select id="vehicle-location-filter">
                            <option value="all">All Locations</option>
                            <option value="depot">Depot</option>
                            <option value="route">On Route</option>
                            <option value="service">Service Center</option>
                        </select>
                    </div>
                </div>

                <div class="vehicles-grid">
                    ${this.renderVehiclesList()}
                </div>
            </div>
        `;
    }

    renderVehiclesList() {
        return this.vehicles.map(vehicle => `
            <div class="vehicle-card ${vehicle.status}">
                <div class="vehicle-header">
                    <div class="vehicle-info">
                        <h4>${vehicle.make} ${vehicle.model}</h4>
                        <p class="vehicle-id">${vehicle.id}</p>
                        <span class="vehicle-type">${vehicle.type}</span>
                    </div>
                    <div class="vehicle-status">
                        <span class="status-badge ${vehicle.status}">${vehicle.status}</span>
                    </div>
                </div>
                <div class="vehicle-details">
                    <div class="detail-row">
                        <span class="detail-label">VIN</span>
                        <span class="detail-value">${vehicle.vin}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Mileage</span>
                        <span class="detail-value">${vehicle.mileage.toLocaleString()} miles</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Driver</span>
                        <span class="detail-value">${vehicle.driver || 'Unassigned'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location</span>
                        <span class="detail-value">${vehicle.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fuel Level</span>
                        <span class="detail-value">${vehicle.fuelLevel}%</span>
                    </div>
                </div>
                <div class="vehicle-actions">
                    <button class="vehicle-action-btn track" onclick="fleetManager.trackVehicle('${vehicle.id}')">
                        <i class="fas fa-map-marker-alt"></i> Track
                    </button>
                    <button class="vehicle-action-btn service" onclick="fleetManager.scheduleService('${vehicle.id}')">
                        <i class="fas fa-wrench"></i> Service
                    </button>
                    <button class="vehicle-action-btn edit" onclick="fleetManager.editVehicle('${vehicle.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="vehicle-action-btn reports" onclick="fleetManager.generateVehicleReport('${vehicle.id}')">
                        <i class="fas fa-chart-line"></i> Reports
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderDriversPanel() {
        return `
            <div class="drivers-panel">
                <div class="panel-header">
                    <h3>Fleet Drivers</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.addDriver()">
                            <i class="fas fa-plus"></i> Add Driver
                        </button>
                        <button class="panel-btn" onclick="fleetManager.importDrivers()">
                            <i class="fas fa-upload"></i> Import
                        </button>
                    </div>
                </div>

                <div class="drivers-list">
                    ${this.renderDriversList()}
                </div>
            </div>
        `;
    }

    renderDriversList() {
        return this.drivers.map(driver => `
            <div class="driver-card ${driver.status}">
                <div class="driver-header">
                    <div class="driver-avatar">
                        <img src="${driver.avatar || '/api/placeholder/60/60'}" alt="${driver.name}" />
                    </div>
                    <div class="driver-info">
                        <h4>${driver.name}</h4>
                        <p class="driver-id">${driver.id}</p>
                        <span class="driver-license">${driver.licenseClass}</span>
                    </div>
                    <div class="driver-status">
                        <span class="status-badge ${driver.status}">${driver.status}</span>
                    </div>
                </div>
                <div class="driver-details">
                    <div class="detail-row">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">${driver.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Vehicle</span>
                        <span class="detail-value">${driver.assignedVehicle || 'Unassigned'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Experience</span>
                        <span class="detail-value">${driver.experience} years</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Rating</span>
                        <span class="detail-value">${this.renderStarRating(driver.rating)}</span>
                    </div>
                </div>
                <div class="driver-actions">
                    <button class="driver-action-btn assign" onclick="fleetManager.assignVehicle('${driver.id}')">
                        <i class="fas fa-car"></i> Assign
                    </button>
                    <button class="driver-action-btn schedule" onclick="fleetManager.scheduleDriver('${driver.id}')">
                        <i class="fas fa-calendar"></i> Schedule
                    </button>
                    <button class="driver-action-btn edit" onclick="fleetManager.editDriver('${driver.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="driver-action-btn reports" onclick="fleetManager.generateDriverReport('${driver.id}')">
                        <i class="fas fa-chart-line"></i> Reports
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderMaintenancePanel() {
        return `
            <div class="maintenance-panel">
                <div class="panel-header">
                    <h3>Maintenance Schedule</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.scheduleMaintenance()">
                            <i class="fas fa-plus"></i> Schedule
                        </button>
                        <button class="panel-btn" onclick="fleetManager.maintenanceCalendar()">
                            <i class="fas fa-calendar"></i> Calendar
                        </button>
                    </div>
                </div>

                <div class="maintenance-filters">
                    <div class="filter-group">
                        <label>Status</label>
                        <select id="maintenance-status-filter">
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Type</label>
                        <select id="maintenance-type-filter">
                            <option value="all">All Types</option>
                            <option value="routine">Routine</option>
                            <option value="repair">Repair</option>
                            <option value="inspection">Inspection</option>
                            <option value="emergency">Emergency</option>
                        </select>
                    </div>
                </div>

                <div class="maintenance-list">
                    ${this.renderMaintenanceList()}
                </div>
            </div>
        `;
    }

    renderMaintenanceList() {
        return this.maintenanceSchedules.map(maintenance => `
            <div class="maintenance-card ${maintenance.status}">
                <div class="maintenance-header">
                    <div class="maintenance-info">
                        <h4>${maintenance.type}</h4>
                        <p class="maintenance-vehicle">${maintenance.vehicleId}</p>
                        <span class="maintenance-priority ${maintenance.priority}">${maintenance.priority}</span>
                    </div>
                    <div class="maintenance-status">
                        <span class="status-badge ${maintenance.status}">${maintenance.status}</span>
                    </div>
                </div>
                <div class="maintenance-details">
                    <div class="detail-row">
                        <span class="detail-label">Scheduled</span>
                        <span class="detail-value">${this.formatDate(maintenance.scheduledDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Service Center</span>
                        <span class="detail-value">${maintenance.serviceCenter}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Estimated Cost</span>
                        <span class="detail-value">$${maintenance.estimatedCost}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Description</span>
                        <span class="detail-value">${maintenance.description}</span>
                    </div>
                </div>
                <div class="maintenance-actions">
                    <button class="maintenance-action-btn start" onclick="fleetManager.startMaintenance('${maintenance.id}')">
                        <i class="fas fa-play"></i> Start
                    </button>
                    <button class="maintenance-action-btn reschedule" onclick="fleetManager.rescheduleMaintenance('${maintenance.id}')">
                        <i class="fas fa-calendar-alt"></i> Reschedule
                    </button>
                    <button class="maintenance-action-btn edit" onclick="fleetManager.editMaintenance('${maintenance.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="maintenance-action-btn cancel" onclick="fleetManager.cancelMaintenance('${maintenance.id}')">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderRoutesPanel() {
        return `
            <div class="routes-panel">
                <div class="panel-header">
                    <h3>Fleet Routes</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.createRoute()">
                            <i class="fas fa-plus"></i> Create Route
                        </button>
                        <button class="panel-btn" onclick="fleetManager.optimizeRoutes()">
                            <i class="fas fa-route"></i> Optimize
                        </button>
                    </div>
                </div>

                <div class="routes-map">
                    <canvas id="routesMap" width="800" height="400"></canvas>
                </div>

                <div class="routes-list">
                    ${this.renderRoutesList()}
                </div>
            </div>
        `;
    }

    renderRoutesList() {
        const routes = this.generateMockRoutes();
        
        return routes.map(route => `
            <div class="route-card">
                <div class="route-header">
                    <div class="route-info">
                        <h4>${route.name}</h4>
                        <p class="route-id">${route.id}</p>
                    </div>
                    <div class="route-status">
                        <span class="status-badge ${route.status}">${route.status}</span>
                    </div>
                </div>
                <div class="route-details">
                    <div class="detail-row">
                        <span class="detail-label">Distance</span>
                        <span class="detail-value">${route.distance} miles</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Duration</span>
                        <span class="detail-value">${route.duration}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Stops</span>
                        <span class="detail-value">${route.stops}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Vehicle</span>
                        <span class="detail-value">${route.assignedVehicle || 'Unassigned'}</span>
                    </div>
                </div>
                <div class="route-actions">
                    <button class="route-action-btn assign" onclick="fleetManager.assignRouteVehicle('${route.id}')">
                        <i class="fas fa-car"></i> Assign
                    </button>
                    <button class="route-action-btn edit" onclick="fleetManager.editRoute('${route.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="route-action-btn optimize" onclick="fleetManager.optimizeRoute('${route.id}')">
                        <i class="fas fa-route"></i> Optimize
                    </button>
                    <button class="route-action-btn delete" onclick="fleetManager.deleteRoute('${route.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFuelPanel() {
        return `
            <div class="fuel-panel">
                <div class="panel-header">
                    <h3>Fuel Management</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.addFuelRecord()">
                            <i class="fas fa-plus"></i> Add Record
                        </button>
                        <button class="panel-btn" onclick="fleetManager.fuelAnalytics()">
                            <i class="fas fa-chart-line"></i> Analytics
                        </button>
                    </div>
                </div>

                <div class="fuel-metrics">
                    <div class="fuel-metric-cards">
                        <div class="fuel-metric-card">
                            <h4>Total Fuel Cost</h4>
                            <p class="metric-value">$12,450</p>
                            <span class="metric-change negative">+5.2% this month</span>
                        </div>
                        <div class="fuel-metric-card">
                            <h4>Average MPG</h4>
                            <p class="metric-value">18.5</p>
                            <span class="metric-change positive">+0.3 this month</span>
                        </div>
                        <div class="fuel-metric-card">
                            <h4>Fuel Efficiency</h4>
                            <p class="metric-value">92%</p>
                            <span class="metric-change positive">+1.5% this month</span>
                        </div>
                    </div>
                </div>

                <div class="fuel-chart">
                    <canvas id="fuelChart" width="800" height="300"></canvas>
                </div>

                <div class="fuel-records">
                    ${this.renderFuelRecords()}
                </div>
            </div>
        `;
    }

    renderFuelRecords() {
        const fuelRecords = this.generateMockFuelRecords();
        
        return `
            <div class="fuel-records-list">
                ${fuelRecords.map(record => `
                    <div class="fuel-record-card">
                        <div class="record-header">
                            <div class="record-info">
                                <h4>${record.vehicleId}</h4>
                                <p class="record-date">${this.formatDate(record.date)}</p>
                            </div>
                            <div class="record-amount">
                                <span class="fuel-cost">$${record.cost}</span>
                            </div>
                        </div>
                        <div class="record-details">
                            <div class="detail-item">
                                <span class="detail-label">Gallons</span>
                                <span class="detail-value">${record.gallons}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Price/Gallon</span>
                                <span class="detail-value">$${record.pricePerGallon}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mileage</span>
                                <span class="detail-value">${record.mileage.toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Station</span>
                                <span class="detail-value">${record.station}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTrackingPanel() {
        return `
            <div class="tracking-panel">
                <div class="panel-header">
                    <h3>Vehicle Tracking</h3>
                    <div class="panel-actions">
                        <button class="panel-btn" onclick="fleetManager.refreshTracking()">
                            <i class="fas fa-sync"></i> Refresh
                        </button>
                        <button class="panel-btn" onclick="fleetManager.createGeofence()">
                            <i class="fas fa-draw-polygon"></i> Geofence
                        </button>
                    </div>
                </div>

                <div class="tracking-map">
                    <canvas id="trackingMap" width="800" height="500"></canvas>
                </div>

                <div class="tracking-info">
                    <div class="tracking-stats">
                        <div class="stat-item">
                            <span class="stat-label">Vehicles On Route</span>
                            <span class="stat-value">${this.fleetMetrics.activeVehicles}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Average Speed</span>
                            <span class="stat-value">45 mph</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Idle Time</span>
                            <span class="stat-value">12%</span>
                        </div>
                    </div>

                    <div class="geofences-list">
                        <h4>Active Geofences</h4>
                        ${this.renderGeofencesList()}
                    </div>
                </div>
            </div>
        `;
    }

    renderGeofencesList() {
        const geofences = this.generateMockGeofences();
        
        return geofences.map(geofence => `
            <div class="geofence-item">
                <div class="geofence-info">
                    <h5>${geofence.name}</h5>
                    <p>${geofence.type}</p>
                </div>
                <div class="geofence-status">
                    <span class="status-badge ${geofence.status}">${geofence.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderFleetAlerts() {
        const alerts = this.generateMockFleetAlerts();
        
        return alerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-icon">
                    <i class="fas fa-${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <h5>${alert.title}</h5>
                    <p>${alert.message}</p>
                    <small>${this.formatTimestamp(alert.timestamp)}</small>
                </div>
            </div>
        `).join('');
    }

    renderUpcomingMaintenance() {
        const upcoming = this.maintenanceSchedules
            .filter(m => m.status === 'scheduled')
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .slice(0, 5);

        return upcoming.map(maintenance => `
            <div class="upcoming-maintenance-item">
                <div class="maintenance-info">
                    <h5>${maintenance.type}</h5>
                    <p>${maintenance.vehicleId}</p>
                    <small>${this.formatDate(maintenance.scheduledDate)}</small>
                </div>
                <div class="maintenance-priority">
                    <span class="priority-badge ${maintenance.priority}">${maintenance.priority}</span>
                </div>
            </div>
        `).join('');
    }

    // Setup methods
    setupFleetTabs() {
        const tabButtons = document.querySelectorAll('.fleet-tabs .tab-btn');
        const tabPanels = document.querySelectorAll('.fleet-tabs .tab-panel');

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

    setupFleetHandlers() {
        // Setup various event handlers for fleet management
        this.setupFilterHandlers();
        this.setupVehicleHandlers();
    }

    setupFilterHandlers() {
        // Setup filter event handlers
        const filters = document.querySelectorAll('#vehicle-status-filter, #vehicle-type-filter, #vehicle-location-filter');
        filters.forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyVehicleFilters();
            });
        });
    }

    setupVehicleHandlers() {
        // Setup vehicle-specific handlers
        // Implementation would go here
    }

    startFleetMonitoring() {
        // Start real-time fleet monitoring
        setInterval(() => {
            this.updateFleetMetrics();
            this.updateVehiclePositions();
        }, 30000); // Every 30 seconds
    }

    setupFleetMonitoring() {
        // Initialize fleet monitoring systems
        this.generateTelemetryData();
        this.checkMaintenanceAlerts();
    }

    // Data generation methods
    createMockFleetData() {
        this.vehicles = [
            {
                id: 'VH001',
                make: 'Ford',
                model: 'Transit',
                type: 'van',
                vin: '1FTBW2CM5HKA12345',
                year: 2023,
                status: 'active',
                driver: 'John Smith',
                location: 'Downtown Route',
                mileage: 45230,
                fuelLevel: 75,
                lastService: '2025-06-15',
                nextService: '2025-08-15'
            },
            {
                id: 'VH002',
                make: 'Chevrolet',
                model: 'Silverado',
                type: 'truck',
                vin: '1GCUKREC5HZ123456',
                year: 2022,
                status: 'active',
                driver: 'Mike Johnson',
                location: 'Highway 101',
                mileage: 62150,
                fuelLevel: 45,
                lastService: '2025-07-01',
                nextService: '2025-09-01'
            },
            {
                id: 'VH003',
                make: 'Toyota',
                model: 'Camry',
                type: 'car',
                vin: '4T1BF1FK5HU123789',
                year: 2023,
                status: 'maintenance',
                driver: null,
                location: 'Service Center A',
                mileage: 28950,
                fuelLevel: 20,
                lastService: '2025-07-16',
                nextService: '2025-09-16'
            },
            {
                id: 'VH004',
                make: 'Honda',
                model: 'Pilot',
                type: 'suv',
                vin: '5FNYF6H51HB123456',
                year: 2024,
                status: 'active',
                driver: 'Sarah Wilson',
                location: 'City Center',
                mileage: 15760,
                fuelLevel: 90,
                lastService: '2025-06-30',
                nextService: '2025-08-30'
            },
            {
                id: 'VH005',
                make: 'Ram',
                model: '1500',
                type: 'truck',
                vin: '1C6RR7LT5HS123456',
                year: 2023,
                status: 'inactive',
                driver: null,
                location: 'Depot',
                mileage: 78320,
                fuelLevel: 10,
                lastService: '2025-07-10',
                nextService: '2025-09-10'
            }
        ];

        this.calculateFleetMetrics();
    }

    createMockDriverData() {
        this.drivers = [
            {
                id: 'DR001',
                name: 'John Smith',
                phone: '(555) 123-4567',
                licenseClass: 'CDL-A',
                assignedVehicle: 'VH001',
                status: 'active',
                experience: 8,
                rating: 4.8,
                avatar: null
            },
            {
                id: 'DR002',
                name: 'Mike Johnson',
                phone: '(555) 234-5678',
                licenseClass: 'CDL-B',
                assignedVehicle: 'VH002',
                status: 'active',
                experience: 12,
                rating: 4.9,
                avatar: null
            },
            {
                id: 'DR003',
                name: 'Sarah Wilson',
                phone: '(555) 345-6789',
                licenseClass: 'Standard',
                assignedVehicle: 'VH004',
                status: 'active',
                experience: 5,
                rating: 4.7,
                avatar: null
            },
            {
                id: 'DR004',
                name: 'David Brown',
                phone: '(555) 456-7890',
                licenseClass: 'CDL-A',
                assignedVehicle: null,
                status: 'available',
                experience: 15,
                rating: 4.6,
                avatar: null
            },
            {
                id: 'DR005',
                name: 'Lisa Garcia',
                phone: '(555) 567-8901',
                licenseClass: 'Standard',
                assignedVehicle: null,
                status: 'off-duty',
                experience: 3,
                rating: 4.5,
                avatar: null
            }
        ];
    }

    createMockMaintenanceData() {
        this.maintenanceSchedules = [
            {
                id: 'MT001',
                vehicleId: 'VH001',
                type: 'Oil Change',
                description: 'Regular oil change and filter replacement',
                scheduledDate: '2025-08-15',
                serviceCenter: 'Service Center A',
                estimatedCost: 85,
                priority: 'medium',
                status: 'scheduled'
            },
            {
                id: 'MT002',
                vehicleId: 'VH002',
                type: 'Brake Service',
                description: 'Brake pad replacement and brake fluid check',
                scheduledDate: '2025-07-20',
                serviceCenter: 'Service Center B',
                estimatedCost: 320,
                priority: 'high',
                status: 'scheduled'
            },
            {
                id: 'MT003',
                vehicleId: 'VH003',
                type: 'Transmission Service',
                description: 'Transmission fluid change and inspection',
                scheduledDate: '2025-07-17',
                serviceCenter: 'Service Center A',
                estimatedCost: 450,
                priority: 'high',
                status: 'in-progress'
            },
            {
                id: 'MT004',
                vehicleId: 'VH004',
                type: 'Tire Rotation',
                description: 'Tire rotation and alignment check',
                scheduledDate: '2025-07-25',
                serviceCenter: 'Service Center C',
                estimatedCost: 120,
                priority: 'low',
                status: 'scheduled'
            },
            {
                id: 'MT005',
                vehicleId: 'VH005',
                type: 'Annual Inspection',
                description: 'State-required annual vehicle inspection',
                scheduledDate: '2025-07-18',
                serviceCenter: 'Service Center B',
                estimatedCost: 75,
                priority: 'high',
                status: 'overdue'
            }
        ];
    }

    generateMockRoutes() {
        return [
            {
                id: 'RT001',
                name: 'Downtown Delivery Route',
                distance: 45,
                duration: '2h 30m',
                stops: 12,
                assignedVehicle: 'VH001',
                status: 'active'
            },
            {
                id: 'RT002',
                name: 'Highway Service Route',
                distance: 120,
                duration: '4h 15m',
                stops: 8,
                assignedVehicle: 'VH002',
                status: 'active'
            },
            {
                id: 'RT003',
                name: 'City Center Circuit',
                distance: 25,
                duration: '1h 45m',
                stops: 15,
                assignedVehicle: null,
                status: 'planned'
            },
            {
                id: 'RT004',
                name: 'Suburban Collection Route',
                distance: 68,
                duration: '3h 20m',
                stops: 22,
                assignedVehicle: 'VH004',
                status: 'active'
            }
        ];
    }

    generateMockFuelRecords() {
        return [
            {
                id: 'FR001',
                vehicleId: 'VH001',
                date: '2025-07-16',
                gallons: 18.5,
                cost: 64.75,
                pricePerGallon: 3.50,
                mileage: 45230,
                station: 'Shell Station - Main St'
            },
            {
                id: 'FR002',
                vehicleId: 'VH002',
                date: '2025-07-15',
                gallons: 22.3,
                cost: 78.05,
                pricePerGallon: 3.50,
                mileage: 62150,
                station: 'BP Station - Highway 101'
            },
            {
                id: 'FR003',
                vehicleId: 'VH004',
                date: '2025-07-14',
                gallons: 15.2,
                cost: 53.20,
                pricePerGallon: 3.50,
                mileage: 15760,
                station: 'Exxon Station - City Center'
            }
        ];
    }

    generateMockGeofences() {
        return [
            {
                id: 'GF001',
                name: 'Downtown Zone',
                type: 'Delivery Area',
                status: 'active'
            },
            {
                id: 'GF002',
                name: 'Service Center A',
                type: 'Maintenance Zone',
                status: 'active'
            },
            {
                id: 'GF003',
                name: 'Restricted Area',
                type: 'No Entry Zone',
                status: 'active'
            }
        ];
    }

    generateMockFleetAlerts() {
        return [
            {
                id: 'AL001',
                title: 'Maintenance Overdue',
                message: 'VH005 annual inspection is overdue',
                severity: 'high',
                icon: 'exclamation-triangle',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'AL002',
                title: 'Low Fuel Alert',
                message: 'VH005 fuel level is below 15%',
                severity: 'medium',
                icon: 'gas-pump',
                timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            {
                id: 'AL003',
                title: 'Route Optimization',
                message: 'RT003 can be optimized to save 15 minutes',
                severity: 'low',
                icon: 'route',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    generateTelemetryData() {
        // Generate mock telemetry data for vehicles
        this.vehicles.forEach(vehicle => {
            if (vehicle.status === 'active') {
                this.telemetryData.push({
                    vehicleId: vehicle.id,
                    timestamp: new Date().toISOString(),
                    location: {
                        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
                        lng: -74.0060 + (Math.random() - 0.5) * 0.1
                    },
                    speed: Math.floor(Math.random() * 60) + 20,
                    fuelLevel: vehicle.fuelLevel,
                    engineTemp: Math.floor(Math.random() * 20) + 180,
                    engineRpm: Math.floor(Math.random() * 1000) + 1500
                });
            }
        });
    }

    calculateFleetMetrics() {
        this.fleetMetrics = {
            totalVehicles: this.vehicles.length,
            activeVehicles: this.vehicles.filter(v => v.status === 'active').length,
            inMaintenanceVehicles: this.vehicles.filter(v => v.status === 'maintenance').length,
            totalDrivers: this.drivers.length,
            activeDrivers: this.drivers.filter(d => d.status === 'active').length,
            totalMileage: this.vehicles.reduce((sum, v) => sum + v.mileage, 0),
            fuelEfficiency: 18.5, // Average MPG
            maintenanceCosts: this.maintenanceSchedules.reduce((sum, m) => sum + m.estimatedCost, 0),
            operationalCosts: 25430 // Monthly operational costs
        };
    }

    updateFleetMetrics() {
        // Update metrics in real-time
        this.calculateFleetMetrics();
        
        // Update UI if fleet interface is active
        const fleetSection = document.getElementById('fleet');
        if (fleetSection && fleetSection.style.display !== 'none') {
            // Update metric cards
            this.updateMetricCards();
        }
    }

    updateMetricCards() {
        // Update individual metric cards
        const totalVehiclesCard = document.querySelector('.metric-card.vehicles h3');
        if (totalVehiclesCard) {
            totalVehiclesCard.textContent = this.fleetMetrics.totalVehicles;
        }
        
        const activeVehiclesCard = document.querySelector('.metric-card.active h3');
        if (activeVehiclesCard) {
            activeVehiclesCard.textContent = this.fleetMetrics.activeVehicles;
        }
        
        // Update other metric cards...
    }

    updateVehiclePositions() {
        // Update vehicle positions on map
        this.generateTelemetryData();
        this.renderFleetMap();
    }

    checkMaintenanceAlerts() {
        // Check for maintenance alerts
        const now = new Date();
        this.maintenanceSchedules.forEach(maintenance => {
            const scheduledDate = new Date(maintenance.scheduledDate);
            if (scheduledDate < now && maintenance.status === 'scheduled') {
                maintenance.status = 'overdue';
                this.alerts.push({
                    id: `alert_${Date.now()}`,
                    title: 'Maintenance Overdue',
                    message: `${maintenance.vehicleId} ${maintenance.type} is overdue`,
                    severity: 'high',
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Chart rendering methods
    renderFleetMap() {
        const canvas = document.getElementById('fleetMap');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw map background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 10; i++) {
            const x = (canvas.width / 10) * i;
            const y = (canvas.height / 10) * i;
            
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw vehicle positions
        this.vehicles.filter(v => v.status === 'active').forEach((vehicle, index) => {
            const x = (canvas.width / 5) * (index + 1);
            const y = (canvas.height / 3) * (Math.random() + 1);
            
            // Draw vehicle marker
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw vehicle label
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(vehicle.id, x - 15, y - 12);
        });
    }

    renderPerformanceChart() {
        const canvas = document.getElementById('fleetPerformanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw performance chart
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let i = 0; i < 24; i++) {
            const x = (canvas.width / 23) * i;
            const performance = Math.random() * 40 + 60; // 60-100% performance
            const y = canvas.height - (performance / 100) * canvas.height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px Arial';
        ctx.fillText('100%', 5, 15);
        ctx.fillText('0%', 5, canvas.height - 5);
        ctx.fillText('24h', canvas.width - 25, canvas.height - 5);
    }

    // Utility methods
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
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

    // Event handlers
    addVehicle() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Add vehicle modal opened', 'info');
        }
    }

    scheduleMaintenance() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Schedule maintenance modal opened', 'info');
        }
    }

    exportFleetReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.fleetMetrics,
            vehicles: this.vehicles.length,
            drivers: this.drivers.length,
            maintenance: this.maintenanceSchedules.length
        };
        
        const reportStr = JSON.stringify(report, null, 2);
        const blob = new Blob([reportStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `fleet-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Fleet report exported successfully', 'success');
        }
    }

    // Additional event handlers (abbreviated for brevity)
    trackVehicle(vehicleId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Tracking vehicle ${vehicleId}`, 'info');
        }
    }

    scheduleService(vehicleId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Scheduling service for vehicle ${vehicleId}`, 'info');
        }
    }

    editVehicle(vehicleId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Editing vehicle ${vehicleId}`, 'info');
        }
    }

    generateVehicleReport(vehicleId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Generating report for vehicle ${vehicleId}`, 'info');
        }
    }

    addDriver() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Add driver modal opened', 'info');
        }
    }

    assignVehicle(driverId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Assigning vehicle to driver ${driverId}`, 'info');
        }
    }

    scheduleDriver(driverId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Scheduling driver ${driverId}`, 'info');
        }
    }

    editDriver(driverId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Editing driver ${driverId}`, 'info');
        }
    }

    generateDriverReport(driverId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Generating report for driver ${driverId}`, 'info');
        }
    }

    startMaintenance(maintenanceId) {
        const maintenance = this.maintenanceSchedules.find(m => m.id === maintenanceId);
        if (maintenance) {
            maintenance.status = 'in-progress';
            this.saveFleetData();
            this.renderFleetInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification(`Maintenance ${maintenanceId} started`, 'success');
            }
        }
    }

    rescheduleMaintenance(maintenanceId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Rescheduling maintenance ${maintenanceId}`, 'info');
        }
    }

    editMaintenance(maintenanceId) {
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Editing maintenance ${maintenanceId}`, 'info');
        }
    }

    cancelMaintenance(maintenanceId) {
        const maintenance = this.maintenanceSchedules.find(m => m.id === maintenanceId);
        if (maintenance) {
            maintenance.status = 'cancelled';
            this.saveFleetData();
            this.renderFleetInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification(`Maintenance ${maintenanceId} cancelled`, 'warning');
            }
        }
    }

    // More placeholder methods for completeness
    applyVehicleFilters() { console.log('Applying vehicle filters'); }
    importVehicles() { console.log('Importing vehicles'); }
    importDrivers() { console.log('Importing drivers'); }
    maintenanceCalendar() { console.log('Opening maintenance calendar'); }
    createRoute() { console.log('Creating new route'); }
    optimizeRoutes() { console.log('Optimizing routes'); }
    assignRouteVehicle(routeId) { console.log('Assigning vehicle to route:', routeId); }
    editRoute(routeId) { console.log('Editing route:', routeId); }
    optimizeRoute(routeId) { console.log('Optimizing route:', routeId); }
    deleteRoute(routeId) { console.log('Deleting route:', routeId); }
    addFuelRecord() { console.log('Adding fuel record'); }
    fuelAnalytics() { console.log('Opening fuel analytics'); }
    refreshTracking() { console.log('Refreshing tracking'); }
    createGeofence() { console.log('Creating geofence'); }
}

// Initialize fleet manager
window.fleetManager = new FleetManager();
