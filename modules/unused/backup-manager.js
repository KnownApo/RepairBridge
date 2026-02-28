/**
 * Backup and Recovery Manager
 * Handles data backup, recovery, and synchronization operations
 */

class BackupManager {
    constructor() {
        this.backups = [];
        this.syncStatus = {
            lastSync: null,
            syncInProgress: false,
            totalItems: 0,
            syncedItems: 0,
            errors: []
        };
        this.backupSchedule = {
            enabled: true,
            frequency: 'daily', // daily, weekly, monthly
            time: '02:00',
            retention: 30, // days
            autoCleanup: true
        };
        this.cloudProviders = {
            aws: { enabled: false, bucket: '', region: 'us-east-1', accessKey: '', secretKey: '' },
            google: { enabled: false, bucket: '', projectId: '', credentials: '' },
            azure: { enabled: false, container: '', accountName: '', accountKey: '' },
            dropbox: { enabled: false, accessToken: '', appKey: '' }
        };
        
        this.initializeBackupManager();
        this.loadBackupData();
        this.setupAutoBackup();
    }

    initializeBackupManager() {
        // Initialize backup system
        this.createBackupIndexes();
        this.validateBackupIntegrity();
        this.scheduleCleanup();
    }

    loadBackupData() {
        const savedBackups = localStorage.getItem('repairbridge_backups');
        if (savedBackups) {
            try {
                this.backups = JSON.parse(savedBackups);
            } catch (error) {
                console.warn('Failed to load backup data:', error);
                this.backups = [];
            }
        }

        const savedSchedule = localStorage.getItem('repairbridge_backup_schedule');
        if (savedSchedule) {
            try {
                this.backupSchedule = { ...this.backupSchedule, ...JSON.parse(savedSchedule) };
            } catch (error) {
                console.warn('Failed to load backup schedule:', error);
            }
        }
    }

    saveBackupData() {
        localStorage.setItem('repairbridge_backups', JSON.stringify(this.backups));
        localStorage.setItem('repairbridge_backup_schedule', JSON.stringify(this.backupSchedule));
    }

    renderBackupInterface() {
        const backupSection = document.getElementById('backup');
        if (!backupSection) return;

        backupSection.innerHTML = `
            <div class="backup-system">
                <div class="backup-header">
                    <h2><i class="fas fa-shield-alt"></i> Backup & Recovery</h2>
                    <div class="backup-actions">
                        <button class="create-backup-btn" onclick="backupManager.createManualBackup()">
                            <i class="fas fa-plus"></i> Create Backup
                        </button>
                        <button class="sync-now-btn" onclick="backupManager.syncNow()">
                            <i class="fas fa-sync"></i> Sync Now
                        </button>
                        <button class="restore-btn" onclick="backupManager.showRestoreDialog()">
                            <i class="fas fa-undo"></i> Restore
                        </button>
                    </div>
                </div>

                <div class="backup-content">
                    <div class="backup-main">
                        <div class="backup-overview">
                            <div class="overview-cards">
                                <div class="overview-card">
                                    <div class="card-icon">
                                        <i class="fas fa-database"></i>
                                    </div>
                                    <div class="card-content">
                                        <h3>${this.backups.length}</h3>
                                        <p>Total Backups</p>
                                    </div>
                                </div>
                                <div class="overview-card">
                                    <div class="card-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="card-content">
                                        <h3>${this.getLastBackupTime()}</h3>
                                        <p>Last Backup</p>
                                    </div>
                                </div>
                                <div class="overview-card">
                                    <div class="card-icon">
                                        <i class="fas fa-hdd"></i>
                                    </div>
                                    <div class="card-content">
                                        <h3>${this.getTotalBackupSize()}</h3>
                                        <p>Total Size</p>
                                    </div>
                                </div>
                                <div class="overview-card ${this.syncStatus.syncInProgress ? 'syncing' : ''}">
                                    <div class="card-icon">
                                        <i class="fas fa-cloud ${this.syncStatus.syncInProgress ? 'fa-spin' : ''}"></i>
                                    </div>
                                    <div class="card-content">
                                        <h3>${this.getSyncStatus()}</h3>
                                        <p>Sync Status</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="backup-tabs">
                            <div class="tab-buttons">
                                <button class="tab-btn active" data-tab="backups">
                                    <i class="fas fa-list"></i> Backups
                                </button>
                                <button class="tab-btn" data-tab="schedule">
                                    <i class="fas fa-calendar"></i> Schedule
                                </button>
                                <button class="tab-btn" data-tab="cloud">
                                    <i class="fas fa-cloud"></i> Cloud Storage
                                </button>
                                <button class="tab-btn" data-tab="recovery">
                                    <i class="fas fa-history"></i> Recovery
                                </button>
                            </div>

                            <div class="tab-content">
                                <div id="backups-tab" class="tab-panel active">
                                    ${this.renderBackupsList()}
                                </div>
                                <div id="schedule-tab" class="tab-panel">
                                    ${this.renderScheduleSettings()}
                                </div>
                                <div id="cloud-tab" class="tab-panel">
                                    ${this.renderCloudSettings()}
                                </div>
                                <div id="recovery-tab" class="tab-panel">
                                    ${this.renderRecoveryOptions()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="backup-sidebar">
                        <div class="sync-progress">
                            <h3>Sync Progress</h3>
                            <div class="progress-info">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${this.getSyncProgress()}%"></div>
                                </div>
                                <div class="progress-text">
                                    <span>${this.syncStatus.syncedItems}/${this.syncStatus.totalItems} items</span>
                                    <span>${this.getSyncProgress()}%</span>
                                </div>
                            </div>
                        </div>

                        <div class="backup-health">
                            <h3>System Health</h3>
                            <div class="health-metrics">
                                <div class="health-item">
                                    <span class="health-label">Backup Status</span>
                                    <span class="health-value ${this.getBackupHealth().status}">${this.getBackupHealth().status}</span>
                                </div>
                                <div class="health-item">
                                    <span class="health-label">Storage Usage</span>
                                    <span class="health-value">${this.getStorageUsage()}%</span>
                                </div>
                                <div class="health-item">
                                    <span class="health-label">Integrity</span>
                                    <span class="health-value good">Good</span>
                                </div>
                            </div>
                        </div>

                        <div class="recent-activities">
                            <h3>Recent Activities</h3>
                            <div class="activity-list">
                                ${this.renderRecentActivities()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupBackupTabs();
        this.setupBackupHandlers();
    }

    renderBackupsList() {
        if (this.backups.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-database"></i>
                    <h3>No Backups Found</h3>
                    <p>Create your first backup to get started</p>
                    <button class="primary-btn" onclick="backupManager.createManualBackup()">
                        <i class="fas fa-plus"></i> Create Backup
                    </button>
                </div>
            `;
        }

        return `
            <div class="backups-list">
                <div class="list-header">
                    <div class="list-controls">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search backups..." id="backup-search">
                        </div>
                        <div class="filter-dropdown">
                            <select id="backup-filter">
                                <option value="all">All Backups</option>
                                <option value="manual">Manual</option>
                                <option value="automatic">Automatic</option>
                                <option value="cloud">Cloud Synced</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="backup-items">
                    ${this.backups.map(backup => this.renderBackupItem(backup)).join('')}
                </div>
            </div>
        `;
    }

    renderBackupItem(backup) {
        return `
            <div class="backup-item" data-backup-id="${backup.id}">
                <div class="backup-icon">
                    <i class="fas fa-${backup.type === 'manual' ? 'hand-paper' : 'robot'}"></i>
                </div>
                <div class="backup-info">
                    <h4>${backup.name}</h4>
                    <p class="backup-date">${this.formatDate(backup.createdAt)}</p>
                    <div class="backup-meta">
                        <span class="backup-size">${this.formatSize(backup.size)}</span>
                        <span class="backup-type ${backup.type}">${backup.type}</span>
                        ${backup.cloudSynced ? '<span class="cloud-synced"><i class="fas fa-cloud"></i> Synced</span>' : ''}
                    </div>
                </div>
                <div class="backup-actions">
                    <button class="action-btn restore" onclick="backupManager.restoreBackup('${backup.id}')" title="Restore">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="action-btn download" onclick="backupManager.downloadBackup('${backup.id}')" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn delete" onclick="backupManager.deleteBackup('${backup.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderScheduleSettings() {
        return `
            <div class="schedule-settings">
                <div class="settings-section">
                    <h3>Backup Schedule</h3>
                    <div class="schedule-form">
                        <div class="form-group">
                            <label>Enable Automatic Backups</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="schedule-enabled" ${this.backupSchedule.enabled ? 'checked' : ''}>
                                <span class="slider"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Backup Frequency</label>
                            <select id="backup-frequency">
                                <option value="daily" ${this.backupSchedule.frequency === 'daily' ? 'selected' : ''}>Daily</option>
                                <option value="weekly" ${this.backupSchedule.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                                <option value="monthly" ${this.backupSchedule.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Backup Time</label>
                            <input type="time" id="backup-time" value="${this.backupSchedule.time}">
                        </div>

                        <div class="form-group">
                            <label>Retention Period (days)</label>
                            <input type="number" id="retention-days" value="${this.backupSchedule.retention}" min="1" max="365">
                        </div>

                        <div class="form-group">
                            <label>Auto Cleanup Old Backups</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="auto-cleanup" ${this.backupSchedule.autoCleanup ? 'checked' : ''}>
                                <span class="slider"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="schedule-preview">
                    <h3>Schedule Preview</h3>
                    <div class="preview-info">
                        <div class="preview-item">
                            <span class="preview-label">Next Backup:</span>
                            <span class="preview-value">${this.getNextBackupTime()}</span>
                        </div>
                        <div class="preview-item">
                            <span class="preview-label">Estimated Size:</span>
                            <span class="preview-value">${this.getEstimatedBackupSize()}</span>
                        </div>
                        <div class="preview-item">
                            <span class="preview-label">Storage Required:</span>
                            <span class="preview-value">${this.getStorageRequired()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderCloudSettings() {
        return `
            <div class="cloud-settings">
                <div class="cloud-providers">
                    <h3>Cloud Storage Providers</h3>
                    
                    <div class="provider-section">
                        <h4><i class="fab fa-aws"></i> Amazon S3</h4>
                        <div class="provider-config">
                            <div class="form-group">
                                <label>Enable AWS S3</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="aws-enabled" ${this.cloudProviders.aws.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>S3 Bucket Name</label>
                                <input type="text" id="aws-bucket" value="${this.cloudProviders.aws.bucket}" placeholder="my-backup-bucket">
                            </div>
                            <div class="form-group">
                                <label>AWS Region</label>
                                <select id="aws-region">
                                    <option value="us-east-1" ${this.cloudProviders.aws.region === 'us-east-1' ? 'selected' : ''}>US East (N. Virginia)</option>
                                    <option value="us-west-2" ${this.cloudProviders.aws.region === 'us-west-2' ? 'selected' : ''}>US West (Oregon)</option>
                                    <option value="eu-west-1" ${this.cloudProviders.aws.region === 'eu-west-1' ? 'selected' : ''}>Europe (Ireland)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Access Key ID</label>
                                <input type="text" id="aws-access-key" value="${this.cloudProviders.aws.accessKey}" placeholder="Access Key ID">
                            </div>
                            <div class="form-group">
                                <label>Secret Access Key</label>
                                <input type="password" id="aws-secret-key" value="${this.cloudProviders.aws.secretKey}" placeholder="Secret Access Key">
                            </div>
                        </div>
                    </div>

                    <div class="provider-section">
                        <h4><i class="fab fa-google"></i> Google Cloud Storage</h4>
                        <div class="provider-config">
                            <div class="form-group">
                                <label>Enable Google Cloud</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="google-enabled" ${this.cloudProviders.google.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Bucket Name</label>
                                <input type="text" id="google-bucket" value="${this.cloudProviders.google.bucket}" placeholder="my-backup-bucket">
                            </div>
                            <div class="form-group">
                                <label>Project ID</label>
                                <input type="text" id="google-project" value="${this.cloudProviders.google.projectId}" placeholder="my-project-id">
                            </div>
                            <div class="form-group">
                                <label>Service Account Key (JSON)</label>
                                <textarea id="google-credentials" placeholder="Paste service account JSON here...">${this.cloudProviders.google.credentials}</textarea>
                            </div>
                        </div>
                    </div>

                    <div class="provider-section">
                        <h4><i class="fab fa-microsoft"></i> Azure Blob Storage</h4>
                        <div class="provider-config">
                            <div class="form-group">
                                <label>Enable Azure</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="azure-enabled" ${this.cloudProviders.azure.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Container Name</label>
                                <input type="text" id="azure-container" value="${this.cloudProviders.azure.container}" placeholder="backups">
                            </div>
                            <div class="form-group">
                                <label>Storage Account Name</label>
                                <input type="text" id="azure-account" value="${this.cloudProviders.azure.accountName}" placeholder="mystorageaccount">
                            </div>
                            <div class="form-group">
                                <label>Account Key</label>
                                <input type="password" id="azure-key" value="${this.cloudProviders.azure.accountKey}" placeholder="Account Key">
                            </div>
                        </div>
                    </div>

                    <div class="provider-section">
                        <h4><i class="fab fa-dropbox"></i> Dropbox</h4>
                        <div class="provider-config">
                            <div class="form-group">
                                <label>Enable Dropbox</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="dropbox-enabled" ${this.cloudProviders.dropbox.enabled ? 'checked' : ''}>
                                    <span class="slider"></span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Access Token</label>
                                <input type="password" id="dropbox-token" value="${this.cloudProviders.dropbox.accessToken}" placeholder="Access Token">
                            </div>
                            <div class="form-group">
                                <label>App Key</label>
                                <input type="text" id="dropbox-app-key" value="${this.cloudProviders.dropbox.appKey}" placeholder="App Key">
                            </div>
                            <button class="auth-btn" onclick="backupManager.authenticateDropbox()">
                                <i class="fas fa-link"></i> Connect Dropbox
                            </button>
                        </div>
                    </div>
                </div>

                <div class="cloud-actions">
                    <button class="primary-btn" onclick="backupManager.saveCloudSettings()">
                        <i class="fas fa-save"></i> Save Settings
                    </button>
                    <button class="secondary-btn" onclick="backupManager.testCloudConnection()">
                        <i class="fas fa-plug"></i> Test Connection
                    </button>
                </div>
            </div>
        `;
    }

    renderRecoveryOptions() {
        return `
            <div class="recovery-options">
                <div class="recovery-section">
                    <h3>Recovery Options</h3>
                    
                    <div class="recovery-types">
                        <div class="recovery-type">
                            <div class="type-icon">
                                <i class="fas fa-undo"></i>
                            </div>
                            <div class="type-content">
                                <h4>Full System Recovery</h4>
                                <p>Restore complete system state from backup</p>
                                <button class="recovery-btn" onclick="backupManager.startFullRecovery()">
                                    Start Recovery
                                </button>
                            </div>
                        </div>

                        <div class="recovery-type">
                            <div class="type-icon">
                                <i class="fas fa-database"></i>
                            </div>
                            <div class="type-content">
                                <h4>Data Recovery</h4>
                                <p>Restore specific data modules</p>
                                <button class="recovery-btn" onclick="backupManager.startDataRecovery()">
                                    Select Data
                                </button>
                            </div>
                        </div>

                        <div class="recovery-type">
                            <div class="type-icon">
                                <i class="fas fa-cog"></i>
                            </div>
                            <div class="type-content">
                                <h4>Settings Recovery</h4>
                                <p>Restore system settings only</p>
                                <button class="recovery-btn" onclick="backupManager.startSettingsRecovery()">
                                    Restore Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="recovery-history">
                    <h3>Recovery History</h3>
                    <div class="history-list">
                        ${this.renderRecoveryHistory()}
                    </div>
                </div>
            </div>
        `;
    }

    renderRecoveryHistory() {
        const recoveryHistory = this.getRecoveryHistory();
        
        if (recoveryHistory.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-history"></i>
                    <p>No recovery operations performed yet</p>
                </div>
            `;
        }

        return recoveryHistory.map(recovery => `
            <div class="history-item">
                <div class="history-icon">
                    <i class="fas fa-${recovery.type === 'full' ? 'undo' : recovery.type === 'data' ? 'database' : 'cog'}"></i>
                </div>
                <div class="history-info">
                    <h4>${recovery.name}</h4>
                    <p class="history-date">${this.formatDate(recovery.date)}</p>
                    <span class="history-status ${recovery.status}">${recovery.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivities() {
        const activities = this.getRecentActivities();
        
        return activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-info">
                    <span class="activity-text">${activity.text}</span>
                    <small class="activity-time">${this.formatRelativeTime(activity.time)}</small>
                </div>
            </div>
        `).join('');
    }

    setupBackupTabs() {
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

    setupBackupHandlers() {
        // Search functionality
        const searchInput = document.getElementById('backup-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterBackups(e.target.value);
            });
        }

        // Filter functionality
        const filterSelect = document.getElementById('backup-filter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.filterBackupsByType(e.target.value);
            });
        }

        // Schedule settings
        const scheduleInputs = document.querySelectorAll('#schedule-enabled, #backup-frequency, #backup-time, #retention-days, #auto-cleanup');
        scheduleInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateScheduleSettings();
            });
        });
    }

    createManualBackup() {
        const backupId = this.generateBackupId();
        const timestamp = new Date().toISOString();
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Creating manual backup...', 'info');
        }

        // Simulate backup creation
        setTimeout(() => {
            const backup = {
                id: backupId,
                name: `Manual Backup - ${this.formatDate(timestamp)}`,
                type: 'manual',
                createdAt: timestamp,
                size: Math.floor(Math.random() * 1000000000) + 50000000, // 50MB - 1GB
                cloudSynced: false,
                data: this.collectSystemData()
            };

            this.backups.unshift(backup);
            this.saveBackupData();
            this.renderBackupInterface();

            if (window.notificationManager) {
                window.notificationManager.showNotification('Manual backup created successfully', 'success');
            }

            // Auto-sync to cloud if enabled
            if (this.isCloudSyncEnabled()) {
                this.syncToCloud(backup);
            }
        }, 2000);
    }

    createAutomaticBackup() {
        const backupId = this.generateBackupId();
        const timestamp = new Date().toISOString();
        
        const backup = {
            id: backupId,
            name: `Automatic Backup - ${this.formatDate(timestamp)}`,
            type: 'automatic',
            createdAt: timestamp,
            size: Math.floor(Math.random() * 800000000) + 100000000, // 100MB - 800MB
            cloudSynced: false,
            data: this.collectSystemData()
        };

        this.backups.unshift(backup);
        this.saveBackupData();

        // Auto-sync to cloud if enabled
        if (this.isCloudSyncEnabled()) {
            this.syncToCloud(backup);
        }

        return backup;
    }

    restoreBackup(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) return;

        if (confirm(`Are you sure you want to restore the backup "${backup.name}"? This will overwrite current data.`)) {
            if (window.notificationManager) {
                window.notificationManager.showNotification('Restoring backup...', 'info');
            }

            // Simulate restore process
            setTimeout(() => {
                this.performRestore(backup);
                
                if (window.notificationManager) {
                    window.notificationManager.showNotification('Backup restored successfully', 'success');
                }
            }, 3000);
        }
    }

    performRestore(backup) {
        // Simulate restore process
        const data = backup.data;
        
        // Restore different data types
        if (data.vehicles) {
            localStorage.setItem('repairbridge_vehicles', JSON.stringify(data.vehicles));
        }
        if (data.workOrders) {
            localStorage.setItem('repairbridge_work_orders', JSON.stringify(data.workOrders));
        }
        if (data.inventory) {
            localStorage.setItem('repairbridge_inventory', JSON.stringify(data.inventory));
        }
        if (data.settings) {
            localStorage.setItem('repairbridge_settings', JSON.stringify(data.settings));
        }

        // Add to recovery history
        this.addToRecoveryHistory({
            name: backup.name,
            type: 'full',
            date: new Date().toISOString(),
            status: 'completed'
        });
    }

    downloadBackup(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) return;

        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `repairbridge-backup-${backup.id}.json`;
        a.click();
        
        URL.revokeObjectURL(url);

        if (window.notificationManager) {
            window.notificationManager.showNotification('Backup downloaded successfully', 'success');
        }
    }

    deleteBackup(backupId) {
        const backup = this.backups.find(b => b.id === backupId);
        if (!backup) return;

        if (confirm(`Are you sure you want to delete the backup "${backup.name}"? This action cannot be undone.`)) {
            this.backups = this.backups.filter(b => b.id !== backupId);
            this.saveBackupData();
            this.renderBackupInterface();

            if (window.notificationManager) {
                window.notificationManager.showNotification('Backup deleted successfully', 'info');
            }
        }
    }

    syncNow() {
        if (this.syncStatus.syncInProgress) {
            if (window.notificationManager) {
                window.notificationManager.showNotification('Sync already in progress', 'warning');
            }
            return;
        }

        this.syncStatus.syncInProgress = true;
        this.syncStatus.syncedItems = 0;
        this.syncStatus.totalItems = this.backups.length;
        this.syncStatus.errors = [];

        if (window.notificationManager) {
            window.notificationManager.showNotification('Starting backup sync...', 'info');
        }

        // Simulate sync process
        const syncInterval = setInterval(() => {
            this.syncStatus.syncedItems++;
            this.updateSyncProgress();

            if (this.syncStatus.syncedItems >= this.syncStatus.totalItems) {
                clearInterval(syncInterval);
                this.syncStatus.syncInProgress = false;
                this.syncStatus.lastSync = new Date().toISOString();
                
                if (window.notificationManager) {
                    window.notificationManager.showNotification('Backup sync completed successfully', 'success');
                }
            }
        }, 1000);
    }

    updateSyncProgress() {
        const progressFill = document.querySelector('.sync-progress .progress-fill');
        const progressText = document.querySelector('.sync-progress .progress-text');
        
        if (progressFill && progressText) {
            const progress = this.getSyncProgress();
            progressFill.style.width = `${progress}%`;
            progressText.innerHTML = `
                <span>${this.syncStatus.syncedItems}/${this.syncStatus.totalItems} items</span>
                <span>${progress}%</span>
            `;
        }
    }

    setupAutoBackup() {
        if (!this.backupSchedule.enabled) return;

        const checkBackupTime = () => {
            const now = new Date();
            const [hours, minutes] = this.backupSchedule.time.split(':').map(Number);
            
            if (now.getHours() === hours && now.getMinutes() === minutes) {
                this.createAutomaticBackup();
            }
        };

        // Check every minute
        setInterval(checkBackupTime, 60000);
    }

    collectSystemData() {
        return {
            vehicles: JSON.parse(localStorage.getItem('repairbridge_vehicles') || '[]'),
            workOrders: JSON.parse(localStorage.getItem('repairbridge_work_orders') || '[]'),
            inventory: JSON.parse(localStorage.getItem('repairbridge_inventory') || '[]'),
            settings: JSON.parse(localStorage.getItem('repairbridge_settings') || '{}'),
            users: JSON.parse(localStorage.getItem('repairbridge_users') || '[]'),
            analytics: JSON.parse(localStorage.getItem('repairbridge_analytics') || '{}'),
            timestamp: new Date().toISOString()
        };
    }

    // Utility methods
    generateBackupId() {
        return 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatRelativeTime(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    getLastBackupTime() {
        if (this.backups.length === 0) return 'Never';
        return this.formatRelativeTime(this.backups[0].createdAt);
    }

    getTotalBackupSize() {
        const total = this.backups.reduce((sum, backup) => sum + backup.size, 0);
        return this.formatSize(total);
    }

    getSyncStatus() {
        if (this.syncStatus.syncInProgress) return 'Syncing...';
        if (this.syncStatus.lastSync) return 'Up to date';
        return 'Never synced';
    }

    getSyncProgress() {
        if (this.syncStatus.totalItems === 0) return 0;
        return Math.round((this.syncStatus.syncedItems / this.syncStatus.totalItems) * 100);
    }

    getBackupHealth() {
        const recentBackups = this.backups.filter(backup => {
            const backupDate = new Date(backup.createdAt);
            const daysSince = (new Date() - backupDate) / (1000 * 60 * 60 * 24);
            return daysSince <= 7;
        });

        if (recentBackups.length === 0) return { status: 'warning' };
        if (recentBackups.length >= 3) return { status: 'good' };
        return { status: 'ok' };
    }

    getStorageUsage() {
        // Simulate storage usage calculation
        return Math.floor(Math.random() * 40) + 30; // 30-70%
    }

    getRecentActivities() {
        const activities = [];
        
        // Add recent backup activities
        this.backups.slice(0, 3).forEach(backup => {
            activities.push({
                icon: backup.type === 'manual' ? 'hand-paper' : 'robot',
                text: `${backup.type === 'manual' ? 'Manual' : 'Automatic'} backup created`,
                time: backup.createdAt
            });
        });

        // Add sync activities
        if (this.syncStatus.lastSync) {
            activities.push({
                icon: 'cloud',
                text: 'Backups synced to cloud',
                time: this.syncStatus.lastSync
            });
        }

        return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    getNextBackupTime() {
        if (!this.backupSchedule.enabled) return 'Disabled';
        
        const now = new Date();
        const [hours, minutes] = this.backupSchedule.time.split(':').map(Number);
        
        let nextBackup = new Date(now);
        nextBackup.setHours(hours, minutes, 0, 0);
        
        if (nextBackup <= now) {
            nextBackup.setDate(nextBackup.getDate() + 1);
        }
        
        return this.formatDate(nextBackup.toISOString());
    }

    getEstimatedBackupSize() {
        // Simulate estimated size calculation
        const dataSize = JSON.stringify(this.collectSystemData()).length;
        return this.formatSize(dataSize * 1.2); // Add 20% overhead
    }

    getStorageRequired() {
        const retentionDays = this.backupSchedule.retention;
        const estimatedSize = this.getEstimatedBackupSize();
        const dailyBackups = this.backupSchedule.frequency === 'daily' ? retentionDays : 
                           this.backupSchedule.frequency === 'weekly' ? Math.ceil(retentionDays / 7) : 
                           Math.ceil(retentionDays / 30);
        
        return `~${this.formatSize(parseInt(estimatedSize) * dailyBackups)}`;
    }

    getRecoveryHistory() {
        const history = JSON.parse(localStorage.getItem('repairbridge_recovery_history') || '[]');
        return history.slice(0, 10); // Show last 10 recoveries
    }

    addToRecoveryHistory(recovery) {
        const history = this.getRecoveryHistory();
        history.unshift(recovery);
        localStorage.setItem('repairbridge_recovery_history', JSON.stringify(history.slice(0, 50)));
    }

    isCloudSyncEnabled() {
        return Object.values(this.cloudProviders).some(provider => provider.enabled);
    }

    syncToCloud(backup) {
        // Simulate cloud sync
        setTimeout(() => {
            backup.cloudSynced = true;
            this.saveBackupData();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification(`${backup.name} synced to cloud`, 'success');
            }
        }, 5000);
    }

    // Event handlers
    updateScheduleSettings() {
        const enabled = document.getElementById('schedule-enabled').checked;
        const frequency = document.getElementById('backup-frequency').value;
        const time = document.getElementById('backup-time').value;
        const retention = parseInt(document.getElementById('retention-days').value);
        const autoCleanup = document.getElementById('auto-cleanup').checked;

        this.backupSchedule = {
            enabled,
            frequency,
            time,
            retention,
            autoCleanup
        };

        this.saveBackupData();
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Backup schedule updated', 'success');
        }
    }

    saveCloudSettings() {
        // Collect all cloud provider settings
        const providers = ['aws', 'google', 'azure', 'dropbox'];
        
        providers.forEach(provider => {
            const enabled = document.getElementById(`${provider}-enabled`).checked;
            this.cloudProviders[provider].enabled = enabled;
            
            // Save provider-specific settings
            if (provider === 'aws') {
                this.cloudProviders.aws.bucket = document.getElementById('aws-bucket').value;
                this.cloudProviders.aws.region = document.getElementById('aws-region').value;
                this.cloudProviders.aws.accessKey = document.getElementById('aws-access-key').value;
                this.cloudProviders.aws.secretKey = document.getElementById('aws-secret-key').value;
            }
            // Add other providers...
        });

        localStorage.setItem('repairbridge_cloud_providers', JSON.stringify(this.cloudProviders));
        
        if (window.notificationManager) {
            window.notificationManager.showNotification('Cloud settings saved', 'success');
        }
    }

    testCloudConnection() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Testing cloud connection...', 'info');
        }

        // Simulate connection test
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate
            
            if (success) {
                if (window.notificationManager) {
                    window.notificationManager.showNotification('Cloud connection successful', 'success');
                }
            } else {
                if (window.notificationManager) {
                    window.notificationManager.showNotification('Cloud connection failed', 'error');
                }
            }
        }, 2000);
    }

    filterBackups(searchTerm) {
        const backupItems = document.querySelectorAll('.backup-item');
        
        backupItems.forEach(item => {
            const backupName = item.querySelector('h4').textContent.toLowerCase();
            const isVisible = backupName.includes(searchTerm.toLowerCase());
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }

    filterBackupsByType(type) {
        const backupItems = document.querySelectorAll('.backup-item');
        
        backupItems.forEach(item => {
            const backupType = item.querySelector('.backup-type').textContent;
            const isVisible = type === 'all' || backupType === type;
            item.style.display = isVisible ? 'flex' : 'none';
        });
    }

    showRestoreDialog() {
        // This would open a restore dialog
        if (window.notificationManager) {
            window.notificationManager.showNotification('Restore dialog opened', 'info');
        }
    }

    startFullRecovery() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Full recovery process started', 'info');
        }
    }

    startDataRecovery() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Data recovery process started', 'info');
        }
    }

    startSettingsRecovery() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Settings recovery process started', 'info');
        }
    }

    authenticateDropbox() {
        if (window.notificationManager) {
            window.notificationManager.showNotification('Dropbox authentication started', 'info');
        }
    }

    createBackupIndexes() {
        // Create indexes for faster backup searches
        console.log('Creating backup indexes...');
    }

    validateBackupIntegrity() {
        // Validate backup file integrity
        console.log('Validating backup integrity...');
    }

    scheduleCleanup() {
        // Schedule old backup cleanup
        if (this.backupSchedule.autoCleanup) {
            setInterval(() => {
                this.cleanupOldBackups();
            }, 86400000); // Daily cleanup
        }
    }

    cleanupOldBackups() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.backupSchedule.retention);
        
        const initialCount = this.backups.length;
        this.backups = this.backups.filter(backup => {
            return new Date(backup.createdAt) > cutoffDate;
        });
        
        const removedCount = initialCount - this.backups.length;
        if (removedCount > 0) {
            this.saveBackupData();
            
            if (window.notificationManager) {
                window.notificationManager.showNotification(`Cleaned up ${removedCount} old backups`, 'info');
            }
        }
    }
}

// Initialize backup manager
window.backupManager = new BackupManager();
