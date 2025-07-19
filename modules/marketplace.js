/**
 * Marketplace Module
 * Handles marketplace functionality, cart management, and purchasing
 */

class MarketplaceManager {
    constructor() {
        this.cart = [];
        this.currentCategory = 'tools';
        this.initializeMarketplace();
    }

    /**
     * Initialize marketplace functionality
     */
    initializeMarketplace() {
        this.setupCategoryFilters();
        this.setupAddToCartHandlers();
        this.setupCartSystem();
        this.renderMarketplaceItems();
    }

    /**
     * Setup category filter buttons
     */
    setupCategoryFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get category and filter items
                const category = button.getAttribute('data-category');
                this.currentCategory = category;
                this.filterItemsByCategory(category);
            });
        });
    }

    /**
     * Setup add to cart handlers
     */
    setupAddToCartHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const itemId = button.getAttribute('data-item-id');
                this.addToCart(itemId);
            }
        });
    }

    /**
     * Setup cart system
     */
    setupCartSystem() {
        // Create cart widget
        this.createCartWidget();
        
        // Load cart from localStorage
        this.loadCartFromStorage();
        
        // Update cart display
        this.updateCartDisplay();
    }

    /**
     * Create cart widget
     */
    createCartWidget() {
        const marketplaceSection = document.getElementById('marketplace');
        if (!marketplaceSection) return;

        const cartWidget = document.createElement('div');
        cartWidget.className = 'cart-widget';
        cartWidget.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="toggle-cart-btn">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </button>
            </div>
            <div class="cart-content" style="display: none;">
                <div class="cart-items"></div>
                <div class="cart-total">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span class="subtotal">$0.00</span>
                    </div>
                    <div class="total-row">
                        <span>Group Discount:</span>
                        <span class="discount">-$0.00</span>
                    </div>
                    <div class="total-row final-total">
                        <span>Total:</span>
                        <span class="total">$0.00</span>
                    </div>
                </div>
                <div class="cart-actions">
                    <button class="clear-cart-btn">Clear Cart</button>
                    <button class="checkout-btn">Checkout</button>
                </div>
            </div>
        `;

        marketplaceSection.appendChild(cartWidget);

        // Setup cart toggle
        const toggleBtn = cartWidget.querySelector('.toggle-cart-btn');
        const cartContent = cartWidget.querySelector('.cart-content');
        
        toggleBtn.addEventListener('click', () => {
            const isVisible = cartContent.style.display !== 'none';
            cartContent.style.display = isVisible ? 'none' : 'block';
        });

        // Setup cart actions
        const clearBtn = cartWidget.querySelector('.clear-cart-btn');
        const checkoutBtn = cartWidget.querySelector('.checkout-btn');
        
        clearBtn.addEventListener('click', () => this.clearCart());
        checkoutBtn.addEventListener('click', () => this.checkout());
    }

    /**
     * Render marketplace items
     */
    renderMarketplaceItems() {
        const marketplaceGrid = document.querySelector('.marketplace-grid');
        if (!marketplaceGrid) return;

        // Clear existing items
        marketplaceGrid.innerHTML = '';

        // Get items for current category
        const items = marketplaceItems[this.currentCategory] || [];

        items.forEach(item => {
            const itemElement = this.createMarketplaceItem(item);
            marketplaceGrid.appendChild(itemElement);
        });
    }

    /**
     * Create marketplace item element
     */
    createMarketplaceItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'marketplace-item';
        itemElement.innerHTML = `
            <div class="item-image">
                <i class="fas fa-${this.getItemIcon(item.category)}"></i>
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <div class="item-features">
                    ${item.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                <div class="item-rating">
                    <div class="stars">
                        ${this.generateStars(item.rating)}
                    </div>
                    <span class="rating-text">${item.rating} (${item.reviews} reviews)</span>
                </div>
                <div class="price-info">
                    <span class="original-price">$${item.price}</span>
                    <span class="discount-price">$${item.discountPrice}</span>
                    <span class="discount-badge">${item.discount}% OFF</span>
                </div>
            </div>
            <button class="add-to-cart-btn" data-item-id="${item.id}">
                <i class="fas fa-cart-plus"></i>
                Add to Cart
            </button>
        `;

        return itemElement;
    }

    /**
     * Get icon for item category
     */
    getItemIcon(category) {
        const icons = {
            tools: 'wrench',
            training: 'graduation-cap',
            certifications: 'certificate'
        };
        return icons[category] || 'box';
    }

    /**
     * Generate star rating HTML
     */
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }

        return starsHTML;
    }

    /**
     * Filter items by category
     */
    filterItemsByCategory(category) {
        this.currentCategory = category;
        this.renderMarketplaceItems();
        
        // Add animation effect
        const items = document.querySelectorAll('.marketplace-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Add item to cart
     */
    addToCart(itemId) {
        // Find item in marketplace
        let item = null;
        for (const category in marketplaceItems) {
            item = marketplaceItems[category].find(i => i.id === itemId);
            if (item) break;
        }

        if (!item) {
            showNotification('Item not found', 'error');
            return;
        }

        // Check if item already in cart
        const existingItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        // Update cart display
        this.updateCartDisplay();
        
        // Save to localStorage
        this.saveCartToStorage();
        
        // Show notification
        showNotification(`${item.name} added to cart`, 'success');
    }

    /**
     * Remove item from cart
     */
    removeFromCart(itemId) {
        const index = this.cart.findIndex(item => item.id === itemId);
        if (index > -1) {
            const item = this.cart[index];
            this.cart.splice(index, 1);
            
            this.updateCartDisplay();
            this.saveCartToStorage();
            
            showNotification(`${item.name} removed from cart`, 'info');
        }
    }

    /**
     * Update item quantity in cart
     */
    updateQuantity(itemId, quantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
                this.updateCartDisplay();
                this.saveCartToStorage();
            }
        }
    }

    /**
     * Update cart display
     */
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.subtotal');
        const discountElement = document.querySelector('.discount');
        const totalElement = document.querySelector('.total');

        if (!cartCount || !cartItems) return;

        // Update cart count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update cart items
        cartItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p class="cart-item-price">$${item.discountPrice}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="marketplaceManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="marketplaceManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="remove-btn" onclick="marketplaceManager.removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.discountPrice * item.quantity), 0);
        const groupDiscount = subtotal * 0.05; // 5% group discount
        const total = subtotal - groupDiscount;

        // Update totals
        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (discountElement) discountElement.textContent = `-$${groupDiscount.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
        this.saveCartToStorage();
        showNotification('Cart cleared', 'info');
    }

    /**
     * Checkout process
     */
    checkout() {
        if (this.cart.length === 0) {
            showNotification('Your cart is empty', 'warning');
            return;
        }

        // Create checkout modal
        const modal = this.createCheckoutModal();
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    /**
     * Create checkout modal
     */
    createCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.discountPrice * item.quantity), 0);
        const groupDiscount = subtotal * 0.05;
        const total = subtotal - groupDiscount;

        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Checkout</h3>
                    <button class="close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="checkout-summary">
                        <h4>Order Summary</h4>
                        <div class="order-items">
                            ${this.cart.map(item => `
                                <div class="order-item">
                                    <span class="item-name">${item.name}</span>
                                    <span class="item-quantity">x${item.quantity}</span>
                                    <span class="item-total">$${(item.discountPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-totals">
                            <div class="total-line">
                                <span>Subtotal:</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="total-line">
                                <span>Group Discount (5%):</span>
                                <span>-$${groupDiscount.toFixed(2)}</span>
                            </div>
                            <div class="total-line final">
                                <span>Total:</span>
                                <span>$${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="checkout-form">
                        <h4>Billing Information</h4>
                        <form id="checkout-form">
                            <div class="form-group">
                                <label for="shop-name">Shop Name</label>
                                <input type="text" id="shop-name" name="shopName" required>
                            </div>
                            <div class="form-group">
                                <label for="contact-name">Contact Name</label>
                                <input type="text" id="contact-name" name="contactName" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="address">Address</label>
                                <textarea id="address" name="address" required></textarea>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">Cancel</button>
                    <button class="place-order-btn">Place Order</button>
                </div>
            </div>
        `;

        // Setup modal handlers
        this.setupCheckoutModalHandlers(modal);
        
        return modal;
    }

    /**
     * Setup checkout modal handlers
     */
    setupCheckoutModalHandlers(modal) {
        const closeBtn = modal.querySelector('.close-modal-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const placeOrderBtn = modal.querySelector('.place-order-btn');
        const backdrop = modal.querySelector('.modal-backdrop');

        closeBtn.addEventListener('click', () => this.closeModal(modal));
        cancelBtn.addEventListener('click', () => this.closeModal(modal));
        backdrop.addEventListener('click', () => this.closeModal(modal));

        placeOrderBtn.addEventListener('click', () => {
            this.processOrder(modal);
        });
    }

    /**
     * Process order
     */
    processOrder(modal) {
        const form = modal.querySelector('#checkout-form');
        const formData = new FormData(form);
        
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Show processing state
        const placeOrderBtn = modal.querySelector('.place-order-btn');
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;

        // Simulate order processing
        setTimeout(() => {
            // Create order
            const order = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                items: [...this.cart],
                customer: {
                    shopName: formData.get('shopName'),
                    contactName: formData.get('contactName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address')
                },
                total: this.cart.reduce((sum, item) => sum + (item.discountPrice * item.quantity), 0) * 0.95
            };

            // Save order (in real app, this would be sent to server)
            this.saveOrder(order);

            // Clear cart
            this.clearCart();

            // Show success message
            showNotification('Order placed successfully! Order ID: ' + order.id, 'success');

            // Close modal
            this.closeModal(modal);

            // Show order confirmation
            this.showOrderConfirmation(order);
        }, 2000);
    }

    /**
     * Save order to localStorage
     */
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('repairbridge_orders') || '[]');
        orders.push(order);
        localStorage.setItem('repairbridge_orders', JSON.stringify(orders));
    }

    /**
     * Show order confirmation
     */
    showOrderConfirmation(order) {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Order Confirmed</h3>
                    <button class="close-modal-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="confirmation-content">
                        <i class="fas fa-check-circle success-icon"></i>
                        <h4>Thank you for your order!</h4>
                        <p>Order ID: <strong>${order.id}</strong></p>
                        <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
                        <p>A confirmation email has been sent to ${order.customer.email}</p>
                        <p>Your items will be shipped to ${order.customer.shopName}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="close-btn">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Setup close handlers
        const closeBtn = modal.querySelector('.close-modal-btn');
        const closeFooterBtn = modal.querySelector('.close-btn');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        [closeBtn, closeFooterBtn, backdrop].forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(modal));
        });

        // Show modal
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    /**
     * Save cart to localStorage
     */
    saveCartToStorage() {
        localStorage.setItem('repairbridge_cart', JSON.stringify(this.cart));
    }

    /**
     * Load cart from localStorage
     */
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('repairbridge_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }
}

// Initialize marketplace when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof marketplaceItems !== 'undefined') {
        window.marketplaceManager = new MarketplaceManager();
    }
});
