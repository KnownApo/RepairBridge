/**
 * Real-time Telematics System
 * Live vehicle monitoring and data streaming
 */

class TelematicsSystem {
    constructor() {
        this.connections = new Map();
        this.vehicleData = new Map();
        this.alertThresholds = new Map();
        this.geofences = new Map();
        this.drivers = new Map();
        this.trips = new Map();
        this.webSocket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000;
        this.updateInterval = 1000; // 1 second
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.setupDataSimulation();
        this.setupAlertThresholds();
        this.setupGeofences();
        this.loadVehicleData();
        this.startRealTimeUpdates();
        console.log('Telematics System initialized');
    }

    setupWebSocket() {
        // In production, this would connect to a real WebSocket server
        // For demo purposes, we'll simulate the connection
        this.simulateWebSocketConnection();
    }

    simulateWebSocketConnection() {
        // Simulate WebSocket connection
        setTimeout(() => {
            this.isConnected = true;
            this.onConnectionEstablished();
        }, 1000);

        // Simulate incoming data
        setInterval(() => {
            if (this.isConnected) {
                this.simulateIncomingData();
            }
        }, this.updateInterval);
    }

    onConnectionEstablished() {
        console.log('Telematics connection established');
        
        // Notify integration manager
        if (window.integrationManager) {
            window.integrationManager.triggerEvent('telematics-connected', {
                timestamp: new Date().toISOString()
            });
        }
    }

    setupDataSimulation() {
        // Simulate real vehicle data
        this.simulatedVehicles = [
            {
                id: 'FLEET-001',
                vin: '1HGCM82633A123456',
                make: 'Honda',
                model: 'Civic',
                year: 2020,
                driverId: 'DRIVER-001',
                location: { lat: 40.7128, lng: -74.0060 },
                speed: 0,
                engineRpm: 0,
                fuelLevel: 85,
                engineTemp: 190,
                oilPressure: 35,
                batteryVoltage: 12.4,
                odometer: 45230,
                tripDistance: 0,
                engineHours: 2345,
                status: 'parked'
            },
            {
                id: 'FLEET-002',
                vin: '1FTFW1ET5DKE12345',
                make: 'Ford',
                model: 'F-150',
                year: 2019,
                driverId: 'DRIVER-002',
                location: { lat: 40.7580, lng: -73.9855 },
                speed: 35,
                engineRpm: 1800,
                fuelLevel: 62,
                engineTemp: 205,
                oilPressure: 42,
                batteryVoltage: 12.6,
                odometer: 67890,
                tripDistance: 15.2,
                engineHours: 3456,
                status: 'driving'
            },
            {
                id: 'FLEET-003',
                vin: '5NPE34AF4HH123456',
                make: 'Hyundai',
                model: 'Sonata',
                year: 2017,
                driverId: 'DRIVER-003',
                location: { lat: 40.7829, lng: -73.9654 },
                speed: 0,
                engineRpm: 0,
                fuelLevel: 25,
                engineTemp: 180,
                oilPressure: 30,
                batteryVoltage: 12.2,
                odometer: 89345,
                tripDistance: 0,
                engineHours: 4567,
                status: 'parked'
            }
        ];

        // Initialize vehicle data
        this.simulatedVehicles.forEach(vehicle => {
            this.vehicleData.set(vehicle.id, vehicle);
        });
    }

    setupAlertThresholds() {
        // Define alert thresholds for different parameters
        this.alertThresholds.set('speed', { max: 80, critical: 100 });
        this.alertThresholds.set('engineTemp', { max: 220, critical: 240 });
        this.alertThresholds.set('oilPressure', { min: 10, critical: 5 });
        this.alertThresholds.set('batteryVoltage', { min: 11.5, critical: 11.0 });
        this.alertThresholds.set('fuelLevel', { min: 20, critical: 10 });
        this.alertThresholds.set('engineRpm', { max: 6000, critical: 6500 });
    }

    setupGeofences() {
        // Define geofences for monitoring
        this.geofences.set('WAREHOUSE', {
            name: 'Main Warehouse',
            type: 'polygon',
            coordinates: [
                { lat: 40.7100, lng: -74.0100 },
                { lat: 40.7150, lng: -74.0100 },
                { lat: 40.7150, lng: -74.0020 },
                { lat: 40.7100, lng: -74.0020 }
            ],
            alerts: {
                enter: true,
                exit: true,
                dwell: { enabled: true, duration: 300000 } // 5 minutes
            }
        });

        this.geofences.set('CUSTOMER_A', {
            name: 'Customer A Location',
            type: 'circle',
            center: { lat: 40.7580, lng: -73.9855 },
            radius: 500, // meters
            alerts: {
                enter: true,
                exit: true
            }
        });

        this.geofences.set('MAINTENANCE_SHOP', {
            name: 'Maintenance Shop',
            type: 'circle',
            center: { lat: 40.7829, lng: -73.9654 },
            radius: 200,
            alerts: {
                enter: true,
                exit: true
            }
        });
    }

    loadVehicleData() {
        // Load saved vehicle data
        const savedData = localStorage.getItem('telematics_vehicles');
        if (savedData) {
            const data = JSON.parse(savedData);
            data.forEach(vehicle => {
                this.vehicleData.set(vehicle.id, vehicle);
            });
        }
    }

    saveVehicleData() {
        const data = Array.from(this.vehicleData.values());
        localStorage.setItem('telematics_vehicles', JSON.stringify(data));
    }

    startRealTimeUpdates() {
        // Start real-time data updates
        setInterval(() => {
            this.updateVehicleData();
            this.checkAlerts();
            this.updateUI();
        }, this.updateInterval);
    }

    simulateIncomingData() {
        // Simulate realistic vehicle data changes
        this.simulatedVehicles.forEach(vehicle => {
            const currentData = this.vehicleData.get(vehicle.id);
            if (!currentData) return;

            // Simulate movement and data changes
            if (currentData.status === 'driving') {
                // Update location (simple simulation)
                currentData.location.lat += (Math.random() - 0.5) * 0.001;
                currentData.location.lng += (Math.random() - 0.5) * 0.001;
                
                // Update speed (realistic driving patterns)
                currentData.speed += (Math.random() - 0.5) * 10;
                currentData.speed = Math.max(0, Math.min(80, currentData.speed));
                
                // Update RPM based on speed
                currentData.engineRpm = Math.floor(currentData.speed * 35 + 800);
                
                // Update fuel level (gradual decrease)
                currentData.fuelLevel -= Math.random() * 0.1;
                currentData.fuelLevel = Math.max(0, currentData.fuelLevel);
                
                // Update trip distance
                currentData.tripDistance += currentData.speed * (this.updateInterval / 1000) / 3600;
                
                // Update engine temperature
                currentData.engineTemp += (Math.random() - 0.5) * 5;
                currentData.engineTemp = Math.max(160, Math.min(240, currentData.engineTemp));
                
                // Update oil pressure
                currentData.oilPressure += (Math.random() - 0.5) * 3;
                currentData.oilPressure = Math.max(5, Math.min(60, currentData.oilPressure));
                
                // Update battery voltage
                currentData.batteryVoltage += (Math.random() - 0.5) * 0.1;
                currentData.batteryVoltage = Math.max(11.0, Math.min(14.0, currentData.batteryVoltage));
                
                // Update odometer
                currentData.odometer += currentData.speed * (this.updateInterval / 1000) / 3600;
                
                // Update engine hours
                currentData.engineHours += this.updateInterval / 1000 / 3600;
                
                // Occasionally stop
                if (Math.random() < 0.05) {
                    currentData.status = 'parked';
                    currentData.speed = 0;
                    currentData.engineRpm = 0;
                }
            } else if (currentData.status === 'parked') {
                // Occasionally start driving
                if (Math.random() < 0.02) {
                    currentData.status = 'driving';
                    currentData.speed = 15;
                    currentData.engineRpm = 1200;
                }
                
                // Gradual battery drain when parked
                currentData.batteryVoltage -= Math.random() * 0.001;
                currentData.batteryVoltage = Math.max(11.0, currentData.batteryVoltage);
            }
            
            // Update timestamp
            currentData.lastUpdate = new Date().toISOString();
            
            // Update stored data
            this.vehicleData.set(vehicle.id, currentData);
        });
    }

    updateVehicleData() {
        // Process real-time vehicle data updates
        this.vehicleData.forEach((vehicle, vehicleId) => {
            // Check geofences
            this.checkGeofenceAlerts(vehicle);
            
            // Update analytics
            this.updateAnalytics(vehicle);
            
            // Process driver behavior
            this.analyzeDriverBehavior(vehicle);
        });
        
        // Save updated data
        this.saveVehicleData();
    }

    checkAlerts() {
        // Check for various alert conditions
        this.vehicleData.forEach((vehicle, vehicleId) => {
            const alerts = this.generateAlerts(vehicle);
            
            if (alerts.length > 0) {
                alerts.forEach(alert => {
                    this.sendAlert(alert);
                });
            }
        });
    }

    generateAlerts(vehicle) {
        const alerts = [];
        
        // Speed alerts
        const speedThreshold = this.alertThresholds.get('speed');
        if (vehicle.speed > speedThreshold.critical) {
            alerts.push({
                type: 'speed',
                severity: 'critical',
                vehicle: vehicle.id,
                message: `Critical speeding: ${vehicle.speed} mph`,
                timestamp: new Date().toISOString()
            });
        } else if (vehicle.speed > speedThreshold.max) {
            alerts.push({
                type: 'speed',
                severity: 'warning',
                vehicle: vehicle.id,
                message: `Speeding detected: ${vehicle.speed} mph`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Engine temperature alerts
        const tempThreshold = this.alertThresholds.get('engineTemp');
        if (vehicle.engineTemp > tempThreshold.critical) {
            alerts.push({
                type: 'engineTemp',
                severity: 'critical',
                vehicle: vehicle.id,
                message: `Critical engine temperature: ${vehicle.engineTemp}°F`,
                timestamp: new Date().toISOString()
            });
        } else if (vehicle.engineTemp > tempThreshold.max) {
            alerts.push({
                type: 'engineTemp',
                severity: 'warning',
                vehicle: vehicle.id,
                message: `High engine temperature: ${vehicle.engineTemp}°F`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Oil pressure alerts
        const oilThreshold = this.alertThresholds.get('oilPressure');
        if (vehicle.oilPressure < oilThreshold.critical) {
            alerts.push({
                type: 'oilPressure',
                severity: 'critical',
                vehicle: vehicle.id,
                message: `Critical low oil pressure: ${vehicle.oilPressure} psi`,
                timestamp: new Date().toISOString()
            });
        } else if (vehicle.oilPressure < oilThreshold.min) {
            alerts.push({
                type: 'oilPressure',
                severity: 'warning',
                vehicle: vehicle.id,
                message: `Low oil pressure: ${vehicle.oilPressure} psi`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Battery voltage alerts
        const batteryThreshold = this.alertThresholds.get('batteryVoltage');
        if (vehicle.batteryVoltage < batteryThreshold.critical) {
            alerts.push({
                type: 'batteryVoltage',
                severity: 'critical',
                vehicle: vehicle.id,
                message: `Critical low battery: ${vehicle.batteryVoltage}V`,
                timestamp: new Date().toISOString()
            });
        } else if (vehicle.batteryVoltage < batteryThreshold.min) {
            alerts.push({
                type: 'batteryVoltage',
                severity: 'warning',
                vehicle: vehicle.id,
                message: `Low battery voltage: ${vehicle.batteryVoltage}V`,
                timestamp: new Date().toISOString()
            });
        }
        
        // Fuel level alerts
        const fuelThreshold = this.alertThresholds.get('fuelLevel');
        if (vehicle.fuelLevel < fuelThreshold.critical) {
            alerts.push({
                type: 'fuelLevel',
                severity: 'critical',
                vehicle: vehicle.id,
                message: `Critical low fuel: ${vehicle.fuelLevel}%`,
                timestamp: new Date().toISOString()
            });
        } else if (vehicle.fuelLevel < fuelThreshold.min) {
            alerts.push({
                type: 'fuelLevel',
                severity: 'warning',
                vehicle: vehicle.id,
                message: `Low fuel level: ${vehicle.fuelLevel}%`,
                timestamp: new Date().toISOString()
            });
        }
        
        return alerts;
    }

    checkGeofenceAlerts(vehicle) {
        // Check if vehicle is entering/exiting geofences
        this.geofences.forEach((geofence, geofenceId) => {
            const isInside = this.isInsideGeofence(vehicle.location, geofence);
            const wasInside = vehicle.previousGeofenceStatus?.[geofenceId] || false;
            
            if (!vehicle.previousGeofenceStatus) {
                vehicle.previousGeofenceStatus = {};
            }
            
            if (isInside && !wasInside) {
                // Vehicle entered geofence
                if (geofence.alerts.enter) {
                    this.sendAlert({
                        type: 'geofence',
                        severity: 'info',
                        vehicle: vehicle.id,
                        message: `Vehicle entered ${geofence.name}`,
                        timestamp: new Date().toISOString(),
                        geofence: geofenceId
                    });
                }
            } else if (!isInside && wasInside) {
                // Vehicle exited geofence
                if (geofence.alerts.exit) {
                    this.sendAlert({
                        type: 'geofence',
                        severity: 'info',
                        vehicle: vehicle.id,
                        message: `Vehicle exited ${geofence.name}`,
                        timestamp: new Date().toISOString(),
                        geofence: geofenceId
                    });
                }
            }
            
            vehicle.previousGeofenceStatus[geofenceId] = isInside;
        });
    }

    isInsideGeofence(location, geofence) {
        if (geofence.type === 'circle') {
            const distance = this.calculateDistance(location, geofence.center);
            return distance <= geofence.radius;
        } else if (geofence.type === 'polygon') {
            return this.isPointInPolygon(location, geofence.coordinates);
        }
        return false;
    }

    calculateDistance(point1, point2) {
        // Calculate distance between two points using Haversine formula
        const R = 6371000; // Earth's radius in meters
        const lat1Rad = point1.lat * Math.PI / 180;
        const lat2Rad = point2.lat * Math.PI / 180;
        const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
        const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;
        
        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                  Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                  Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }

    isPointInPolygon(point, polygon) {
        // Ray casting algorithm for point in polygon
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i].lat > point.lat) !== (polygon[j].lat > point.lat)) &&
                (point.lng < (polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat) / (polygon[j].lat - polygon[i].lat) + polygon[i].lng)) {
                inside = !inside;
            }
        }
        return inside;
    }

    sendAlert(alert) {
        // Send alert to notification system
        if (window.notificationManager) {
            window.notificationManager.sendAlert(alert);
        }
        
        // Log alert
        console.log('Telematics Alert:', alert);
        
        // Store alert in history
        const alerts = JSON.parse(localStorage.getItem('telematics_alerts') || '[]');
        alerts.push(alert);
        
        // Keep only last 1000 alerts
        if (alerts.length > 1000) {
            alerts.splice(0, alerts.length - 1000);
        }
        
        localStorage.setItem('telematics_alerts', JSON.stringify(alerts));
    }

    updateAnalytics(vehicle) {
        // Update analytics with vehicle data
        if (window.analyticsManager) {
            window.analyticsManager.updateTelematicsData(vehicle);
        }
    }

    analyzeDriverBehavior(vehicle) {
        // Analyze driver behavior patterns
        if (!vehicle.driverBehavior) {
            vehicle.driverBehavior = {
                scores: {
                    acceleration: 100,
                    braking: 100,
                    cornering: 100,
                    speeding: 100,
                    idling: 100
                },
                events: [],
                lastAnalysis: new Date().toISOString()
            };
        }
        
        const behavior = vehicle.driverBehavior;
        
        // Harsh acceleration detection
        if (vehicle.previousSpeed && vehicle.speed > vehicle.previousSpeed + 15) {
            behavior.scores.acceleration = Math.max(0, behavior.scores.acceleration - 5);
            behavior.events.push({
                type: 'harsh_acceleration',
                timestamp: new Date().toISOString(),
                location: vehicle.location,
                speed: vehicle.speed
            });
        }
        
        // Harsh braking detection
        if (vehicle.previousSpeed && vehicle.speed < vehicle.previousSpeed - 15) {
            behavior.scores.braking = Math.max(0, behavior.scores.braking - 5);
            behavior.events.push({
                type: 'harsh_braking',
                timestamp: new Date().toISOString(),
                location: vehicle.location,
                speed: vehicle.speed
            });
        }
        
        // Speeding detection
        if (vehicle.speed > 80) {
            behavior.scores.speeding = Math.max(0, behavior.scores.speeding - 2);
        }
        
        // Excessive idling detection
        if (vehicle.status === 'parked' && vehicle.engineRpm > 0) {
            behavior.scores.idling = Math.max(0, behavior.scores.idling - 1);
        }
        
        // Store previous speed for next analysis
        vehicle.previousSpeed = vehicle.speed;
        
        // Update last analysis time
        behavior.lastAnalysis = new Date().toISOString();
        
        // Keep only last 100 events
        if (behavior.events.length > 100) {
            behavior.events.splice(0, behavior.events.length - 100);
        }
    }

    updateUI() {
        // Update telematics UI if active
        const telematicsSection = document.querySelector('.telematics-section');
        if (telematicsSection && telematicsSection.classList.contains('active')) {
            this.renderTelematicsData();
        }
    }

    renderTelematicsData() {
        const container = document.getElementById('telematics-data');
        if (!container) return;
        
        const vehicles = Array.from(this.vehicleData.values());
        
        container.innerHTML = `
            <div class="telematics-header">
                <h3>Live Vehicle Tracking</h3>
                <div class="connection-status ${this.isConnected ? 'connected' : 'disconnected'}">
                    ${this.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </div>
            </div>
            
            <div class="vehicles-grid">
                ${vehicles.map(vehicle => this.renderVehicleCard(vehicle)).join('')}
            </div>
            
            <div class="telematics-map">
                <div id="vehicle-map" style="height: 400px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                    <span>🗺️ Live Map View (Integration with mapping service)</span>
                </div>
            </div>
            
            <div class="recent-alerts">
                <h4>Recent Alerts</h4>
                <div class="alerts-list">
                    ${this.renderRecentAlerts()}
                </div>
            </div>
        `;
    }

    renderVehicleCard(vehicle) {
        const statusClass = vehicle.status === 'driving' ? 'driving' : 'parked';
        const fuelClass = vehicle.fuelLevel < 20 ? 'low' : vehicle.fuelLevel < 50 ? 'medium' : 'high';
        
        return `
            <div class="vehicle-card ${statusClass}">
                <div class="vehicle-header">
                    <h4>${vehicle.id}</h4>
                    <span class="vehicle-status ${statusClass}">${vehicle.status}</span>
                </div>
                
                <div class="vehicle-info">
                    <div class="info-row">
                        <span class="label">Make/Model:</span>
                        <span class="value">${vehicle.make} ${vehicle.model}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Speed:</span>
                        <span class="value">${Math.round(vehicle.speed)} mph</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Fuel:</span>
                        <span class="value fuel-level ${fuelClass}">${Math.round(vehicle.fuelLevel)}%</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Engine Temp:</span>
                        <span class="value">${Math.round(vehicle.engineTemp)}°F</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Location:</span>
                        <span class="value">${vehicle.location.lat.toFixed(4)}, ${vehicle.location.lng.toFixed(4)}</span>
                    </div>
                </div>
                
                <div class="vehicle-actions">
                    <button class="btn btn-sm" onclick="telematicsSystem.viewVehicleDetails('${vehicle.id}')">
                        View Details
                    </button>
                    <button class="btn btn-sm" onclick="telematicsSystem.trackVehicle('${vehicle.id}')">
                        Track
                    </button>
                </div>
            </div>
        `;
    }

    renderRecentAlerts() {
        const alerts = JSON.parse(localStorage.getItem('telematics_alerts') || '[]');
        const recentAlerts = alerts.slice(-5).reverse();
        
        if (recentAlerts.length === 0) {
            return '<p>No recent alerts</p>';
        }
        
        return recentAlerts.map(alert => `
            <div class="alert-item ${alert.severity}">
                <div class="alert-icon">
                    ${this.getAlertIcon(alert.type)}
                </div>
                <div class="alert-content">
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${new Date(alert.timestamp).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    getAlertIcon(type) {
        const icons = {
            speed: '⚡',
            engineTemp: '🌡️',
            oilPressure: '🛢️',
            batteryVoltage: '🔋',
            fuelLevel: '⛽',
            geofence: '📍'
        };
        return icons[type] || '⚠️';
    }

    // Public API methods
    getVehicleData(vehicleId) {
        return this.vehicleData.get(vehicleId);
    }

    getAllVehicles() {
        return Array.from(this.vehicleData.values());
    }

    getVehicleHistory(vehicleId, timeRange = '24h') {
        // Get vehicle history data
        const history = JSON.parse(localStorage.getItem(`vehicle_history_${vehicleId}`) || '[]');
        
        // Filter by time range
        const cutoff = new Date();
        if (timeRange === '24h') {
            cutoff.setHours(cutoff.getHours() - 24);
        } else if (timeRange === '7d') {
            cutoff.setDate(cutoff.getDate() - 7);
        } else if (timeRange === '30d') {
            cutoff.setDate(cutoff.getDate() - 30);
        }
        
        return history.filter(record => new Date(record.timestamp) > cutoff);
    }

    addGeofence(id, geofence) {
        this.geofences.set(id, geofence);
        this.saveGeofences();
    }

    removeGeofence(id) {
        this.geofences.delete(id);
        this.saveGeofences();
    }

    saveGeofences() {
        const geofences = Array.from(this.geofences.entries());
        localStorage.setItem('telematics_geofences', JSON.stringify(geofences));
    }

    viewVehicleDetails(vehicleId) {
        const vehicle = this.vehicleData.get(vehicleId);
        if (!vehicle) return;
        
        // Show detailed vehicle information modal
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Vehicle Details - ${vehicle.id}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-content">
                    ${this.renderVehicleDetails(vehicle)}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    renderVehicleDetails(vehicle) {
        return `
            <div class="vehicle-details">
                <div class="details-section">
                    <h4>Vehicle Information</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <span class="label">VIN:</span>
                            <span class="value">${vehicle.vin}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Make/Model:</span>
                            <span class="value">${vehicle.make} ${vehicle.model} ${vehicle.year}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Odometer:</span>
                            <span class="value">${Math.round(vehicle.odometer)} miles</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Engine Hours:</span>
                            <span class="value">${Math.round(vehicle.engineHours)} hours</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Current Status</h4>
                    <div class="status-grid">
                        <div class="status-item">
                            <span class="label">Status:</span>
                            <span class="value ${vehicle.status}">${vehicle.status}</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Speed:</span>
                            <span class="value">${Math.round(vehicle.speed)} mph</span>
                        </div>
                        <div class="status-item">
                            <span class="label">RPM:</span>
                            <span class="value">${Math.round(vehicle.engineRpm)}</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Fuel Level:</span>
                            <span class="value">${Math.round(vehicle.fuelLevel)}%</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Engine Temp:</span>
                            <span class="value">${Math.round(vehicle.engineTemp)}°F</span>
                        </div>
                        <div class="status-item">
                            <span class="label">Oil Pressure:</span>
                            <span class="value">${Math.round(vehicle.oilPressure)} psi</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Driver Behavior</h4>
                    <div class="behavior-scores">
                        ${this.renderDriverBehaviorScores(vehicle.driverBehavior)}
                    </div>
                </div>
            </div>
        `;
    }

    renderDriverBehaviorScores(behavior) {
        if (!behavior) return '<p>No behavior data available</p>';
        
        return Object.entries(behavior.scores).map(([metric, score]) => `
            <div class="behavior-metric">
                <span class="metric-name">${metric.charAt(0).toUpperCase() + metric.slice(1)}:</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score}%; background: ${score > 80 ? '#22c55e' : score > 60 ? '#f59e0b' : '#ef4444'}"></div>
                </div>
                <span class="score-value">${score}/100</span>
            </div>
        `).join('');
    }

    trackVehicle(vehicleId) {
        const vehicle = this.vehicleData.get(vehicleId);
        if (!vehicle) return;
        
        // Center map on vehicle location
        console.log(`Tracking vehicle ${vehicleId} at ${vehicle.location.lat}, ${vehicle.location.lng}`);
        
        // In a real implementation, this would center the map on the vehicle
        // For now, we'll just show a notification
        if (window.notificationManager) {
            window.notificationManager.showNotification(`Now tracking ${vehicleId}`, 'info');
        }
    }

    // Cleanup
    cleanup() {
        if (this.webSocket) {
            this.webSocket.close();
        }
        this.isConnected = false;
    }
}

// Initialize telematics system
window.telematicsSystem = new TelematicsSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TelematicsSystem;
}
