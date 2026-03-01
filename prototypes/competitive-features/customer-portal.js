/**
 * Customer Portal System
 * Self-service portal for vehicle owners and customers
 */

class CustomerPortalSystem {
    constructor() {
        this.customers = new Map();
        this.sessions = new Map();
        this.appointments = new Map();
        this.serviceRequests = new Map();
        this.notifications = new Map();
        this.communications = new Map();
        this.loyaltyProgram = new Map();
        this.currentCustomer = null;
        this.portalFeatures = new Set();
        this.communicationChannels = new Map();
        this.init();
    }

    init() {
        this.loadCustomerData();
        this.setupPortalFeatures();
        this.setupCommunicationChannels();
        this.setupLoyaltyProgram();
        this.loadSampleData();
        console.log('Customer Portal System initialized');
    }

    loadCustomerData() {
        const savedCustomers = localStorage.getItem('customer_portal_customers');
        if (savedCustomers) {
            const customers = JSON.parse(savedCustomers);
            customers.forEach(customer => {
                this.customers.set(customer.id, customer);
            });
        }

        const savedSessions = localStorage.getItem('customer_portal_sessions');
        if (savedSessions) {
            const sessions = JSON.parse(savedSessions);
            sessions.forEach(session => {
                this.sessions.set(session.id, session);
            });
        }
    }

    saveCustomerData() {
        const customers = Array.from(this.customers.values());
        localStorage.setItem('customer_portal_customers', JSON.stringify(customers));

        const sessions = Array.from(this.sessions.values());
        localStorage.setItem('customer_portal_sessions', JSON.stringify(sessions));
    }

    setupPortalFeatures() {
        this.portalFeatures.add('appointment_booking');
        this.portalFeatures.add('service_history');
        this.portalFeatures.add('invoice_management');
        this.portalFeatures.add('vehicle_management');
        this.portalFeatures.add('communication_center');
        this.portalFeatures.add('loyalty_rewards');
        this.portalFeatures.add('maintenance_reminders');
        this.portalFeatures.add('emergency_roadside');
        this.portalFeatures.add('document_storage');
        this.portalFeatures.add('feedback_system');
    }

    setupCommunicationChannels() {
        this.communicationChannels.set('email', {
            enabled: true,
            preferences: ['service_updates', 'promotions', 'reminders']
        });
        
        this.communicationChannels.set('sms', {
            enabled: true,
            preferences: ['appointment_confirmations', 'service_ready', 'urgent_notifications']
        });
        
        this.communicationChannels.set('push', {
            enabled: true,
            preferences: ['real_time_updates', 'chat_messages', 'emergency_alerts']
        });
        
        this.communicationChannels.set('in_app', {
            enabled: true,
            preferences: ['all_notifications', 'system_announcements', 'personalized_offers']
        });
    }

    setupLoyaltyProgram() {
        this.loyaltyProgram.set('tiers', [
            { name: 'Bronze', minPoints: 0, benefits: ['Basic support', '5% parts discount'] },
            { name: 'Silver', minPoints: 500, benefits: ['Priority support', '10% parts discount', 'Free diagnostics'] },
            { name: 'Gold', minPoints: 1500, benefits: ['VIP support', '15% parts discount', 'Free annual inspection'] },
            { name: 'Platinum', minPoints: 3000, benefits: ['Dedicated advisor', '20% parts discount', 'Free roadside assistance'] }
        ]);
        
        this.loyaltyProgram.set('pointsSystem', {
            serviceVisit: 50,
            partspurchase: 25,
            referral: 200,
            review: 25,
            socialShare: 10
        });
    }

    loadSampleData() {
        if (this.customers.size === 0) {
            this.createSampleCustomers();
        }
    }

    createSampleCustomers() {
        const sampleCustomers = [
            {
                id: 'CUST-001',
                email: 'john.doe@email.com',
                firstName: 'John',
                lastName: 'Doe',
                phone: '555-0123',
                address: {
                    street: '123 Main St',
                    city: 'Anytown',
                    state: 'CA',
                    zipCode: '12345'
                },
                vehicles: [
                    {
                        vin: '1HGCM82633A123456',
                        year: 2020,
                        make: 'Honda',
                        model: 'Civic',
                        licensePlate: 'ABC123',
                        color: 'Blue'
                    }
                ],
                loyaltyPoints: 750,
                tier: 'Silver',
                preferences: {
                    communicationChannel: 'email',
                    serviceReminders: true,
                    promotionalOffers: true,
                    appointmentConfirmations: true
                },
                createdAt: new Date('2023-01-15').toISOString(),
                lastLogin: new Date('2024-01-10').toISOString()
            },
            {
                id: 'CUST-002',
                email: 'jane.smith@email.com',
                firstName: 'Jane',
                lastName: 'Smith',
                phone: '555-0456',
                address: {
                    street: '456 Oak Ave',
                    city: 'Somewhere',
                    state: 'NY',
                    zipCode: '67890'
                },
                vehicles: [
                    {
                        vin: '1FTFW1ET5DKE12345',
                        year: 2019,
                        make: 'Ford',
                        model: 'F-150',
                        licensePlate: 'XYZ789',
                        color: 'Red'
                    },
                    {
                        vin: '5NPE34AF4HH123456',
                        year: 2017,
                        make: 'Hyundai',
                        model: 'Sonata',
                        licensePlate: 'DEF456',
                        color: 'White'
                    }
                ],
                loyaltyPoints: 1850,
                tier: 'Gold',
                preferences: {
                    communicationChannel: 'sms',
                    serviceReminders: true,
                    promotionalOffers: false,
                    appointmentConfirmations: true
                },
                createdAt: new Date('2022-08-20').toISOString(),
                lastLogin: new Date('2024-01-12').toISOString()
            }
        ];

        sampleCustomers.forEach(customer => {
            this.customers.set(customer.id, customer);
        });

        this.saveCustomerData();
    }

    // Authentication methods
    authenticateCustomer(email, password) {
        // Simulate authentication
        const customer = Array.from(this.customers.values()).find(c => c.email === email);
        
        if (customer && this.validatePassword(password)) {
            const sessionId = this.generateSessionId();
            const session = {
                id: sessionId,
                customerId: customer.id,
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                ipAddress: '127.0.0.1', // Simulated
                userAgent: navigator.userAgent,
                isActive: true
            };
            
            this.sessions.set(sessionId, session);
            this.currentCustomer = customer;
            
            // Update last login
            customer.lastLogin = new Date().toISOString();
            this.customers.set(customer.id, customer);
            
            this.saveCustomerData();
            return { success: true, sessionId, customer };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }

    validatePassword(password) {
        // Simple password validation for demo
        return password && password.length >= 6;
    }

    generateSessionId() {
        return 'SES_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    registerCustomer(customerData) {
        const customerId = this.generateCustomerId();
        const customer = {
            id: customerId,
            email: customerData.email,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            phone: customerData.phone,
            address: customerData.address,
            vehicles: customerData.vehicles || [],
            loyaltyPoints: 0,
            tier: 'Bronze',
            preferences: {
                communicationChannel: 'email',
                serviceReminders: true,
                promotionalOffers: true,
                appointmentConfirmations: true
            },
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        
        this.customers.set(customerId, customer);
        this.saveCustomerData();
        
        // Send welcome notification
        this.sendWelcomeNotification(customer);
        
        return customer;
    }

    generateCustomerId() {
        return 'CUST-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    logoutCustomer(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            session.endedAt = new Date().toISOString();
            this.sessions.set(sessionId, session);
        }
        
        this.currentCustomer = null;
        this.saveCustomerData();
    }

    // Vehicle management
    addVehicle(customerId, vehicleData) {
        const customer = this.customers.get(customerId);
        if (!customer) return false;
        
        const vehicle = {
            id: this.generateVehicleId(),
            vin: vehicleData.vin,
            year: vehicleData.year,
            make: vehicleData.make,
            model: vehicleData.model,
            licensePlate: vehicleData.licensePlate,
            color: vehicleData.color,
            addedAt: new Date().toISOString()
        };
        
        customer.vehicles.push(vehicle);
        this.customers.set(customerId, customer);
        this.saveCustomerData();
        
        return vehicle;
    }

    generateVehicleId() {
        return 'VEH_' + Math.random().toString(36).substr(2, 8);
    }

    removeVehicle(customerId, vehicleId) {
        const customer = this.customers.get(customerId);
        if (!customer) return false;
        
        customer.vehicles = customer.vehicles.filter(v => v.id !== vehicleId);
        this.customers.set(customerId, customer);
        this.saveCustomerData();
        
        return true;
    }

    // Appointment management
    bookAppointment(customerId, appointmentData) {
        const appointmentId = this.generateAppointmentId();
        const appointment = {
            id: appointmentId,
            customerId: customerId,
            vehicleId: appointmentData.vehicleId,
            serviceType: appointmentData.serviceType,
            preferredDate: appointmentData.preferredDate,
            preferredTime: appointmentData.preferredTime,
            description: appointmentData.description,
            priority: appointmentData.priority || 'normal',
            status: 'requested',
            createdAt: new Date().toISOString(),
            estimatedDuration: appointmentData.estimatedDuration || 60,
            estimatedCost: appointmentData.estimatedCost || 0
        };
        
        this.appointments.set(appointmentId, appointment);
        this.saveAppointmentData();
        
        // Send confirmation notification
        this.sendAppointmentConfirmation(appointment);
        
        return appointment;
    }

    generateAppointmentId() {
        return 'APT_' + Math.random().toString(36).substr(2, 8);
    }

    cancelAppointment(appointmentId, reason) {
        const appointment = this.appointments.get(appointmentId);
        if (!appointment) return false;
        
        appointment.status = 'cancelled';
        appointment.cancellationReason = reason;
        appointment.cancelledAt = new Date().toISOString();
        
        this.appointments.set(appointmentId, appointment);
        this.saveAppointmentData();
        
        // Send cancellation notification
        this.sendAppointmentCancellation(appointment);
        
        return true;
    }

    rescheduleAppointment(appointmentId, newDate, newTime) {
        const appointment = this.appointments.get(appointmentId);
        if (!appointment) return false;
        
        appointment.previousDate = appointment.preferredDate;
        appointment.previousTime = appointment.preferredTime;
        appointment.preferredDate = newDate;
        appointment.preferredTime = newTime;
        appointment.status = 'rescheduled';
        appointment.rescheduledAt = new Date().toISOString();
        
        this.appointments.set(appointmentId, appointment);
        this.saveAppointmentData();
        
        // Send reschedule notification
        this.sendAppointmentReschedule(appointment);
        
        return appointment;
    }

    saveAppointmentData() {
        const appointments = Array.from(this.appointments.values());
        localStorage.setItem('customer_portal_appointments', JSON.stringify(appointments));
    }

    loadAppointmentData() {
        const saved = localStorage.getItem('customer_portal_appointments');
        if (saved) {
            const appointments = JSON.parse(saved);
            appointments.forEach(appointment => {
                this.appointments.set(appointment.id, appointment);
            });
        }
    }

    // Service request management
    createServiceRequest(customerId, requestData) {
        const requestId = this.generateServiceRequestId();
        const serviceRequest = {
            id: requestId,
            customerId: customerId,
            vehicleId: requestData.vehicleId,
            type: requestData.type,
            description: requestData.description,
            priority: requestData.priority || 'normal',
            status: 'open',
            createdAt: new Date().toISOString(),
            attachments: requestData.attachments || [],
            estimatedCost: 0,
            actualCost: 0,
            assignedTechnician: null,
            completedAt: null
        };
        
        this.serviceRequests.set(requestId, serviceRequest);
        this.saveServiceRequestData();
        
        // Send acknowledgment notification
        this.sendServiceRequestAcknowledgment(serviceRequest);
        
        return serviceRequest;
    }

    generateServiceRequestId() {
        return 'SRQ_' + Math.random().toString(36).substr(2, 8);
    }

    updateServiceRequest(requestId, updates) {
        const serviceRequest = this.serviceRequests.get(requestId);
        if (!serviceRequest) return false;
        
        Object.assign(serviceRequest, updates);
        serviceRequest.lastUpdated = new Date().toISOString();
        
        this.serviceRequests.set(requestId, serviceRequest);
        this.saveServiceRequestData();
        
        // Send update notification
        this.sendServiceRequestUpdate(serviceRequest);
        
        return serviceRequest;
    }

    saveServiceRequestData() {
        const requests = Array.from(this.serviceRequests.values());
        localStorage.setItem('customer_portal_service_requests', JSON.stringify(requests));
    }

    loadServiceRequestData() {
        const saved = localStorage.getItem('customer_portal_service_requests');
        if (saved) {
            const requests = JSON.parse(saved);
            requests.forEach(request => {
                this.serviceRequests.set(request.id, request);
            });
        }
    }

    // Communication system
    sendMessage(fromCustomerId, toUserId, message) {
        const messageId = this.generateMessageId();
        const messageData = {
            id: messageId,
            fromCustomerId: fromCustomerId,
            toUserId: toUserId,
            message: message,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'customer_to_staff'
        };
        
        this.communications.set(messageId, messageData);
        this.saveCommunicationData();
        
        // Send real-time notification
        this.sendRealTimeNotification(messageData);
        
        return messageData;
    }

    generateMessageId() {
        return 'MSG_' + Math.random().toString(36).substr(2, 8);
    }

    getMessages(customerId) {
        const messages = Array.from(this.communications.values())
            .filter(msg => msg.fromCustomerId === customerId || msg.toCustomerId === customerId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return messages;
    }

    markMessageAsRead(messageId) {
        const message = this.communications.get(messageId);
        if (message) {
            message.read = true;
            message.readAt = new Date().toISOString();
            this.communications.set(messageId, message);
            this.saveCommunicationData();
        }
    }

    saveCommunicationData() {
        const messages = Array.from(this.communications.values());
        localStorage.setItem('customer_portal_communications', JSON.stringify(messages));
    }

    loadCommunicationData() {
        const saved = localStorage.getItem('customer_portal_communications');
        if (saved) {
            const messages = JSON.parse(saved);
            messages.forEach(message => {
                this.communications.set(message.id, message);
            });
        }
    }

    // Notification system
    sendNotification(customerId, notification) {
        const notificationId = this.generateNotificationId();
        const notificationData = {
            id: notificationId,
            customerId: customerId,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            priority: notification.priority || 'normal',
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: notification.actionUrl || null,
            metadata: notification.metadata || {}
        };
        
        this.notifications.set(notificationId, notificationData);
        this.saveNotificationData();
        
        // Send via preferred communication channel
        this.sendViaPreferredChannel(customerId, notificationData);
        
        return notificationData;
    }

    generateNotificationId() {
        return 'NOT_' + Math.random().toString(36).substr(2, 8);
    }

    sendViaPreferredChannel(customerId, notification) {
        const customer = this.customers.get(customerId);
        if (!customer) return;
        
        const channel = customer.preferences.communicationChannel;
        
        switch (channel) {
            case 'email':
                this.sendEmailNotification(customer, notification);
                break;
            case 'sms':
                this.sendSMSNotification(customer, notification);
                break;
            case 'push':
                this.sendPushNotification(customer, notification);
                break;
            default:
                this.sendInAppNotification(customer, notification);
        }
    }

    sendEmailNotification(customer, notification) {
        console.log(`Sending email to ${customer.email}:`, notification);
        // In production, integrate with email service
    }

    sendSMSNotification(customer, notification) {
        console.log(`Sending SMS to ${customer.phone}:`, notification);
        // In production, integrate with SMS service
    }

    sendPushNotification(customer, notification) {
        console.log(`Sending push notification to ${customer.id}:`, notification);
        // In production, integrate with push service
    }

    sendInAppNotification(customer, notification) {
        console.log(`Sending in-app notification to ${customer.id}:`, notification);
        // Display in portal interface
    }

    // Notification templates
    sendWelcomeNotification(customer) {
        this.sendNotification(customer.id, {
            title: 'Welcome to RepairBridge Portal',
            message: `Welcome ${customer.firstName}! Your customer portal is ready to use.`,
            type: 'welcome',
            priority: 'normal'
        });
    }

    sendAppointmentConfirmation(appointment) {
        this.sendNotification(appointment.customerId, {
            title: 'Appointment Requested',
            message: `Your appointment request for ${appointment.serviceType} has been received.`,
            type: 'appointment',
            priority: 'normal',
            actionUrl: `/appointments/${appointment.id}`
        });
    }

    sendAppointmentCancellation(appointment) {
        this.sendNotification(appointment.customerId, {
            title: 'Appointment Cancelled',
            message: `Your appointment for ${appointment.serviceType} has been cancelled.`,
            type: 'appointment',
            priority: 'normal'
        });
    }

    sendAppointmentReschedule(appointment) {
        this.sendNotification(appointment.customerId, {
            title: 'Appointment Rescheduled',
            message: `Your appointment has been rescheduled to ${appointment.preferredDate} at ${appointment.preferredTime}.`,
            type: 'appointment',
            priority: 'normal'
        });
    }

    sendServiceRequestAcknowledgment(serviceRequest) {
        this.sendNotification(serviceRequest.customerId, {
            title: 'Service Request Received',
            message: `Your service request #${serviceRequest.id} has been received and is being processed.`,
            type: 'service',
            priority: 'normal'
        });
    }

    sendServiceRequestUpdate(serviceRequest) {
        this.sendNotification(serviceRequest.customerId, {
            title: 'Service Request Update',
            message: `Your service request #${serviceRequest.id} status has been updated to: ${serviceRequest.status}`,
            type: 'service',
            priority: 'normal'
        });
    }

    sendRealTimeNotification(message) {
        // Send real-time notification for new messages
        console.log('Real-time notification:', message);
    }

    saveNotificationData() {
        const notifications = Array.from(this.notifications.values());
        localStorage.setItem('customer_portal_notifications', JSON.stringify(notifications));
    }

    loadNotificationData() {
        const saved = localStorage.getItem('customer_portal_notifications');
        if (saved) {
            const notifications = JSON.parse(saved);
            notifications.forEach(notification => {
                this.notifications.set(notification.id, notification);
            });
        }
    }

    // Loyalty program
    addLoyaltyPoints(customerId, points, reason) {
        const customer = this.customers.get(customerId);
        if (!customer) return false;
        
        customer.loyaltyPoints += points;
        
        // Check for tier upgrade
        const newTier = this.calculateTier(customer.loyaltyPoints);
        if (newTier !== customer.tier) {
            customer.tier = newTier;
            this.sendTierUpgradeNotification(customer, newTier);
        }
        
        this.customers.set(customerId, customer);
        this.saveCustomerData();
        
        // Record points transaction
        this.recordPointsTransaction(customerId, points, reason);
        
        return true;
    }

    calculateTier(points) {
        const tiers = this.loyaltyProgram.get('tiers');
        
        for (let i = tiers.length - 1; i >= 0; i--) {
            if (points >= tiers[i].minPoints) {
                return tiers[i].name;
            }
        }
        
        return 'Bronze';
    }

    recordPointsTransaction(customerId, points, reason) {
        const transaction = {
            id: this.generateTransactionId(),
            customerId: customerId,
            points: points,
            reason: reason,
            timestamp: new Date().toISOString()
        };
        
        // Store transaction (in production, use database)
        const transactions = JSON.parse(localStorage.getItem('loyalty_transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('loyalty_transactions', JSON.stringify(transactions));
    }

    generateTransactionId() {
        return 'TXN_' + Math.random().toString(36).substr(2, 8);
    }

    sendTierUpgradeNotification(customer, newTier) {
        const tier = this.loyaltyProgram.get('tiers').find(t => t.name === newTier);
        
        this.sendNotification(customer.id, {
            title: 'Tier Upgraded!',
            message: `Congratulations! You've been upgraded to ${newTier} tier. New benefits: ${tier.benefits.join(', ')}`,
            type: 'loyalty',
            priority: 'high'
        });
    }

    // UI rendering methods
    renderCustomerDashboard(customerId) {
        const customer = this.customers.get(customerId);
        if (!customer) return '';
        
        return `
            <div class="customer-dashboard">
                <div class="dashboard-header">
                    <h2>Welcome back, ${customer.firstName}!</h2>
                    <div class="loyalty-status">
                        <span class="tier ${customer.tier.toLowerCase()}">${customer.tier}</span>
                        <span class="points">${customer.loyaltyPoints} points</span>
                    </div>
                </div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>Vehicles</h3>
                        <div class="stat-value">${customer.vehicles.length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Appointments</h3>
                        <div class="stat-value">${this.getCustomerAppointments(customerId).length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Service Requests</h3>
                        <div class="stat-value">${this.getCustomerServiceRequests(customerId).length}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Messages</h3>
                        <div class="stat-value">${this.getUnreadMessages(customerId).length}</div>
                    </div>
                </div>
                
                <div class="dashboard-sections">
                    <div class="section">
                        <h3>Recent Activity</h3>
                        <div class="recent-activity">
                            ${this.renderRecentActivity(customerId)}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h3>Quick Actions</h3>
                        <div class="quick-actions">
                            <button class="action-btn" onclick="customerPortal.showBookAppointment()">
                                📅 Book Appointment
                            </button>
                            <button class="action-btn" onclick="customerPortal.showServiceRequest()">
                                🔧 Request Service
                            </button>
                            <button class="action-btn" onclick="customerPortal.showVehicles()">
                                🚗 My Vehicles
                            </button>
                            <button class="action-btn" onclick="customerPortal.showMessages()">
                                💬 Messages
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentActivity(customerId) {
        const appointments = this.getCustomerAppointments(customerId).slice(-3);
        const serviceRequests = this.getCustomerServiceRequests(customerId).slice(-3);
        
        const activities = [...appointments, ...serviceRequests]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        if (activities.length === 0) {
            return '<p>No recent activity</p>';
        }
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${activity.serviceType ? '📅' : '🔧'}
                </div>
                <div class="activity-content">
                    <div class="activity-title">
                        ${activity.serviceType ? `Appointment: ${activity.serviceType}` : `Service Request: ${activity.type}`}
                    </div>
                    <div class="activity-time">
                        ${new Date(activity.createdAt).toLocaleDateString()}
                    </div>
                </div>
                <div class="activity-status ${activity.status}">
                    ${activity.status}
                </div>
            </div>
        `).join('');
    }

    getCustomerAppointments(customerId) {
        return Array.from(this.appointments.values())
            .filter(appointment => appointment.customerId === customerId);
    }

    getCustomerServiceRequests(customerId) {
        return Array.from(this.serviceRequests.values())
            .filter(request => request.customerId === customerId);
    }

    getUnreadMessages(customerId) {
        return Array.from(this.communications.values())
            .filter(msg => msg.toCustomerId === customerId && !msg.read);
    }

    // Public API methods
    isCustomerLoggedIn() {
        return this.currentCustomer !== null;
    }

    getCurrentCustomer() {
        return this.currentCustomer;
    }

    getCustomerById(customerId) {
        return this.customers.get(customerId);
    }

    // Cleanup
    cleanup() {
        this.saveCustomerData();
        this.saveAppointmentData();
        this.saveServiceRequestData();
        this.saveCommunicationData();
        this.saveNotificationData();
    }
}

// Initialize customer portal system
window.customerPortalSystem = new CustomerPortalSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomerPortalSystem;
}
