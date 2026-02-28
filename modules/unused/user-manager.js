/**
 * User Management System
 * Handles user authentication, profiles, and preferences
 */

class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.userPreferences = {};
        this.sessionData = {};
        
        this.initializeUserSystem();
        this.loadUserData();
        this.setupEventListeners();
    }

    initializeUserSystem() {
        // Load users from localStorage or create demo users
        const savedUsers = localStorage.getItem('repairbridge_users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        } else {
            this.createDemoUsers();
        }

        // Check for existing session
        const savedSession = localStorage.getItem('repairbridge_session');
        if (savedSession) {
            this.sessionData = JSON.parse(savedSession);
            this.currentUser = this.users.find(user => user.id === this.sessionData.userId);
        }

        // Load user preferences
        const savedPreferences = localStorage.getItem('repairbridge_preferences');
        if (savedPreferences) {
            this.userPreferences = JSON.parse(savedPreferences);
        }
    }

    createDemoUsers() {
        this.users = [
            {
                id: 'user_001',
                username: 'admin',
                email: 'admin@repairbridge.com',
                password: 'admin123', // In production, this would be hashed
                role: 'Administrator',
                profile: {
                    firstName: 'John',
                    lastName: 'Smith',
                    title: 'Master Technician',
                    department: 'Diagnostics',
                    certifications: ['ASE Master', 'OBD-II Specialist', 'Hybrid/EV Certified'],
                    joinDate: '2020-01-15',
                    avatar: null
                },
                permissions: {
                    diagnostics: true,
                    marketplace: true,
                    analytics: true,
                    compliance: true,
                    userManagement: true,
                    systemSettings: true
                },
                preferences: {
                    theme: 'dark',
                    notifications: true,
                    autoSave: true,
                    language: 'en'
                },
                statistics: {
                    totalSessions: 1247,
                    diagnosticsRun: 892,
                    ordersPlaced: 45,
                    reportsGenerated: 156
                }
            },
            {
                id: 'user_002',
                username: 'tech_user',
                email: 'tech@repairbridge.com',
                password: 'tech123',
                role: 'Technician',
                profile: {
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    title: 'Senior Technician',
                    department: 'General Repair',
                    certifications: ['ASE Certified', 'OBD-II Specialist'],
                    joinDate: '2021-03-22',
                    avatar: null
                },
                permissions: {
                    diagnostics: true,
                    marketplace: true,
                    analytics: false,
                    compliance: true,
                    userManagement: false,
                    systemSettings: false
                },
                preferences: {
                    theme: 'dark',
                    notifications: true,
                    autoSave: true,
                    language: 'en'
                },
                statistics: {
                    totalSessions: 634,
                    diagnosticsRun: 456,
                    ordersPlaced: 23,
                    reportsGenerated: 78
                }
            }
        ];
        
        this.saveUsers();
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.sessionData = {
                userId: user.id,
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };
            
            this.saveSession();
            this.updateUserActivity();
            
            return { success: true, user: user };
        }
        
        return { success: false, message: 'Invalid username or password' };
    }

    logout() {
        this.currentUser = null;
        this.sessionData = {};
        localStorage.removeItem('repairbridge_session');
        
        return { success: true };
    }

    updateUserActivity() {
        if (this.currentUser) {
            this.sessionData.lastActivity = new Date().toISOString();
            this.saveSession();
        }
    }

    updateUserProfile(updates) {
        if (!this.currentUser) return { success: false, message: 'No user logged in' };
        
        this.currentUser.profile = { ...this.currentUser.profile, ...updates };
        this.saveUsers();
        
        return { success: true };
    }

    updateUserPreferences(preferences) {
        if (!this.currentUser) return { success: false, message: 'No user logged in' };
        
        this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
        this.userPreferences[this.currentUser.id] = this.currentUser.preferences;
        
        this.saveUsers();
        this.savePreferences();
        
        return { success: true };
    }

    changePassword(oldPassword, newPassword) {
        if (!this.currentUser) return { success: false, message: 'No user logged in' };
        
        if (this.currentUser.password !== oldPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }
        
        this.currentUser.password = newPassword;
        this.saveUsers();
        
        return { success: true };
    }

    renderUserProfile() {
        if (!this.currentUser) return;

        const profileSection = document.getElementById('user-profile');
        if (!profileSection) return;

        profileSection.innerHTML = `
            <div class="user-profile-container">
                <div class="profile-header">
                    <h2><i class="fas fa-user"></i> User Profile</h2>
                    <button class="edit-profile-btn" onclick="userManager.toggleEditMode()">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                </div>

                <div class="profile-content">
                    <div class="profile-main">
                        <div class="profile-avatar">
                            <div class="avatar-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                            <button class="change-avatar-btn">
                                <i class="fas fa-camera"></i>
                            </button>
                        </div>

                        <div class="profile-info">
                            <div class="profile-section">
                                <h3>Personal Information</h3>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <label>First Name</label>
                                        <span class="editable" data-field="firstName">${this.currentUser.profile.firstName}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Last Name</label>
                                        <span class="editable" data-field="lastName">${this.currentUser.profile.lastName}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Email</label>
                                        <span class="editable" data-field="email">${this.currentUser.email}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Username</label>
                                        <span>${this.currentUser.username}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Role</label>
                                        <span class="role-badge">${this.currentUser.role}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Department</label>
                                        <span class="editable" data-field="department">${this.currentUser.profile.department}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="profile-section">
                                <h3>Professional Information</h3>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <label>Job Title</label>
                                        <span class="editable" data-field="title">${this.currentUser.profile.title}</span>
                                    </div>
                                    <div class="info-item">
                                        <label>Join Date</label>
                                        <span>${new Date(this.currentUser.profile.joinDate).toLocaleDateString()}</span>
                                    </div>
                                    <div class="info-item full-width">
                                        <label>Certifications</label>
                                        <div class="certifications-list">
                                            ${this.currentUser.profile.certifications.map(cert => 
                                                `<span class="cert-badge">${cert}</span>`
                                            ).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="profile-sidebar">
                        <div class="stats-section">
                            <h3>Activity Statistics</h3>
                            <div class="stat-items">
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-number">${this.currentUser.statistics.totalSessions}</span>
                                        <span class="stat-label">Total Sessions</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-search"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-number">${this.currentUser.statistics.diagnosticsRun}</span>
                                        <span class="stat-label">Diagnostics Run</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-shopping-cart"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-number">${this.currentUser.statistics.ordersPlaced}</span>
                                        <span class="stat-label">Orders Placed</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-icon">
                                        <i class="fas fa-file-alt"></i>
                                    </div>
                                    <div class="stat-content">
                                        <span class="stat-number">${this.currentUser.statistics.reportsGenerated}</span>
                                        <span class="stat-label">Reports Generated</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="preferences-section">
                            <h3>Preferences</h3>
                            <div class="preference-items">
                                <div class="preference-item">
                                    <label>Theme</label>
                                    <select class="preference-select" data-pref="theme">
                                        <option value="dark" ${this.currentUser.preferences.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                        <option value="light" ${this.currentUser.preferences.theme === 'light' ? 'selected' : ''}>Light</option>
                                    </select>
                                </div>
                                <div class="preference-item">
                                    <label>Notifications</label>
                                    <label class="preference-toggle">
                                        <input type="checkbox" data-pref="notifications" ${this.currentUser.preferences.notifications ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label>Auto-save</label>
                                    <label class="preference-toggle">
                                        <input type="checkbox" data-pref="autoSave" ${this.currentUser.preferences.autoSave ? 'checked' : ''}>
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label>Language</label>
                                    <select class="preference-select" data-pref="language">
                                        <option value="en" ${this.currentUser.preferences.language === 'en' ? 'selected' : ''}>English</option>
                                        <option value="es" ${this.currentUser.preferences.language === 'es' ? 'selected' : ''}>Spanish</option>
                                        <option value="fr" ${this.currentUser.preferences.language === 'fr' ? 'selected' : ''}>French</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="security-section">
                            <h3>Security</h3>
                            <div class="security-actions">
                                <button class="security-btn" onclick="userManager.showChangePasswordModal()">
                                    <i class="fas fa-key"></i>
                                    Change Password
                                </button>
                                <button class="security-btn" onclick="userManager.showSecuritySettings()">
                                    <i class="fas fa-shield-alt"></i>
                                    Security Settings
                                </button>
                                <button class="security-btn logout-btn" onclick="userManager.logout()">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachProfileEventListeners();
    }

    attachProfileEventListeners() {
        // Preference changes
        const preferenceInputs = document.querySelectorAll('[data-pref]');
        preferenceInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const prefName = e.target.dataset.pref;
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                
                this.updateUserPreferences({ [prefName]: value });
                window.app.showNotification('Preference updated successfully', 'success');
            });
        });

        // Avatar change
        const changeAvatarBtn = document.querySelector('.change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => {
                window.app.showNotification('Avatar upload feature coming soon', 'info');
            });
        }
    }

    toggleEditMode() {
        const editableElements = document.querySelectorAll('.editable');
        const editBtn = document.querySelector('.edit-profile-btn');
        
        const isEditing = editBtn.innerHTML.includes('Save');
        
        if (isEditing) {
            // Save mode
            const updates = {};
            editableElements.forEach(element => {
                const field = element.dataset.field;
                const value = element.querySelector('input')?.value || element.textContent;
                
                if (field === 'firstName' || field === 'lastName' || field === 'title' || field === 'department') {
                    updates[field] = value;
                } else if (field === 'email') {
                    // Update email in user object
                    this.currentUser.email = value;
                }
                
                element.innerHTML = value;
            });
            
            this.updateUserProfile(updates);
            editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Profile';
            window.app.showNotification('Profile updated successfully', 'success');
        } else {
            // Edit mode
            editableElements.forEach(element => {
                const currentValue = element.textContent;
                element.innerHTML = `<input type="text" value="${currentValue}" class="edit-input">`;
            });
            
            editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    }

    showChangePasswordModal() {
        // Create modal for password change
        const modal = document.createElement('div');
        modal.className = 'modal password-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Change Password</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" id="currentPassword" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="newPassword" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" id="confirmPassword" class="form-input">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn-primary" onclick="userManager.processPasswordChange()">Change Password</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    processPasswordChange() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword !== confirmPassword) {
            window.app.showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 6) {
            window.app.showNotification('Password must be at least 6 characters', 'error');
            return;
        }
        
        const result = this.changePassword(currentPassword, newPassword);
        
        if (result.success) {
            window.app.showNotification('Password changed successfully', 'success');
            document.querySelector('.password-modal').remove();
        } else {
            window.app.showNotification(result.message, 'error');
        }
    }

    showSecuritySettings() {
        window.app.showNotification('Advanced security settings coming soon', 'info');
    }

    setupEventListeners() {
        // Auto-save preferences
        setInterval(() => {
            this.updateUserActivity();
        }, 60000); // Update activity every minute
    }

    saveUsers() {
        localStorage.setItem('repairbridge_users', JSON.stringify(this.users));
    }

    saveSession() {
        localStorage.setItem('repairbridge_session', JSON.stringify(this.sessionData));
    }

    savePreferences() {
        localStorage.setItem('repairbridge_preferences', JSON.stringify(this.userPreferences));
    }

    loadUserData() {
        // Load user-specific data and preferences
        if (this.currentUser) {
            this.applyUserPreferences();
        }
    }

    applyUserPreferences() {
        if (!this.currentUser) return;
        
        const preferences = this.currentUser.preferences;
        
        // Apply theme
        if (preferences.theme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Apply other preferences as needed
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        return this.currentUser && this.currentUser.permissions[permission];
    }

    updateUserStatistics(type) {
        if (!this.currentUser) return;
        
        switch (type) {
            case 'diagnostic':
                this.currentUser.statistics.diagnosticsRun++;
                break;
            case 'order':
                this.currentUser.statistics.ordersPlaced++;
                break;
            case 'report':
                this.currentUser.statistics.reportsGenerated++;
                break;
        }
        
        this.saveUsers();
    }
}

// Initialize user manager
window.userManager = new UserManager();
