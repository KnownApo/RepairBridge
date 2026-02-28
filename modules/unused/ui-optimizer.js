/**
 * UI/UX Optimizer Module
 * Handles performance optimization, smooth animations, and enhanced user experience
 * Author: RepairBridge Development Team
 * Version: 1.0.0
 */

class UIOptimizer {
    constructor() {
        this.isInitialized = false;
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            memoryUsage: 0,
            framesPerSecond: 0
        };
        this.optimizations = {
            lazyLoading: true,
            imageOptimization: true,
            cacheManagement: true,
            animationOptimization: true,
            memoryCleanup: true
        };
        this.animationQueue = [];
        this.intersectionObserver = null;
        this.performanceObserver = null;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupPerformanceMonitoring();
        this.setupLazyLoading();
        this.setupAnimationOptimization();
        this.setupMemoryManagement();
        this.setupImageOptimization();
        this.setupCacheManagement();
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupTooltips();
        this.setupLoadingStates();
        this.setupErrorHandling();
        this.setupAccessibilityEnhancements();
        
        this.isInitialized = true;
        console.log('UI Optimizer initialized successfully');
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.performanceMetrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
                    }
                    if (entry.entryType === 'measure') {
                        this.performanceMetrics.renderTime = entry.duration;
                    }
                });
            });
            
            this.performanceObserver.observe({ entryTypes: ['navigation', 'measure'] });
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
            }, 5000);
        }

        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = () => {
            frames++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
                this.performanceMetrics.framesPerSecond = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    setupLazyLoading() {
        if (!this.optimizations.lazyLoading) return;

        // Intersection Observer for lazy loading
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Load images
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    
                    // Load content
                    if (element.dataset.content) {
                        this.loadContent(element);
                    }
                    
                    // Apply animations
                    if (element.dataset.animation) {
                        this.applyAnimation(element);
                    }
                    
                    this.intersectionObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe elements with lazy loading attributes
        document.querySelectorAll('[data-src], [data-content], [data-animation]').forEach(el => {
            this.intersectionObserver.observe(el);
        });
    }

    setupAnimationOptimization() {
        if (!this.optimizations.animationOptimization) return;

        // Optimize CSS animations
        const style = document.createElement('style');
        style.textContent = `
            * {
                will-change: auto;
            }
            
            .animate-in {
                animation: fadeInUp 0.6s ease-out forwards;
            }
            
            .animate-out {
                animation: fadeOutDown 0.4s ease-in forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
            
            .smooth-transition {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .gpu-accelerated {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
        `;
        document.head.appendChild(style);

        // Queue animations for better performance
        this.animationQueue = [];
        this.processAnimationQueue();
    }

    processAnimationQueue() {
        if (this.animationQueue.length === 0) {
            requestAnimationFrame(() => this.processAnimationQueue());
            return;
        }

        const animation = this.animationQueue.shift();
        this.executeAnimation(animation);
        
        requestAnimationFrame(() => this.processAnimationQueue());
    }

    executeAnimation(animation) {
        const { element, type, options } = animation;
        
        switch (type) {
            case 'fadeIn':
                this.fadeIn(element, options);
                break;
            case 'fadeOut':
                this.fadeOut(element, options);
                break;
            case 'slideIn':
                this.slideIn(element, options);
                break;
            case 'slideOut':
                this.slideOut(element, options);
                break;
        }
    }

    fadeIn(element, options = {}) {
        const duration = options.duration || 300;
        element.style.opacity = '0';
        element.style.display = options.display || 'block';
        
        const start = performance.now();
        const animate = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    fadeOut(element, options = {}) {
        const duration = options.duration || 300;
        
        const start = performance.now();
        const animate = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            element.style.opacity = 1 - progress;
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideIn(element, options = {}) {
        const duration = options.duration || 300;
        const direction = options.direction || 'left';
        
        element.style.transform = `translateX(${direction === 'left' ? '-100%' : '100%'})`;
        element.style.display = options.display || 'block';
        
        const start = performance.now();
        const animate = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const translateX = (direction === 'left' ? -100 : 100) * (1 - progress);
            element.style.transform = `translateX(${translateX}%)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    slideOut(element, options = {}) {
        const duration = options.duration || 300;
        const direction = options.direction || 'left';
        
        const start = performance.now();
        const animate = (timestamp) => {
            const progress = Math.min((timestamp - start) / duration, 1);
            const translateX = (direction === 'left' ? -100 : 100) * progress;
            element.style.transform = `translateX(${translateX}%)`;
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    setupMemoryManagement() {
        if (!this.optimizations.memoryCleanup) return;

        // Clean up unused DOM elements
        setInterval(() => {
            this.cleanupUnusedElements();
        }, 30000); // Every 30 seconds

        // Clean up event listeners
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanupUnusedElements() {
        // Remove hidden elements that are no longer needed
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(el => {
            if (el.dataset.persistent !== 'true') {
                // Check if element is truly unused
                if (!el.offsetParent && !el.dataset.keepAlive) {
                    el.remove();
                }
            }
        });

        // Clean up old cached data
        const now = Date.now();
        const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('rb_cache_'));
        cacheKeys.forEach(key => {
            const item = JSON.parse(localStorage.getItem(key) || '{}');
            if (item.expiry && now > item.expiry) {
                localStorage.removeItem(key);
            }
        });
    }

    setupImageOptimization() {
        if (!this.optimizations.imageOptimization) return;

        // Optimize images on the fly
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            this.optimizeImage(img);
        });

        // Set up observer for new images
        const imageObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll ? node.querySelectorAll('img') : [];
                        images.forEach(img => this.optimizeImage(img));
                    }
                });
            });
        });

        imageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    optimizeImage(img) {
        // Add loading optimization
        if (!img.loading) {
            img.loading = 'lazy';
        }

        // Add error handling
        img.onerror = () => {
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxwYXRoIGQ9Ik0zNSA2NUw1MCA0NUw2NSA2NUgzNVoiIGZpbGw9IiNkMWQ1ZGIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzNSIgcj0iNSIgZmlsbD0iI2QxZDVkYiIvPgo8L3N2Zz4=';
        };

        // Add progressive loading
        if (img.dataset.src && !img.src) {
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: ${img.width || 100}px;
                height: ${img.height || 100}px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
                border-radius: 8px;
            `;
            
            img.parentNode.insertBefore(placeholder, img);
            img.style.display = 'none';
            
            img.onload = () => {
                placeholder.remove();
                img.style.display = 'block';
            };
        }
    }

    setupCacheManagement() {
        if (!this.optimizations.cacheManagement) return;

        // Enhanced caching system
        this.cache = {
            set: (key, value, ttl = 3600000) => { // 1 hour default TTL
                const item = {
                    value: value,
                    expiry: Date.now() + ttl
                };
                localStorage.setItem(`rb_cache_${key}`, JSON.stringify(item));
            },
            
            get: (key) => {
                const item = localStorage.getItem(`rb_cache_${key}`);
                if (!item) return null;
                
                const parsed = JSON.parse(item);
                if (Date.now() > parsed.expiry) {
                    localStorage.removeItem(`rb_cache_${key}`);
                    return null;
                }
                
                return parsed.value;
            },
            
            clear: () => {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('rb_cache_'));
                keys.forEach(key => localStorage.removeItem(key));
            }
        };
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling
        const scrollToElement = (target, options = {}) => {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (!element) return;

            const offset = options.offset || 0;
            const duration = options.duration || 500;
            const easing = options.easing || 'easeInOutQuad';
            
            const start = window.pageYOffset;
            const elementTop = element.offsetTop;
            const targetPosition = elementTop - offset;
            const distance = targetPosition - start;
            
            let startTime = null;
            
            const easingFunctions = {
                easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
                easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
            };
            
            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const easedProgress = easingFunctions[easing](progress);
                window.scrollTo(0, start + distance * easedProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                }
            };
            
            requestAnimationFrame(animation);
        };

        // Add smooth scrolling to all anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = e.target.getAttribute('href');
                scrollToElement(target);
            }
        });

        // Export function for external use
        window.smoothScrollTo = scrollToElement;
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Skip if typing in input field
            if (e.target.matches('input, textarea, select')) return;
            
            switch (e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Escape':
                    this.handleEscapeKey(e);
                    break;
                case 'Enter':
                    this.handleEnterKey(e);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    this.handleArrowKeys(e);
                    break;
            }
        });
    }

    handleTabNavigation(e) {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    handleEscapeKey(e) {
        // Close modals, dropdowns, etc.
        const modal = document.querySelector('.modal.active');
        if (modal) {
            modal.classList.remove('active');
        }
        
        const dropdown = document.querySelector('.dropdown.active');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }

    handleEnterKey(e) {
        // Activate focused element
        if (e.target.matches('button, [role="button"]')) {
            e.target.click();
        }
    }

    handleArrowKeys(e) {
        // Navigate through lists
        const currentElement = document.activeElement;
        const parent = currentElement.closest('[role="listbox"], [role="menu"]');
        
        if (parent) {
            e.preventDefault();
            const items = parent.querySelectorAll('[role="option"], [role="menuitem"]');
            const currentIndex = Array.from(items).indexOf(currentElement);
            
            if (e.key === 'ArrowUp' && currentIndex > 0) {
                items[currentIndex - 1].focus();
            } else if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
                items[currentIndex + 1].focus();
            }
        }
    }

    setupTooltips() {
        // Enhanced tooltips
        const createTooltip = (element, text, position = 'top') => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let top, left;
            
            switch (position) {
                case 'top':
                    top = rect.top - tooltipRect.height - 8;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + 8;
                    left = rect.left + (rect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.left - tooltipRect.width - 8;
                    break;
                case 'right':
                    top = rect.top + (rect.height - tooltipRect.height) / 2;
                    left = rect.right + 8;
                    break;
            }
            
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
            
            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
            });
            
            return tooltip;
        };

        // Add tooltips to elements with title attribute
        document.addEventListener('mouseenter', (e) => {
            if (e.target.title) {
                const tooltip = createTooltip(e.target, e.target.title);
                e.target.addEventListener('mouseleave', () => {
                    tooltip.remove();
                }, { once: true });
            }
        });
    }

    setupLoadingStates() {
        // Enhanced loading states
        const showLoading = (element, text = 'Loading...') => {
            const loader = document.createElement('div');
            loader.className = 'loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <span class="loading-text">${text}</span>
                </div>
            `;
            loader.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999;
                border-radius: inherit;
            `;
            
            element.style.position = 'relative';
            element.appendChild(loader);
            
            return loader;
        };

        const hideLoading = (element) => {
            const loader = element.querySelector('.loading-overlay');
            if (loader) {
                loader.remove();
            }
        };

        // Export functions for external use
        window.showLoading = showLoading;
        window.hideLoading = hideLoading;
    }

    setupErrorHandling() {
        // Enhanced error handling
        window.addEventListener('error', (e) => {
            this.handleError(e.error, e.filename, e.lineno, e.colno);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason, 'Promise', 0, 0);
        });
    }

    handleError(error, filename, lineno, colno) {
        const errorInfo = {
            message: error.message || error,
            filename: filename || 'unknown',
            lineno: lineno || 0,
            colno: colno || 0,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log to console for debugging
        console.error('Application Error:', errorInfo);

        // Store error for analytics
        const errors = JSON.parse(localStorage.getItem('rb_errors') || '[]');
        errors.push(errorInfo);
        
        // Keep only last 50 errors
        if (errors.length > 50) {
            errors.splice(0, errors.length - 50);
        }
        
        localStorage.setItem('rb_errors', JSON.stringify(errors));

        // Show user-friendly error message
        this.showErrorNotification('An unexpected error occurred. Please try again.');
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setupAccessibilityEnhancements() {
        // Enhanced accessibility features
        const style = document.createElement('style');
        style.textContent = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            .focus-visible {
                outline: 2px solid #4f46e5;
                outline-offset: 2px;
            }
            
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Public methods for external use
    animate(element, type, options = {}) {
        this.animationQueue.push({ element, type, options });
    }

    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    optimizeElement(element) {
        // Apply general optimizations to an element
        element.classList.add('gpu-accelerated');
        
        if (element.tagName === 'IMG') {
            this.optimizeImage(element);
        }
        
        // Add intersection observer for animations
        if (element.dataset.animation) {
            this.intersectionObserver.observe(element);
        }
    }

    cleanup() {
        // Clean up observers and event listeners
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
        }
        
        // Clear animation queue
        this.animationQueue = [];
        
        console.log('UI Optimizer cleaned up');
    }
}

// Initialize UI Optimizer globally
window.uiOptimizer = new UIOptimizer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIOptimizer;
}
