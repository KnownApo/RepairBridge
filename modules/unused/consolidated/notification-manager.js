/**
 * Notification System
 * Handles all system notifications and alerts
 */

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.alertSubscriptions = [];
        this.systemAlerts = [];
        
        this.initializeNotificationSystem();
        this.setupSystemMonitoring();
    }

    initializeNotificationSystem() {
        // Create notification container
        this.createNotificationContainer();
        
        // Load existing notifications
        const savedNotifications = localStorage.getItem('repairbridge_notifications');
        if (savedNotifications) {
            this.notifications = JSON.parse(savedNotifications);
        }

        // Setup alert subscriptions
        this.setupDefaultSubscriptions();
    }

    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    setupDefaultSubscriptions() {
        // Subscribe to various system events
        this.alertSubscriptions = [
            {
                type: 'inventory',
                event: 'low_stock',
                enabled: true,
                threshold: 5
            },
            {
                type: 'workorder',
                event: 'overdue',
                enabled: true,
                threshold: 1
            },
            {
                type: 'diagnostic',
                event: 'error',
                enabled: true,
                threshold: 1
            },
            {
                type: 'system',
                event: 'update',
                enabled: true,
                threshold: 1
            }
        ];
    }

    setupSystemMonitoring() {
        // Monitor system for various conditions
        setInterval(() => {
            this.checkInventoryAlerts();
            this.checkWorkOrderAlerts();
            this.checkSystemAlerts();
        }, 60000); // Check every minute

        // Monitor for immediate alerts
        setInterval(() => {
            this.checkCriticalAlerts();
        }, 10000); // Check every 10 seconds
    }

    showNotification(message, type = 'info', options = {}) {
        const notification = {
            id: this.generateNotificationId(),
            message: message,
            type: type,
            timestamp: new Date().toISOString(),
            read: false,
            persistent: options.persistent || false,
            actions: options.actions || [],
            duration: options.duration || 5000
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.renderNotification(notification);

        // Auto-remove if not persistent
        if (!notification.persistent) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, notification.duration);
        }

        return notification.id;
    }

    renderNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notificationElement = document.createElement('div');
        notificationElement.id = `notification-${notification.id}`;
        notificationElement.className = `notification ${notification.type}`;
        notificationElement.style.cssText = `
            background: ${this.getNotificationColor(notification.type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            margin-bottom: 12px;
            animation: slideInRight 0.3s ease-out;
            border: 1px solid rgba(255, 255, 255, 0.2);
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        notificationElement.innerHTML = `
            <div class="notification-content" style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${this.getNotificationIcon(notification.type)}" style="font-size: 1.2rem;"></i>
                <div style="flex: 1;">
                    <div class="notification-message" style="font-weight: 500; margin-bottom: 4px;">
                        ${notification.message}
                    </div>
                    <div class="notification-time" style="font-size: 0.8rem; opacity: 0.8;">
                        ${this.formatTime(notification.timestamp)}
                    </div>
                </div>
                <button class="notification-close" style="background: none; border: none; color: white; font-size: 1rem; cursor: pointer; padding: 4px;" onclick="notificationManager.removeNotification('${notification.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${notification.actions.length > 0 ? `
                <div class="notification-actions" style="margin-top: 12px; display: flex; gap: 8px;">
                    ${notification.actions.map(action => `
                        <button class="notification-action-btn" style="background: rgba(255, 255, 255, 0.2); border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.9rem;" onclick="${action.callback}">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        // Add hover effects
        notificationElement.addEventListener('mouseenter', () => {
            notificationElement.style.transform = 'translateX(-4px)';
            notificationElement.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
        });

        notificationElement.addEventListener('mouseleave', () => {
            notificationElement.style.transform = 'translateX(0)';
            notificationElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        });

        container.appendChild(notificationElement);
    }

    removeNotification(id) {
        const element = document.getElementById(`notification-${id}`);
        if (element) {
            element.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => {
                element.remove();
            }, 300);
        }

        // Remove from notifications array
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveNotifications();
    }

    clearAllNotifications() {
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
        this.notifications = [];
        this.saveNotifications();
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // System monitoring methods
    checkInventoryAlerts() {
        if (!window.inventoryManager) return;

        const lowStockItems = window.inventoryManager.getLowStockItems();
        
        if (lowStockItems.length > 0) {
            const subscription = this.alertSubscriptions.find(s => s.type === 'inventory' && s.event === 'low_stock');
            if (subscription && subscription.enabled && lowStockItems.length >= subscription.threshold) {
                this.showNotification(
                    `${lowStockItems.length} items are running low on stock`,
                    'warning',
                    {
                        persistent: true,
                        actions: [
                            {
                                label: 'View Items',
                                callback: 'notificationManager.viewLowStockItems()'
                            },
                            {
                                label: 'Generate Report',
                                callback: 'notificationManager.generateStockReport()'
                            }
                        ]
                    }
                );
            }
        }
    }

    checkWorkOrderAlerts() {
        if (!window.workOrderManager) return;

        const overdueOrders = window.workOrderManager.workOrders.filter(wo => {
            const dueDate = new Date(wo.dueDate);
            const today = new Date();
            return dueDate < today && wo.status !== 'Completed';
        });

        if (overdueOrders.length > 0) {
            const subscription = this.alertSubscriptions.find(s => s.type === 'workorder' && s.event === 'overdue');
            if (subscription && subscription.enabled) {
                this.showNotification(
                    `${overdueOrders.length} work orders are overdue`,
                    'error',
                    {
                        persistent: true,
                        actions: [
                            {
                                label: 'View Orders',
                                callback: 'notificationManager.viewOverdueOrders()'
                            }
                        ]
                    }
                );
            }
        }
    }

    checkSystemAlerts() {
        // Check for system updates, maintenance, etc.
        const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
        const now = new Date();
        
        if (!lastUpdateCheck || (now - new Date(lastUpdateCheck)) > 86400000) { // 24 hours
            this.showNotification(
                'System update available',
                'info',
                {
                    actions: [
                        {
                            label: 'Update Now',
                            callback: 'notificationManager.updateSystem()'
                        },
                        {
                            label: 'Remind Later',
                            callback: 'notificationManager.remindLater()'
                        }
                    ]
                }
            );
            localStorage.setItem('lastUpdateCheck', now.toISOString());
        }
    }

    checkCriticalAlerts() {
        // Check for critical system conditions
        const memoryUsage = this.estimateMemoryUsage();
        if (memoryUsage > 0.8) {
            this.showNotification(
                'High memory usage detected. Performance may be affected.',
                'warning',
                {
                    actions: [
                        {
                            label: 'Optimize',
                            callback: 'notificationManager.optimizeSystem()'
                        }
                    ]
                }
            );
        }
    }

    // Action handlers
    viewLowStockItems() {
        document.querySelector('[data-section="inventory"]').click();
        setTimeout(() => {
            if (window.inventoryManager) {
                document.getElementById('stockFilter').value = 'low';
                window.inventoryManager.applyFilters();
            }
        }, 500);
        this.showNotification('Filtered to show low stock items', 'info');
    }

    generateStockReport() {
        if (window.inventoryManager) {
            window.inventoryManager.generateLowStockReport();
        }
    }

    viewOverdueOrders() {
        // Navigate to work orders and filter overdue
        this.showNotification('Showing overdue work orders', 'info');
    }

    updateSystem() {
        this.showNotification('System update initiated...', 'info');
        // Simulate update process
        setTimeout(() => {
            this.showNotification('System updated successfully!', 'success');
        }, 3000);
    }

    remindLater() {
        // Set reminder for later
        const reminderTime = new Date();
        reminderTime.setHours(reminderTime.getHours() + 4);
        localStorage.setItem('updateReminder', reminderTime.toISOString());
        this.showNotification('Will remind you about the update in 4 hours', 'info');
    }

    optimizeSystem() {
        this.showNotification('Optimizing system performance...', 'info');
        // Simulate optimization
        setTimeout(() => {
            this.showNotification('System optimization completed', 'success');
        }, 2000);
    }

    // Utility methods
    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'rgba(34, 197, 94, 0.9)',
            error: 'rgba(239, 68, 68, 0.9)',
            warning: 'rgba(245, 158, 11, 0.9)',
            info: 'rgba(79, 172, 254, 0.9)'
        };
        return colors[type] || 'rgba(107, 114, 128, 0.9)';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    }

    estimateMemoryUsage() {
        // Rough estimate based on localStorage usage
        const totalStorage = JSON.stringify(localStorage).length;
        const maxStorage = 5 * 1024 * 1024; // 5MB rough estimate
        return Math.min(totalStorage / maxStorage, 1);
    }

    renderNotificationCenter() {
        const notificationSection = document.getElementById('notifications');
        if (!notificationSection) return;

        const recentNotifications = this.notifications.slice(0, 20);
        const unreadCount = this.getUnreadCount();

        notificationSection.innerHTML = `
            <div class="notification-center">
                <div class="notification-header">
                    <h2><i class="fas fa-bell"></i> Notifications</h2>
                    <div class="notification-actions">
                        <span class="unread-count">${unreadCount} unread</span>
                        <button class="mark-all-read-btn" onclick="notificationManager.markAllAsRead()">
                            <i class="fas fa-check-double"></i> Mark All Read
                        </button>
                        <button class="clear-all-btn" onclick="notificationManager.clearAllNotifications()">
                            <i class="fas fa-trash"></i> Clear All
                        </button>
                    </div>
                </div>

                <div class="notification-list">
                    ${recentNotifications.length > 0 ? recentNotifications.map(notification => `
                        <div class="notification-item ${notification.read ? 'read' : 'unread'}" onclick="notificationManager.markAsRead('${notification.id}')">
                            <div class="notification-icon ${notification.type}">
                                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                            </div>
                            <div class="notification-content">
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                            </div>
                            <button class="notification-remove" onclick="event.stopPropagation(); notificationManager.removeNotification('${notification.id}')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('') : `
                        <div class="no-notifications">
                            <i class="fas fa-bell-slash"></i>
                            <h3>No notifications</h3>
                            <p>You're all caught up!</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.renderNotificationCenter();
        this.showNotification('All notifications marked as read', 'success');
    }

    saveNotifications() {
        localStorage.setItem('repairbridge_notifications', JSON.stringify(this.notifications));
    }

    // Integration with existing app notification system
    integrateWithApp() {
        if (window.app) {
            window.app.showNotification = (message, type, options) => {
                return this.showNotification(message, type, options);
            };
        }
    }
}

// Add CSS animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-center {
        padding: 20px;
        color: white;
    }
    
    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .notification-header h2 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-actions {
        display: flex;
        gap: 12px;
        align-items: center;
    }
    
    .unread-count {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .mark-all-read-btn,
    .clear-all-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .mark-all-read-btn:hover,
    .clear-all-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .notification-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .notification-item {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .notification-item:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-2px);
    }
    
    .notification-item.unread {
        border-left: 4px solid #4facfe;
    }
    
    .notification-item.read {
        opacity: 0.7;
    }
    
    .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .notification-icon.success {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
    }
    
    .notification-icon.error {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    
    .notification-icon.warning {
        background: rgba(245, 158, 11, 0.2);
        color: #f59e0b;
    }
    
    .notification-icon.info {
        background: rgba(79, 172, 254, 0.2);
        color: #4facfe;
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-message {
        font-weight: 500;
        margin-bottom: 4px;
    }
    
    .notification-time {
        font-size: 0.8rem;
        opacity: 0.7;
    }
    
    .notification-remove {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .notification-remove:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
    }
    
    .no-notifications {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.6);
    }
    
    .no-notifications i {
        font-size: 3rem;
        margin-bottom: 16px;
        opacity: 0.5;
    }
    
    .no-notifications h3 {
        margin: 0 0 8px 0;
        font-weight: 600;
    }
    
    .no-notifications p {
        margin: 0;
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize notification manager
window.notificationManager = new NotificationManager();

// Integrate with existing app
window.notificationManager.integrateWithApp();

// Set up global app object if it doesn't exist
if (!window.app) {
    window.app = {
        showNotification: (message, type, options) => {
            return window.notificationManager.showNotification(message, type, options);
        }
    };
}
