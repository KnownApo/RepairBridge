/**
 * Help System and Tutorial Manager
 * Provides comprehensive help, tutorials, and documentation
 */

class HelpSystem {
    constructor() {
        this.tutorials = {};
        this.helpArticles = {};
        this.currentTutorial = null;
        this.tutorialStep = 0;
        this.userProgress = {};
        
        this.initializeHelpSystem();
        this.setupTutorials();
        this.setupHelpArticles();
        this.loadUserProgress();
    }

    initializeHelpSystem() {
        // Create help overlay
        this.createHelpOverlay();
        
        // Add help button to navigation
        this.addHelpButton();
        
        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    createHelpOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'help-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 20000;
            display: none;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(overlay);
    }

    addHelpButton() {
        const helpButton = document.createElement('button');
        helpButton.id = 'help-button';
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(45deg, #4facfe, #00f2fe);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 15000;
            box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);
            transition: all 0.3s ease;
        `;
        
        helpButton.addEventListener('mouseenter', () => {
            helpButton.style.transform = 'scale(1.1)';
            helpButton.style.boxShadow = '0 8px 30px rgba(79, 172, 254, 0.4)';
        });
        
        helpButton.addEventListener('mouseleave', () => {
            helpButton.style.transform = 'scale(1)';
            helpButton.style.boxShadow = '0 4px 20px rgba(79, 172, 254, 0.3)';
        });
        
        helpButton.addEventListener('click', () => {
            this.showHelpCenter();
        });
        
        document.body.appendChild(helpButton);
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // F1 - Help
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelpCenter();
            }
            
            // Ctrl+Shift+H - Quick Help
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                this.showQuickHelp();
            }
            
            // Ctrl+Shift+T - Start Tutorial
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.startTutorial('getting-started');
            }
            
            // Escape - Close help
            if (e.key === 'Escape' && document.getElementById('help-overlay').style.display === 'block') {
                this.closeHelp();
            }
        });
    }

    setupTutorials() {
        this.tutorials = {
            'getting-started': {
                title: 'Getting Started with RepairBridge',
                description: 'Learn the basics of using RepairBridge',
                steps: [
                    {
                        title: 'Welcome to RepairBridge',
                        content: 'RepairBridge is your comprehensive vehicle repair management system. Let\'s start with a quick tour of the interface.',
                        target: '.nav-header',
                        position: 'bottom'
                    },
                    {
                        title: 'Navigation',
                        content: 'Use these buttons to navigate between different sections of the application.',
                        target: '.nav-links',
                        position: 'bottom'
                    },
                    {
                        title: 'Dashboard',
                        content: 'The dashboard gives you an overview of your shop\'s performance and key metrics.',
                        target: '#dashboard',
                        position: 'center'
                    },
                    {
                        title: 'Vehicle Lookup',
                        content: 'Search for vehicle information and specifications using VIN or vehicle details.',
                        target: '[data-section="data-aggregator"]',
                        position: 'bottom'
                    },
                    {
                        title: 'Diagnostics',
                        content: 'Run diagnostic tests and analyze vehicle systems.',
                        target: '[data-section="ar-diagnostics"]',
                        position: 'bottom'
                    },
                    {
                        title: 'Inventory Management',
                        content: 'Track parts, supplies, and manage your inventory.',
                        target: '[data-section="inventory"]',
                        position: 'bottom'
                    },
                    {
                        title: 'Tutorial Complete',
                        content: 'You\'ve completed the basic tutorial! Explore each section to learn more.',
                        target: null,
                        position: 'center'
                    }
                ]
            },
            'inventory-management': {
                title: 'Inventory Management Tutorial',
                description: 'Learn how to manage your parts and supplies',
                steps: [
                    {
                        title: 'Inventory Overview',
                        content: 'The inventory section helps you track all your parts and supplies.',
                        target: '#inventory',
                        position: 'center'
                    },
                    {
                        title: 'Adding Items',
                        content: 'Click "Add Item" to add new parts to your inventory.',
                        target: '.add-item-btn',
                        position: 'bottom'
                    },
                    {
                        title: 'Stock Levels',
                        content: 'Monitor stock levels and get alerts when items run low.',
                        target: '.inventory-summary',
                        position: 'top'
                    },
                    {
                        title: 'Suppliers',
                        content: 'Manage your suppliers and purchase orders.',
                        target: '.suppliers-section',
                        position: 'top'
                    }
                ]
            },
            'diagnostics': {
                title: 'Diagnostic System Tutorial',
                description: 'Learn how to perform vehicle diagnostics',
                steps: [
                    {
                        title: 'Diagnostic Interface',
                        content: 'The diagnostic system helps you troubleshoot vehicle issues.',
                        target: '#ar-diagnostics',
                        position: 'center'
                    },
                    {
                        title: 'Scanner Connection',
                        content: 'Connect your OBD scanner to read vehicle data.',
                        target: '.scanner-connection',
                        position: 'bottom'
                    },
                    {
                        title: 'Reading Codes',
                        content: 'Retrieve and interpret diagnostic trouble codes.',
                        target: '.diagnostic-codes',
                        position: 'top'
                    },
                    {
                        title: 'Live Data',
                        content: 'Monitor real-time vehicle parameters.',
                        target: '.live-data',
                        position: 'top'
                    }
                ]
            },
            'reporting': {
                title: 'Reporting System Tutorial',
                description: 'Learn how to generate and use reports',
                steps: [
                    {
                        title: 'Reports Overview',
                        content: 'Generate comprehensive reports for your business.',
                        target: '#reporting',
                        position: 'center'
                    },
                    {
                        title: 'Report Templates',
                        content: 'Choose from various pre-built report templates.',
                        target: '.template-grid',
                        position: 'top'
                    },
                    {
                        title: 'Custom Reports',
                        content: 'Create custom reports with specific date ranges and filters.',
                        target: '.generate-report-btn',
                        position: 'bottom'
                    },
                    {
                        title: 'Viewing Reports',
                        content: 'View, download, and share your generated reports.',
                        target: '.reports-list',
                        position: 'top'
                    }
                ]
            }
        };
    }

    setupHelpArticles() {
        this.helpArticles = {
            'getting-started': {
                title: 'Getting Started Guide',
                category: 'Basics',
                content: `
                    <h3>Welcome to RepairBridge</h3>
                    <p>RepairBridge is a comprehensive vehicle repair management system designed to streamline your shop operations.</p>
                    
                    <h4>Key Features:</h4>
                    <ul>
                        <li><strong>Vehicle Lookup:</strong> Search for vehicle information and specifications</li>
                        <li><strong>Diagnostics:</strong> Perform comprehensive vehicle diagnostics</li>
                        <li><strong>Inventory Management:</strong> Track parts and supplies</li>
                        <li><strong>Work Orders:</strong> Manage customer jobs and service requests</li>
                        <li><strong>Marketplace:</strong> Order parts and supplies</li>
                        <li><strong>Analytics:</strong> View performance metrics and insights</li>
                        <li><strong>Reporting:</strong> Generate business reports</li>
                    </ul>
                    
                    <h4>Getting Started:</h4>
                    <ol>
                        <li>Explore the dashboard to get an overview of your shop</li>
                        <li>Set up your inventory with current parts and supplies</li>
                        <li>Start processing work orders for your customers</li>
                        <li>Use the diagnostic tools for troubleshooting</li>
                        <li>Generate reports to track your business performance</li>
                    </ol>
                `
            },
            'vehicle-lookup': {
                title: 'Vehicle Lookup Guide',
                category: 'Features',
                content: `
                    <h3>Vehicle Lookup System</h3>
                    <p>The Vehicle Lookup system allows you to search for detailed vehicle information using VIN numbers or vehicle specifications.</p>
                    
                    <h4>Search Methods:</h4>
                    <ul>
                        <li><strong>VIN Search:</strong> Enter a 17-character VIN for complete vehicle information</li>
                        <li><strong>Year/Make/Model:</strong> Search by specifying year, make, and model</li>
                        <li><strong>Advanced Search:</strong> Use additional filters for precise results</li>
                    </ul>
                    
                    <h4>Available Information:</h4>
                    <ul>
                        <li>Vehicle specifications and features</li>
                        <li>Engine and transmission details</li>
                        <li>Maintenance schedules and intervals</li>
                        <li>Common diagnostic trouble codes</li>
                        <li>Part numbers and compatibility</li>
                    </ul>
                `
            },
            'inventory-management': {
                title: 'Inventory Management',
                category: 'Features',
                content: `
                    <h3>Inventory Management System</h3>
                    <p>Efficiently manage your parts inventory, track stock levels, and automate reordering.</p>
                    
                    <h4>Key Features:</h4>
                    <ul>
                        <li><strong>Stock Tracking:</strong> Monitor quantities and locations</li>
                        <li><strong>Low Stock Alerts:</strong> Get notified when items need reordering</li>
                        <li><strong>Supplier Management:</strong> Manage vendor relationships</li>
                        <li><strong>Purchase Orders:</strong> Create and track orders</li>
                        <li><strong>Categories:</strong> Organize items by type and function</li>
                    </ul>
                    
                    <h4>Best Practices:</h4>
                    <ul>
                        <li>Set appropriate minimum stock levels</li>
                        <li>Regularly audit your inventory</li>
                        <li>Use categories to organize similar items</li>
                        <li>Track costs and pricing accurately</li>
                        <li>Maintain good supplier relationships</li>
                    </ul>
                `
            },
            'diagnostics': {
                title: 'Diagnostic System',
                category: 'Features',
                content: `
                    <h3>Vehicle Diagnostic System</h3>
                    <p>Perform comprehensive vehicle diagnostics using OBD-II scanners and advanced testing procedures.</p>
                    
                    <h4>Diagnostic Capabilities:</h4>
                    <ul>
                        <li><strong>Code Reading:</strong> Retrieve and clear diagnostic trouble codes</li>
                        <li><strong>Live Data:</strong> Monitor real-time sensor values</li>
                        <li><strong>System Tests:</strong> Perform actuator and system tests</li>
                        <li><strong>Freeze Frame:</strong> Capture conditions when codes were set</li>
                    </ul>
                    
                    <h4>Troubleshooting Process:</h4>
                    <ol>
                        <li>Connect diagnostic scanner to vehicle</li>
                        <li>Retrieve diagnostic trouble codes</li>
                        <li>Analyze code definitions and descriptions</li>
                        <li>Review live data and freeze frame information</li>
                        <li>Perform system tests as needed</li>
                        <li>Document findings and repair actions</li>
                    </ol>
                `
            },
            'reporting': {
                title: 'Reporting System',
                category: 'Features',
                content: `
                    <h3>Business Reporting</h3>
                    <p>Generate comprehensive reports to track performance, analyze trends, and make informed business decisions.</p>
                    
                    <h4>Available Reports:</h4>
                    <ul>
                        <li><strong>Daily Operations:</strong> Daily summary of activities</li>
                        <li><strong>Weekly Performance:</strong> Weekly analysis and trends</li>
                        <li><strong>Monthly Business:</strong> Comprehensive monthly overview</li>
                        <li><strong>Inventory Reports:</strong> Stock levels and movements</li>
                        <li><strong>Financial Reports:</strong> Revenue and cost analysis</li>
                    </ul>
                    
                    <h4>Report Features:</h4>
                    <ul>
                        <li>Interactive charts and graphs</li>
                        <li>Customizable date ranges</li>
                        <li>Export to various formats</li>
                        <li>Automated scheduling</li>
                        <li>Business recommendations</li>
                    </ul>
                `
            },
            'keyboard-shortcuts': {
                title: 'Keyboard Shortcuts',
                category: 'Tips',
                content: `
                    <h3>Keyboard Shortcuts</h3>
                    <p>Use these keyboard shortcuts to navigate RepairBridge more efficiently.</p>
                    
                    <h4>Global Shortcuts:</h4>
                    <ul>
                        <li><strong>F1:</strong> Open Help Center</li>
                        <li><strong>Ctrl+Shift+H:</strong> Quick Help</li>
                        <li><strong>Ctrl+Shift+T:</strong> Start Tutorial</li>
                        <li><strong>Escape:</strong> Close modals and overlays</li>
                    </ul>
                    
                    <h4>Navigation:</h4>
                    <ul>
                        <li><strong>Ctrl+1:</strong> Dashboard</li>
                        <li><strong>Ctrl+2:</strong> Vehicle Lookup</li>
                        <li><strong>Ctrl+3:</strong> Diagnostics</li>
                        <li><strong>Ctrl+4:</strong> Marketplace</li>
                        <li><strong>Ctrl+5:</strong> Inventory</li>
                    </ul>
                `
            },
            'troubleshooting': {
                title: 'Troubleshooting Guide',
                category: 'Support',
                content: `
                    <h3>Common Issues and Solutions</h3>
                    
                    <h4>Scanner Connection Issues:</h4>
                    <ul>
                        <li>Ensure scanner is properly connected to vehicle OBD port</li>
                        <li>Check that vehicle ignition is on</li>
                        <li>Verify scanner compatibility with vehicle year/make</li>
                        <li>Try a different OBD port if available</li>
                    </ul>
                    
                    <h4>Data Loading Problems:</h4>
                    <ul>
                        <li>Check your internet connection</li>
                        <li>Clear browser cache and cookies</li>
                        <li>Try refreshing the page</li>
                        <li>Ensure JavaScript is enabled</li>
                    </ul>
                    
                    <h4>Performance Issues:</h4>
                    <ul>
                        <li>Close unnecessary browser tabs</li>
                        <li>Clear local storage data</li>
                        <li>Update to the latest browser version</li>
                        <li>Check available system memory</li>
                    </ul>
                `
            }
        };
    }

    showHelpCenter() {
        const overlay = document.getElementById('help-overlay');
        overlay.style.display = 'block';
        
        overlay.innerHTML = `
            <div class="help-center">
                <div class="help-header">
                    <h2><i class="fas fa-question-circle"></i> Help Center</h2>
                    <button class="close-help-btn" onclick="helpSystem.closeHelp()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="help-content">
                    <div class="help-sidebar">
                        <div class="help-section">
                            <h3>Quick Start</h3>
                            <ul>
                                <li><a href="#" onclick="helpSystem.startTutorial('getting-started')">
                                    <i class="fas fa-play"></i> Getting Started Tutorial
                                </a></li>
                                <li><a href="#" onclick="helpSystem.showQuickHelp()">
                                    <i class="fas fa-bolt"></i> Quick Help
                                </a></li>
                                <li><a href="#" onclick="helpSystem.showKeyboardShortcuts()">
                                    <i class="fas fa-keyboard"></i> Keyboard Shortcuts
                                </a></li>
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h3>Tutorials</h3>
                            <ul>
                                ${Object.entries(this.tutorials).map(([id, tutorial]) => `
                                    <li><a href="#" onclick="helpSystem.startTutorial('${id}')">
                                        <i class="fas fa-graduation-cap"></i> ${tutorial.title}
                                    </a></li>
                                `).join('')}
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h3>Documentation</h3>
                            <ul>
                                ${Object.entries(this.helpArticles).map(([id, article]) => `
                                    <li><a href="#" onclick="helpSystem.showHelpArticle('${id}')">
                                        <i class="fas fa-book"></i> ${article.title}
                                    </a></li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="help-main">
                        <div class="help-welcome">
                            <h3>Welcome to RepairBridge Help</h3>
                            <p>Choose from the options on the left to get started with tutorials, documentation, or quick help.</p>
                            
                            <div class="help-quick-actions">
                                <button class="help-action-btn" onclick="helpSystem.startTutorial('getting-started')">
                                    <i class="fas fa-play"></i>
                                    <span>Start Tutorial</span>
                                </button>
                                <button class="help-action-btn" onclick="helpSystem.showHelpArticle('getting-started')">
                                    <i class="fas fa-book"></i>
                                    <span>User Guide</span>
                                </button>
                                <button class="help-action-btn" onclick="helpSystem.showKeyboardShortcuts()">
                                    <i class="fas fa-keyboard"></i>
                                    <span>Shortcuts</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showHelpArticle(articleId) {
        const article = this.helpArticles[articleId];
        if (!article) return;
        
        const helpMain = document.querySelector('.help-main');
        helpMain.innerHTML = `
            <div class="help-article">
                <div class="article-header">
                    <h3>${article.title}</h3>
                    <span class="article-category">${article.category}</span>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
                <div class="article-actions">
                    <button class="help-action-btn" onclick="helpSystem.showHelpCenter()">
                        <i class="fas fa-arrow-left"></i> Back to Help Center
                    </button>
                </div>
            </div>
        `;
    }

    showKeyboardShortcuts() {
        this.showHelpArticle('keyboard-shortcuts');
    }

    showQuickHelp() {
        // Show contextual help based on current section
        const activeSection = document.querySelector('.nav-btn.active')?.dataset.section || 'dashboard';
        
        const quickHelp = {
            'dashboard': 'Dashboard shows your shop overview with key metrics and recent activities.',
            'data-aggregator': 'Vehicle Lookup helps you find vehicle information using VIN or specifications.',
            'ar-diagnostics': 'Diagnostics section provides tools for vehicle troubleshooting and testing.',
            'marketplace': 'Marketplace allows you to browse and order parts and supplies.',
            'inventory': 'Inventory management helps you track parts, stock levels, and suppliers.',
            'analytics': 'Analytics provides insights into your business performance and trends.',
            'notifications': 'Notifications center shows system alerts and important updates.',
            'reporting': 'Reporting system generates comprehensive business reports and analysis.'
        };
        
        const helpText = quickHelp[activeSection] || 'Navigate between sections using the navigation buttons above.';
        
        // Show tooltip-style help
        const tooltip = document.createElement('div');
        tooltip.className = 'quick-help-tooltip';
        tooltip.innerHTML = `
            <div class="quick-help-content">
                <h4>Quick Help</h4>
                <p>${helpText}</p>
                <button onclick="this.parentElement.parentElement.remove()">Got it</button>
            </div>
        `;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 25000;
            max-width: 400px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(tooltip);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 5000);
    }

    startTutorial(tutorialId) {
        const tutorial = this.tutorials[tutorialId];
        if (!tutorial) return;
        
        this.currentTutorial = tutorialId;
        this.tutorialStep = 0;
        
        // Close help center
        this.closeHelp();
        
        // Show tutorial overlay
        this.showTutorialStep();
    }

    showTutorialStep() {
        const tutorial = this.tutorials[this.currentTutorial];
        const step = tutorial.steps[this.tutorialStep];
        
        // Remove existing tutorial elements
        const existingTutorial = document.getElementById('tutorial-overlay');
        if (existingTutorial) {
            existingTutorial.remove();
        }
        
        // Create tutorial overlay
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.id = 'tutorial-overlay';
        tutorialOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 25000;
            pointer-events: none;
        `;
        
        // Highlight target element
        if (step.target) {
            const targetElement = document.querySelector(step.target);
            if (targetElement) {
                this.highlightElement(targetElement);
            }
        }
        
        // Create tutorial bubble
        const tutorialBubble = document.createElement('div');
        tutorialBubble.className = 'tutorial-bubble';
        tutorialBubble.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h4>${step.title}</h4>
                    <span class="tutorial-progress">${this.tutorialStep + 1} / ${tutorial.steps.length}</span>
                </div>
                <div class="tutorial-body">
                    <p>${step.content}</p>
                </div>
                <div class="tutorial-actions">
                    ${this.tutorialStep > 0 ? '<button class="tutorial-btn secondary" onclick="helpSystem.previousTutorialStep()">Previous</button>' : ''}
                    ${this.tutorialStep < tutorial.steps.length - 1 ? '<button class="tutorial-btn primary" onclick="helpSystem.nextTutorialStep()">Next</button>' : '<button class="tutorial-btn primary" onclick="helpSystem.completeTutorial()">Complete</button>'}
                    <button class="tutorial-btn close" onclick="helpSystem.closeTutorial()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Position tutorial bubble
        this.positionTutorialBubble(tutorialBubble, step);
        
        tutorialOverlay.appendChild(tutorialBubble);
        document.body.appendChild(tutorialOverlay);
        
        // Make tutorial bubble interactive
        tutorialBubble.style.pointerEvents = 'auto';
    }

    highlightElement(element) {
        // Remove existing highlights
        const existingHighlight = document.querySelector('.tutorial-highlight');
        if (existingHighlight) {
            existingHighlight.classList.remove('tutorial-highlight');
        }
        
        // Add highlight to target element
        element.classList.add('tutorial-highlight');
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    positionTutorialBubble(bubble, step) {
        bubble.style.cssText = `
            position: fixed;
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            z-index: 25001;
            pointer-events: auto;
        `;
        
        if (step.target) {
            const targetElement = document.querySelector(step.target);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                
                switch (step.position) {
                    case 'top':
                        bubble.style.top = `${rect.top - 20}px`;
                        bubble.style.left = `${rect.left + rect.width / 2}px`;
                        bubble.style.transform = 'translate(-50%, -100%)';
                        break;
                    case 'bottom':
                        bubble.style.top = `${rect.bottom + 20}px`;
                        bubble.style.left = `${rect.left + rect.width / 2}px`;
                        bubble.style.transform = 'translateX(-50%)';
                        break;
                    case 'left':
                        bubble.style.top = `${rect.top + rect.height / 2}px`;
                        bubble.style.left = `${rect.left - 20}px`;
                        bubble.style.transform = 'translate(-100%, -50%)';
                        break;
                    case 'right':
                        bubble.style.top = `${rect.top + rect.height / 2}px`;
                        bubble.style.left = `${rect.right + 20}px`;
                        bubble.style.transform = 'translateY(-50%)';
                        break;
                    default:
                        bubble.style.top = '50%';
                        bubble.style.left = '50%';
                        bubble.style.transform = 'translate(-50%, -50%)';
                }
            }
        } else {
            // Center bubble if no target
            bubble.style.top = '50%';
            bubble.style.left = '50%';
            bubble.style.transform = 'translate(-50%, -50%)';
        }
    }

    nextTutorialStep() {
        const tutorial = this.tutorials[this.currentTutorial];
        if (this.tutorialStep < tutorial.steps.length - 1) {
            this.tutorialStep++;
            this.showTutorialStep();
        }
    }

    previousTutorialStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.showTutorialStep();
        }
    }

    completeTutorial() {
        this.closeTutorial();
        
        // Mark tutorial as completed
        this.userProgress[this.currentTutorial] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveUserProgress();
        
        // Show completion message
        if (window.notificationManager) {
            window.notificationManager.showNotification(
                `Tutorial "${this.tutorials[this.currentTutorial].title}" completed!`,
                'success'
            );
        }
        
        this.currentTutorial = null;
        this.tutorialStep = 0;
    }

    closeTutorial() {
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        if (tutorialOverlay) {
            tutorialOverlay.remove();
        }
        
        // Remove highlights
        const highlight = document.querySelector('.tutorial-highlight');
        if (highlight) {
            highlight.classList.remove('tutorial-highlight');
        }
        
        this.currentTutorial = null;
        this.tutorialStep = 0;
    }

    closeHelp() {
        const overlay = document.getElementById('help-overlay');
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }

    loadUserProgress() {
        const saved = localStorage.getItem('repairbridge_help_progress');
        if (saved) {
            this.userProgress = JSON.parse(saved);
        }
    }

    saveUserProgress() {
        localStorage.setItem('repairbridge_help_progress', JSON.stringify(this.userProgress));
    }

    // Context-sensitive help
    showContextualHelp(context) {
        const contextualHelp = {
            'vehicle-search': 'Enter a VIN number or select vehicle details to search for information.',
            'diagnostic-scan': 'Connect your scanner and click "Start Scan" to begin diagnostics.',
            'inventory-add': 'Fill in the item details and click "Add Item" to add to inventory.',
            'work-order-create': 'Enter customer and vehicle information to create a new work order.',
            'report-generate': 'Select a report template and date range to generate a report.'
        };
        
        const helpText = contextualHelp[context];
        if (helpText) {
            // Show contextual help tooltip
            this.showTooltip(helpText);
        }
    }

    showTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'contextual-help-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <p>${text}</p>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        tooltip.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(79, 172, 254, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 20000;
            max-width: 300px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(tooltip);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.remove();
            }
        }, 5000);
    }
}

// Add CSS styles for help system
const helpStyles = document.createElement('style');
helpStyles.textContent = `
    .help-center {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 1200px;
        height: 80%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    .help-header {
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .help-header h2 {
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .close-help-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .close-help-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .help-content {
        flex: 1;
        display: flex;
        overflow: hidden;
    }
    
    .help-sidebar {
        width: 300px;
        background: #f8f9fa;
        padding: 20px;
        overflow-y: auto;
        border-right: 1px solid #e9ecef;
    }
    
    .help-section {
        margin-bottom: 24px;
    }
    
    .help-section h3 {
        margin: 0 0 12px 0;
        color: #495057;
        font-size: 1.1rem;
    }
    
    .help-section ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .help-section li {
        margin-bottom: 8px;
    }
    
    .help-section a {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6c757d;
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 6px;
        transition: all 0.3s ease;
    }
    
    .help-section a:hover {
        background: #e9ecef;
        color: #495057;
    }
    
    .help-main {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .help-welcome {
        text-align: center;
        padding: 40px 20px;
    }
    
    .help-welcome h3 {
        margin-bottom: 16px;
        color: #495057;
    }
    
    .help-welcome p {
        margin-bottom: 24px;
        color: #6c757d;
    }
    
    .help-quick-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .help-action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        color: white;
        border: none;
        padding: 16px 24px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
    }
    
    .help-action-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
    }
    
    .help-action-btn i {
        font-size: 1.5rem;
    }
    
    .help-article {
        max-width: 800px;
    }
    
    .article-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .article-header h3 {
        margin: 0;
        color: #495057;
    }
    
    .article-category {
        background: #e9ecef;
        color: #6c757d;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.9rem;
    }
    
    .article-content {
        line-height: 1.6;
        color: #495057;
    }
    
    .article-content h4 {
        margin-top: 24px;
        margin-bottom: 12px;
        color: #495057;
    }
    
    .article-content ul, .article-content ol {
        margin-bottom: 16px;
    }
    
    .article-content li {
        margin-bottom: 8px;
    }
    
    .article-actions {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #e9ecef;
    }
    
    .tutorial-highlight {
        position: relative;
        z-index: 20000;
        box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.6), 0 0 0 8px rgba(79, 172, 254, 0.3);
        border-radius: 4px;
    }
    
    .tutorial-bubble {
        color: #495057;
    }
    
    .tutorial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .tutorial-header h4 {
        margin: 0;
        color: #495057;
    }
    
    .tutorial-progress {
        background: #e9ecef;
        color: #6c757d;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .tutorial-body {
        margin-bottom: 16px;
    }
    
    .tutorial-body p {
        margin: 0;
        line-height: 1.5;
    }
    
    .tutorial-actions {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    .tutorial-btn {
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        font-size: 0.9rem;
    }
    
    .tutorial-btn.primary {
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        color: white;
    }
    
    .tutorial-btn.secondary {
        background: #e9ecef;
        color: #6c757d;
    }
    
    .tutorial-btn.close {
        background: none;
        color: #6c757d;
        padding: 4px 8px;
        margin-left: auto;
    }
    
    .tutorial-btn:hover {
        transform: translateY(-1px);
    }
    
    .quick-help-tooltip {
        animation: fadeIn 0.3s ease-out;
    }
    
    .quick-help-content {
        text-align: center;
    }
    
    .quick-help-content h4 {
        margin: 0 0 8px 0;
        color: white;
    }
    
    .quick-help-content p {
        margin: 0 0 16px 0;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .quick-help-content button {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .quick-help-content button:hover {
        background: rgba(255, 255, 255, 0.3);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .contextual-help-tooltip {
        animation: slideInRight 0.3s ease-out;
    }
    
    .tooltip-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
    }
    
    .tooltip-content p {
        margin: 0;
        flex: 1;
    }
    
    .tooltip-content button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .tooltip-content button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(helpStyles);

// Initialize help system
window.helpSystem = new HelpSystem();
