/**
 * Settings and Configuration Manager
 * Handles all application settings, preferences, and configuration options
 */

class SettingsManager {
    constructor() {
        this.settings = {
            general: {
                theme: 'default',
                language: 'en',
                timezone: 'UTC',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12h',
                currency: 'USD',
                autoSave: true,
                autoBackup: true,
                compactMode: false
            },
            notifications: {
                enabled: true,
                sound: true,
                desktop: true,
                email: false,
                lowStockAlerts: true,
                overdueWorkOrders: true,
                systemUpdates: true,
                diagnosticAlerts: true,
                inventoryThreshold: 5
            },
            display: {
                showAnimations: true,
                highContrast: false,
                largeText: false,
                darkMode: false,
                gridDensity: 'comfortable',
                sidebarCollapsed: false,
                showTooltips: true,
                pageSize: 25
            },
            data: {
                cacheEnabled: true,
                cacheExpiry: 86400000, // 24 hours
                syncInterval: 300000, // 5 minutes
                compressionEnabled: true,
                localStorageLimit: 50, // MB
                exportFormat: 'json',
                importValidation: true
            },
            security: {
                sessionTimeout: 3600000, // 1 hour
                autoLock: true,
                lockTimeout: 900000, // 15 minutes
                requireAuth: false,
                twoFactorAuth: false,
                auditLog: true,
                encryptData: false
            },
            performance: {
                lazyLoading: true,
                virtualScrolling: true,
                debounceDelay: 300,
                batchSize: 100,
                maxCacheSize: 1000,
                prefetchData: true,
                optimizeImages: true
            },
            integrations: {
                obd2Scanner: {
                    enabled: false,
                    port: 'auto',
                    baudRate: 38400,
                    protocol: 'auto',
                    timeout: 5000
                },
                barcode: {
                    enabled: false,
                    format: 'code128',
                    printLabels: true,
                    autoGenerate: true
                },
                apis: {
                    vehicleData: {
                        enabled: false,
                        endpoint: '',
                        apiKey: '',
                        rateLimit: 1000
                    },
                    parts: {
                        enabled: false,
                        endpoint: '',
                        apiKey: '',
                        rateLimit: 500
                    }
                }
            }
        };
        
        this.initializeSettings();
        this.loadSettings();
        this.setupSettingsValidation();
    }

    initializeSettings() {
        // Apply initial settings
        this.applySettings();
        
        // Setup change listeners
        this.setupChangeListeners();
        
        // Check for system capabilities
        this.checkSystemCapabilities();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('repairbridge_settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                this.settings = this.mergeSettings(this.settings, parsed);
            } catch (error) {
                console.warn('Failed to parse saved settings:', error);
            }
        }
    }

    saveSettings() {
        localStorage.setItem('repairbridge_settings', JSON.stringify(this.settings));
        this.applySettings();
        
        // Notify other systems of settings change
        this.notifySettingsChanged();
    }

    mergeSettings(defaults, saved) {
        const merged = { ...defaults };
        
        for (const [category, settings] of Object.entries(saved)) {
            if (merged[category]) {
                merged[category] = { ...merged[category], ...settings };
            }
        }
        
        return merged;
    }

    applySettings() {
        // Apply theme
        this.applyTheme();
        
        // Apply display settings
        this.applyDisplaySettings();
        
        // Apply performance settings
        this.applyPerformanceSettings();
        
        // Apply notification settings
        this.applyNotificationSettings();
    }

    applyTheme() {
        const theme = this.settings.general.theme;
        const darkMode = this.settings.display.darkMode;
        
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-light', 'theme-high-contrast');
        
        if (darkMode) {
            document.body.classList.add('theme-dark');
        } else if (theme === 'high-contrast') {
            document.body.classList.add('theme-high-contrast');
        } else {
            document.body.classList.add('theme-default');
        }
        
        // Apply compact mode
        if (this.settings.general.compactMode) {
            document.body.classList.add('compact-mode');
        } else {
            document.body.classList.remove('compact-mode');
        }
    }

    applyDisplaySettings() {
        const { showAnimations, highContrast, largeText, gridDensity } = this.settings.display;
        
        // Animations
        if (!showAnimations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
        
        // High contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Large text
        if (largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
        
        // Grid density
        document.body.classList.remove('grid-compact', 'grid-comfortable', 'grid-spacious');
        document.body.classList.add(`grid-${gridDensity}`);
    }

    applyPerformanceSettings() {
        // Configure performance settings
        if (this.settings.performance.lazyLoading) {
            this.enableLazyLoading();
        }
        
        if (this.settings.performance.virtualScrolling) {
            this.enableVirtualScrolling();
        }
    }

    applyNotificationSettings() {
        if (window.notificationManager) {
            // Update notification manager settings
            window.notificationManager.settings = this.settings.notifications;
        }
    }

    renderSettingsInterface() {
        const settingsSection = document.getElementById('settings');
        if (!settingsSection) return;

        settingsSection.innerHTML = `
            <div class="settings-system">
                <div class="settings-header">
                    <h2><i class="fas fa-cog"></i> Settings</h2>
                    <div class="settings-actions">
                        <button class="export-settings-btn" onclick="settingsManager.exportSettings()">
                            <i class="fas fa-download"></i> Export Settings
                        </button>
                        <button class="import-settings-btn" onclick="settingsManager.importSettings()">
                            <i class="fas fa-upload"></i> Import Settings
                        </button>
                        <button class="reset-settings-btn" onclick="settingsManager.resetSettings()">
                            <i class="fas fa-undo"></i> Reset to Defaults
                        </button>
                    </div>
                </div>

                <div class="settings-content">
                    <div class="settings-sidebar">
                        <div class="settings-nav">
                            <button class="settings-nav-btn active" data-category="general">
                                <i class="fas fa-sliders-h"></i> General
                            </button>
                            <button class="settings-nav-btn" data-category="notifications">
                                <i class="fas fa-bell"></i> Notifications
                            </button>
                            <button class="settings-nav-btn" data-category="display">
                                <i class="fas fa-desktop"></i> Display
                            </button>
                            <button class="settings-nav-btn" data-category="data">
                                <i class="fas fa-database"></i> Data
                            </button>
                            <button class="settings-nav-btn" data-category="security">
                                <i class="fas fa-shield-alt"></i> Security
                            </button>
                            <button class="settings-nav-btn" data-category="performance">
                                <i class="fas fa-tachometer-alt"></i> Performance
                            </button>
                            <button class="settings-nav-btn" data-category="integrations">
                                <i class="fas fa-plug"></i> Integrations
                            </button>
                        </div>
                    </div>

                    <div class="settings-main">
                        <div id="settings-general" class="settings-panel active">
                            ${this.renderGeneralSettings()}
                        </div>
                        <div id="settings-notifications" class="settings-panel">
                            ${this.renderNotificationSettings()}
                        </div>
                        <div id="settings-display" class="settings-panel">
                            ${this.renderDisplaySettings()}
                        </div>
                        <div id="settings-data" class="settings-panel">
                            ${this.renderDataSettings()}
                        </div>
                        <div id="settings-security" class="settings-panel">
                            ${this.renderSecuritySettings()}
                        </div>
                        <div id="settings-performance" class="settings-panel">
                            ${this.renderPerformanceSettings()}
                        </div>
                        <div id="settings-integrations" class="settings-panel">
                            ${this.renderIntegrationSettings()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupSettingsNavigation();
        this.setupSettingsHandlers();
    }

    renderGeneralSettings() {
        return `
            <div class="settings-section">
                <h3>General Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>Theme</label>
                        <select id="theme-select">
                            <option value="default" ${this.settings.general.theme === 'default' ? 'selected' : ''}>Default</option>
                            <option value="dark" ${this.settings.general.theme === 'dark' ? 'selected' : ''}>Dark</option>
                            <option value="light" ${this.settings.general.theme === 'light' ? 'selected' : ''}>Light</option>
                            <option value="high-contrast" ${this.settings.general.theme === 'high-contrast' ? 'selected' : ''}>High Contrast</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>Language</label>
                        <select id="language-select">
                            <option value="en" ${this.settings.general.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="es" ${this.settings.general.language === 'es' ? 'selected' : ''}>Spanish</option>
                            <option value="fr" ${this.settings.general.language === 'fr' ? 'selected' : ''}>French</option>
                            <option value="de" ${this.settings.general.language === 'de' ? 'selected' : ''}>German</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>Timezone</label>
                        <select id="timezone-select">
                            <option value="UTC" ${this.settings.general.timezone === 'UTC' ? 'selected' : ''}>UTC</option>
                            <option value="America/New_York" ${this.settings.general.timezone === 'America/New_York' ? 'selected' : ''}>Eastern Time</option>
                            <option value="America/Chicago" ${this.settings.general.timezone === 'America/Chicago' ? 'selected' : ''}>Central Time</option>
                            <option value="America/Denver" ${this.settings.general.timezone === 'America/Denver' ? 'selected' : ''}>Mountain Time</option>
                            <option value="America/Los_Angeles" ${this.settings.general.timezone === 'America/Los_Angeles' ? 'selected' : ''}>Pacific Time</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>Date Format</label>
                        <select id="date-format-select">
                            <option value="MM/DD/YYYY" ${this.settings.general.dateFormat === 'MM/DD/YYYY' ? 'selected' : ''}>MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY" ${this.settings.general.dateFormat === 'DD/MM/YYYY' ? 'selected' : ''}>DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD" ${this.settings.general.dateFormat === 'YYYY-MM-DD' ? 'selected' : ''}>YYYY-MM-DD</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>Time Format</label>
                        <select id="time-format-select">
                            <option value="12h" ${this.settings.general.timeFormat === '12h' ? 'selected' : ''}>12 Hour</option>
                            <option value="24h" ${this.settings.general.timeFormat === '24h' ? 'selected' : ''}>24 Hour</option>
                        </select>
                    </div>

                    <div class="setting-item">
                        <label>Currency</label>
                        <select id="currency-select">
                            <option value="USD" ${this.settings.general.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                            <option value="EUR" ${this.settings.general.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
                            <option value="GBP" ${this.settings.general.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
                            <option value="CAD" ${this.settings.general.currency === 'CAD' ? 'selected' : ''}>CAD ($)</option>
                        </select>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="auto-save" ${this.settings.general.autoSave ? 'checked' : ''}>
                            <span>Auto Save</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="auto-backup" ${this.settings.general.autoBackup ? 'checked' : ''}>
                            <span>Auto Backup</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="compact-mode" ${this.settings.general.compactMode ? 'checked' : ''}>
                            <span>Compact Mode</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderNotificationSettings() {
        return `
            <div class="settings-section">
                <h3>Notification Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="notifications-enabled" ${this.settings.notifications.enabled ? 'checked' : ''}>
                            <span>Enable Notifications</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="notification-sound" ${this.settings.notifications.sound ? 'checked' : ''}>
                            <span>Sound Notifications</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="desktop-notifications" ${this.settings.notifications.desktop ? 'checked' : ''}>
                            <span>Desktop Notifications</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="email-notifications" ${this.settings.notifications.email ? 'checked' : ''}>
                            <span>Email Notifications</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="low-stock-alerts" ${this.settings.notifications.lowStockAlerts ? 'checked' : ''}>
                            <span>Low Stock Alerts</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="overdue-alerts" ${this.settings.notifications.overdueWorkOrders ? 'checked' : ''}>
                            <span>Overdue Work Order Alerts</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="system-updates" ${this.settings.notifications.systemUpdates ? 'checked' : ''}>
                            <span>System Update Notifications</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="diagnostic-alerts" ${this.settings.notifications.diagnosticAlerts ? 'checked' : ''}>
                            <span>Diagnostic Alerts</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Inventory Alert Threshold</label>
                        <input type="number" id="inventory-threshold" value="${this.settings.notifications.inventoryThreshold}" min="1" max="100">
                    </div>
                </div>
            </div>
        `;
    }

    renderDisplaySettings() {
        return `
            <div class="settings-section">
                <h3>Display Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="show-animations" ${this.settings.display.showAnimations ? 'checked' : ''}>
                            <span>Show Animations</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="high-contrast" ${this.settings.display.highContrast ? 'checked' : ''}>
                            <span>High Contrast Mode</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="large-text" ${this.settings.display.largeText ? 'checked' : ''}>
                            <span>Large Text</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="dark-mode" ${this.settings.display.darkMode ? 'checked' : ''}>
                            <span>Dark Mode</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Grid Density</label>
                        <select id="grid-density">
                            <option value="compact" ${this.settings.display.gridDensity === 'compact' ? 'selected' : ''}>Compact</option>
                            <option value="comfortable" ${this.settings.display.gridDensity === 'comfortable' ? 'selected' : ''}>Comfortable</option>
                            <option value="spacious" ${this.settings.display.gridDensity === 'spacious' ? 'selected' : ''}>Spacious</option>
                        </select>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="sidebar-collapsed" ${this.settings.display.sidebarCollapsed ? 'checked' : ''}>
                            <span>Collapsed Sidebar</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="show-tooltips" ${this.settings.display.showTooltips ? 'checked' : ''}>
                            <span>Show Tooltips</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Items Per Page</label>
                        <select id="page-size">
                            <option value="10" ${this.settings.display.pageSize === 10 ? 'selected' : ''}>10</option>
                            <option value="25" ${this.settings.display.pageSize === 25 ? 'selected' : ''}>25</option>
                            <option value="50" ${this.settings.display.pageSize === 50 ? 'selected' : ''}>50</option>
                            <option value="100" ${this.settings.display.pageSize === 100 ? 'selected' : ''}>100</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    renderDataSettings() {
        return `
            <div class="settings-section">
                <h3>Data Management</h3>
                <div class="settings-grid">
                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="cache-enabled" ${this.settings.data.cacheEnabled ? 'checked' : ''}>
                            <span>Enable Data Cache</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Cache Expiry (hours)</label>
                        <input type="number" id="cache-expiry" value="${this.settings.data.cacheExpiry / 3600000}" min="1" max="168">
                    </div>

                    <div class="setting-item">
                        <label>Sync Interval (minutes)</label>
                        <input type="number" id="sync-interval" value="${this.settings.data.syncInterval / 60000}" min="1" max="1440">
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="compression-enabled" ${this.settings.data.compressionEnabled ? 'checked' : ''}>
                            <span>Enable Data Compression</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Local Storage Limit (MB)</label>
                        <input type="number" id="storage-limit" value="${this.settings.data.localStorageLimit}" min="10" max="500">
                    </div>

                    <div class="setting-item">
                        <label>Default Export Format</label>
                        <select id="export-format">
                            <option value="json" ${this.settings.data.exportFormat === 'json' ? 'selected' : ''}>JSON</option>
                            <option value="csv" ${this.settings.data.exportFormat === 'csv' ? 'selected' : ''}>CSV</option>
                            <option value="xlsx" ${this.settings.data.exportFormat === 'xlsx' ? 'selected' : ''}>Excel</option>
                        </select>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="import-validation" ${this.settings.data.importValidation ? 'checked' : ''}>
                            <span>Validate Imported Data</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderSecuritySettings() {
        return `
            <div class="settings-section">
                <h3>Security Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label>Session Timeout (minutes)</label>
                        <input type="number" id="session-timeout" value="${this.settings.security.sessionTimeout / 60000}" min="15" max="480">
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="auto-lock" ${this.settings.security.autoLock ? 'checked' : ''}>
                            <span>Auto Lock Screen</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Lock Timeout (minutes)</label>
                        <input type="number" id="lock-timeout" value="${this.settings.security.lockTimeout / 60000}" min="5" max="120">
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="require-auth" ${this.settings.security.requireAuth ? 'checked' : ''}>
                            <span>Require Authentication</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="two-factor-auth" ${this.settings.security.twoFactorAuth ? 'checked' : ''}>
                            <span>Two-Factor Authentication</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="audit-log" ${this.settings.security.auditLog ? 'checked' : ''}>
                            <span>Enable Audit Log</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="encrypt-data" ${this.settings.security.encryptData ? 'checked' : ''}>
                            <span>Encrypt Local Data</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderPerformanceSettings() {
        return `
            <div class="settings-section">
                <h3>Performance Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="lazy-loading" ${this.settings.performance.lazyLoading ? 'checked' : ''}>
                            <span>Enable Lazy Loading</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="virtual-scrolling" ${this.settings.performance.virtualScrolling ? 'checked' : ''}>
                            <span>Virtual Scrolling</span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <label>Debounce Delay (ms)</label>
                        <input type="number" id="debounce-delay" value="${this.settings.performance.debounceDelay}" min="100" max="1000">
                    </div>

                    <div class="setting-item">
                        <label>Batch Size</label>
                        <input type="number" id="batch-size" value="${this.settings.performance.batchSize}" min="10" max="1000">
                    </div>

                    <div class="setting-item">
                        <label>Max Cache Size</label>
                        <input type="number" id="max-cache-size" value="${this.settings.performance.maxCacheSize}" min="100" max="10000">
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="prefetch-data" ${this.settings.performance.prefetchData ? 'checked' : ''}>
                            <span>Prefetch Data</span>
                        </label>
                    </div>

                    <div class="setting-item checkbox-item">
                        <label>
                            <input type="checkbox" id="optimize-images" ${this.settings.performance.optimizeImages ? 'checked' : ''}>
                            <span>Optimize Images</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    renderIntegrationSettings() {
        return `
            <div class="settings-section">
                <h3>Integration Settings</h3>
                
                <div class="integration-group">
                    <h4>OBD2 Scanner</h4>
                    <div class="settings-grid">
                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="obd2-enabled" ${this.settings.integrations.obd2Scanner.enabled ? 'checked' : ''}>
                                <span>Enable OBD2 Scanner</span>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label>Port</label>
                            <select id="obd2-port">
                                <option value="auto" ${this.settings.integrations.obd2Scanner.port === 'auto' ? 'selected' : ''}>Auto Detect</option>
                                <option value="COM1" ${this.settings.integrations.obd2Scanner.port === 'COM1' ? 'selected' : ''}>COM1</option>
                                <option value="COM2" ${this.settings.integrations.obd2Scanner.port === 'COM2' ? 'selected' : ''}>COM2</option>
                                <option value="COM3" ${this.settings.integrations.obd2Scanner.port === 'COM3' ? 'selected' : ''}>COM3</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label>Baud Rate</label>
                            <select id="obd2-baud">
                                <option value="9600" ${this.settings.integrations.obd2Scanner.baudRate === 9600 ? 'selected' : ''}>9600</option>
                                <option value="38400" ${this.settings.integrations.obd2Scanner.baudRate === 38400 ? 'selected' : ''}>38400</option>
                                <option value="115200" ${this.settings.integrations.obd2Scanner.baudRate === 115200 ? 'selected' : ''}>115200</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label>Timeout (ms)</label>
                            <input type="number" id="obd2-timeout" value="${this.settings.integrations.obd2Scanner.timeout}" min="1000" max="30000">
                        </div>
                    </div>
                </div>

                <div class="integration-group">
                    <h4>Barcode System</h4>
                    <div class="settings-grid">
                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="barcode-enabled" ${this.settings.integrations.barcode.enabled ? 'checked' : ''}>
                                <span>Enable Barcode System</span>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label>Barcode Format</label>
                            <select id="barcode-format">
                                <option value="code128" ${this.settings.integrations.barcode.format === 'code128' ? 'selected' : ''}>Code 128</option>
                                <option value="code39" ${this.settings.integrations.barcode.format === 'code39' ? 'selected' : ''}>Code 39</option>
                                <option value="qr" ${this.settings.integrations.barcode.format === 'qr' ? 'selected' : ''}>QR Code</option>
                            </select>
                        </div>

                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="print-labels" ${this.settings.integrations.barcode.printLabels ? 'checked' : ''}>
                                <span>Print Labels</span>
                            </label>
                        </div>

                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="auto-generate" ${this.settings.integrations.barcode.autoGenerate ? 'checked' : ''}>
                                <span>Auto Generate Codes</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="integration-group">
                    <h4>API Integrations</h4>
                    <div class="settings-grid">
                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="vehicle-api-enabled" ${this.settings.integrations.apis.vehicleData.enabled ? 'checked' : ''}>
                                <span>Vehicle Data API</span>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label>Vehicle API Endpoint</label>
                            <input type="text" id="vehicle-api-endpoint" value="${this.settings.integrations.apis.vehicleData.endpoint}" placeholder="https://api.example.com/vehicles">
                        </div>

                        <div class="setting-item">
                            <label>Vehicle API Key</label>
                            <input type="password" id="vehicle-api-key" value="${this.settings.integrations.apis.vehicleData.apiKey}" placeholder="Enter API key">
                        </div>

                        <div class="setting-item checkbox-item">
                            <label>
                                <input type="checkbox" id="parts-api-enabled" ${this.settings.integrations.apis.parts.enabled ? 'checked' : ''}>
                                <span>Parts API</span>
                            </label>
                        </div>

                        <div class="setting-item">
                            <label>Parts API Endpoint</label>
                            <input type="text" id="parts-api-endpoint" value="${this.settings.integrations.apis.parts.endpoint}" placeholder="https://api.example.com/parts">
                        </div>

                        <div class="setting-item">
                            <label>Parts API Key</label>
                            <input type="password" id="parts-api-key" value="${this.settings.integrations.apis.parts.apiKey}" placeholder="Enter API key">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupSettingsNavigation() {
        const navButtons = document.querySelectorAll('.settings-nav-btn');
        const panels = document.querySelectorAll('.settings-panel');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding panel
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `settings-${category}`) {
                        panel.classList.add('active');
                    }
                });
            });
        });
    }

    setupSettingsHandlers() {
        // Set up change handlers for all settings
        const settingsElements = document.querySelectorAll('#settings input, #settings select');
        
        settingsElements.forEach(element => {
            element.addEventListener('change', (e) => {
                this.handleSettingChange(e.target);
            });
        });
    }

    handleSettingChange(element) {
        const id = element.id;
        const value = element.type === 'checkbox' ? element.checked : element.value;
        
        // Update settings based on element ID
        switch (id) {
            // General settings
            case 'theme-select':
                this.settings.general.theme = value;
                break;
            case 'language-select':
                this.settings.general.language = value;
                break;
            case 'timezone-select':
                this.settings.general.timezone = value;
                break;
            case 'date-format-select':
                this.settings.general.dateFormat = value;
                break;
            case 'time-format-select':
                this.settings.general.timeFormat = value;
                break;
            case 'currency-select':
                this.settings.general.currency = value;
                break;
            case 'auto-save':
                this.settings.general.autoSave = value;
                break;
            case 'auto-backup':
                this.settings.general.autoBackup = value;
                break;
            case 'compact-mode':
                this.settings.general.compactMode = value;
                break;
            
            // Notification settings
            case 'notifications-enabled':
                this.settings.notifications.enabled = value;
                break;
            case 'notification-sound':
                this.settings.notifications.sound = value;
                break;
            case 'desktop-notifications':
                this.settings.notifications.desktop = value;
                break;
            case 'email-notifications':
                this.settings.notifications.email = value;
                break;
            case 'low-stock-alerts':
                this.settings.notifications.lowStockAlerts = value;
                break;
            case 'overdue-alerts':
                this.settings.notifications.overdueWorkOrders = value;
                break;
            case 'system-updates':
                this.settings.notifications.systemUpdates = value;
                break;
            case 'diagnostic-alerts':
                this.settings.notifications.diagnosticAlerts = value;
                break;
            case 'inventory-threshold':
                this.settings.notifications.inventoryThreshold = parseInt(value);
                break;
            
            // Display settings
            case 'show-animations':
                this.settings.display.showAnimations = value;
                break;
            case 'high-contrast':
                this.settings.display.highContrast = value;
                break;
            case 'large-text':
                this.settings.display.largeText = value;
                break;
            case 'dark-mode':
                this.settings.display.darkMode = value;
                break;
            case 'grid-density':
                this.settings.display.gridDensity = value;
                break;
            case 'sidebar-collapsed':
                this.settings.display.sidebarCollapsed = value;
                break;
            case 'show-tooltips':
                this.settings.display.showTooltips = value;
                break;
            case 'page-size':
                this.settings.display.pageSize = parseInt(value);
                break;
            
            // Add more cases for other settings categories...
        }
        
        // Save and apply settings
        this.saveSettings();
        
        // Show confirmation
        if (window.notificationManager) {
            window.notificationManager.showNotification('Settings updated successfully', 'success');
        }
    }

    exportSettings() {
        const settings = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([settings], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `repairbridge-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Settings exported successfully', 'success');
        }
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedSettings = JSON.parse(e.target.result);
                        this.settings = this.mergeSettings(this.settings, importedSettings);
                        this.saveSettings();
                        this.renderSettingsInterface();
                        
                        if (window.notificationManager) {
                            window.notificationManager.showNotification('Settings imported successfully', 'success');
                        }
                    } catch (error) {
                        if (window.notificationManager) {
                            window.notificationManager.showNotification('Failed to import settings: Invalid file format', 'error');
                        }
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to their default values?')) {
            // Clear saved settings
            localStorage.removeItem('repairbridge_settings');
            
            // Reset to defaults
            this.settings = {
                general: {
                    theme: 'default',
                    language: 'en',
                    timezone: 'UTC',
                    dateFormat: 'MM/DD/YYYY',
                    timeFormat: '12h',
                    currency: 'USD',
                    autoSave: true,
                    autoBackup: true,
                    compactMode: false
                },
                notifications: {
                    enabled: true,
                    sound: true,
                    desktop: true,
                    email: false,
                    lowStockAlerts: true,
                    overdueWorkOrders: true,
                    systemUpdates: true,
                    diagnosticAlerts: true,
                    inventoryThreshold: 5
                },
                display: {
                    showAnimations: true,
                    highContrast: false,
                    largeText: false,
                    darkMode: false,
                    gridDensity: 'comfortable',
                    sidebarCollapsed: false,
                    showTooltips: true,
                    pageSize: 25
                },
                data: {
                    cacheEnabled: true,
                    cacheExpiry: 86400000,
                    syncInterval: 300000,
                    compressionEnabled: true,
                    localStorageLimit: 50,
                    exportFormat: 'json',
                    importValidation: true
                },
                security: {
                    sessionTimeout: 3600000,
                    autoLock: true,
                    lockTimeout: 900000,
                    requireAuth: false,
                    twoFactorAuth: false,
                    auditLog: true,
                    encryptData: false
                },
                performance: {
                    lazyLoading: true,
                    virtualScrolling: true,
                    debounceDelay: 300,
                    batchSize: 100,
                    maxCacheSize: 1000,
                    prefetchData: true,
                    optimizeImages: true
                },
                integrations: {
                    obd2Scanner: {
                        enabled: false,
                        port: 'auto',
                        baudRate: 38400,
                        protocol: 'auto',
                        timeout: 5000
                    },
                    barcode: {
                        enabled: false,
                        format: 'code128',
                        printLabels: true,
                        autoGenerate: true
                    },
                    apis: {
                        vehicleData: {
                            enabled: false,
                            endpoint: '',
                            apiKey: '',
                            rateLimit: 1000
                        },
                        parts: {
                            enabled: false,
                            endpoint: '',
                            apiKey: '',
                            rateLimit: 500
                        }
                    }
                }
            };
            
            this.saveSettings();
            this.renderSettingsInterface();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification('Settings reset to defaults', 'info');
            }
        }
    }

    setupSettingsValidation() {
        // Add validation rules for settings
        this.validationRules = {
            'inventory-threshold': (value) => value >= 1 && value <= 100,
            'session-timeout': (value) => value >= 15 && value <= 480,
            'lock-timeout': (value) => value >= 5 && value <= 120,
            'cache-expiry': (value) => value >= 1 && value <= 168,
            'sync-interval': (value) => value >= 1 && value <= 1440,
            'storage-limit': (value) => value >= 10 && value <= 500,
            'debounce-delay': (value) => value >= 100 && value <= 1000,
            'batch-size': (value) => value >= 10 && value <= 1000,
            'max-cache-size': (value) => value >= 100 && value <= 10000,
            'obd2-timeout': (value) => value >= 1000 && value <= 30000
        };
    }

    validateSetting(id, value) {
        const rule = this.validationRules[id];
        if (rule) {
            return rule(value);
        }
        return true;
    }

    setupChangeListeners() {
        // Listen for settings changes to update UI
        document.addEventListener('settingsChanged', (e) => {
            this.handleSettingsChange(e.detail);
        });
    }

    checkSystemCapabilities() {
        // Check for various system capabilities
        this.capabilities = {
            notifications: 'Notification' in window,
            localStorage: 'localStorage' in window,
            webgl: this.checkWebGLSupport(),
            webworkers: 'Worker' in window,
            indexeddb: 'indexedDB' in window,
            geolocation: 'geolocation' in navigator,
            camera: 'mediaDevices' in navigator,
            bluetooth: 'bluetooth' in navigator
        };
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    notifySettingsChanged() {
        const event = new CustomEvent('settingsChanged', {
            detail: { settings: this.settings }
        });
        document.dispatchEvent(event);
    }

    enableLazyLoading() {
        // Implement lazy loading for images and components
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    enableVirtualScrolling() {
        // Implement virtual scrolling for large lists
        const lists = document.querySelectorAll('.virtual-scroll');
        lists.forEach(list => {
            this.setupVirtualScroll(list);
        });
    }

    setupVirtualScroll(container) {
        // Virtual scrolling implementation
        const itemHeight = 50; // Adjust based on your item height
        const visibleItems = Math.ceil(container.clientHeight / itemHeight);
        const buffer = 5;
        
        let startIndex = 0;
        let endIndex = visibleItems + buffer;
        
        container.addEventListener('scroll', () => {
            const scrollTop = container.scrollTop;
            const newStartIndex = Math.floor(scrollTop / itemHeight);
            const newEndIndex = Math.min(newStartIndex + visibleItems + buffer, this.totalItems);
            
            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                this.renderVirtualItems(container, startIndex, endIndex);
            }
        });
    }

    renderVirtualItems(container, startIndex, endIndex) {
        // Render only visible items
        const items = this.getItemsInRange(startIndex, endIndex);
        container.innerHTML = items.map(item => this.renderItem(item)).join('');
    }

    getSetting(category, key) {
        return this.settings[category] && this.settings[category][key];
    }

    setSetting(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        this.saveSettings();
    }
}

// Initialize settings manager
window.settingsManager = new SettingsManager();
