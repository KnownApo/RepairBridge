(() => {
  window.RepairBridgeServices = window.RepairBridgeServices || {};

  const notificationService = {
    showNotification(message, type = "info") {
      const existingNotifications = document.querySelectorAll(".notification");
      existingNotifications.forEach((notification) => notification.remove());

      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${notificationService.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
            `;

      notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${notificationService.getNotificationColor(type)};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                z-index: 1000;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease-out forwards";
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    },
    getNotificationIcon(type) {
      const icons = {
        success: "check-circle",
        warning: "exclamation-triangle",
        error: "times-circle",
        info: "info-circle",
      };
      return icons[type] || "info-circle";
    },
    getNotificationColor(type) {
      const colors = {
        success: "rgba(34, 197, 94, 0.9)",
        warning: "rgba(245, 158, 11, 0.9)",
        error: "rgba(239, 68, 68, 0.9)",
        info: "rgba(79, 172, 254, 0.9)",
      };
      return colors[type] || "rgba(79, 172, 254, 0.9)";
    },
  };

  const cartService = (() => {
    const CART_STORAGE_KEY = "repairbridge_cart";

    function getCartState() {
      if (typeof RepairBridgeState !== "undefined") {
        return RepairBridgeState.getState().cart || [];
      }
      return [];
    }

    function setCartState(nextCart) {
      if (typeof RepairBridgeState !== "undefined") {
        RepairBridgeState.setState({ cart: nextCart });
      }
    }

    function parsePriceValue(price) {
      const numeric = parseFloat(String(price).replace(/[^0-9.]/g, ""));
      return Number.isFinite(numeric) ? numeric : 0;
    }

    function formatCurrency(value) {
      const normalized = Number.isFinite(value) ? value : 0;
      return `$${normalized.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    function loadCartFromStorage() {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCartState(parsed);
          }
        }
      } catch (error) {
        console.warn("Unable to load cart from storage", error);
      }
    }

    function saveCartToStorage() {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(getCartState()));
      } catch (error) {
        console.warn("Unable to save cart to storage", error);
      }
    }

    function getCartCount() {
      return getCartState().reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

    function renderCart() {
      const cartState = getCartState();
      const cartItemsEl = document.getElementById("cart-items");
      const cartTotalEl = document.getElementById("cart-total");
      const cartCounterEl = document.getElementById("cart-counter");

      if (!cartItemsEl || !cartTotalEl || !cartCounterEl) return;

      const count = getCartCount();
      cartCounterEl.textContent = count;

      if (!cartState.length) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
        cartTotalEl.textContent = "Total: $0";
        return;
      }

      cartItemsEl.innerHTML = cartState
        .map((item) => {
          const price = formatCurrency(item.price || 0);
          return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <span class="cart-item-title">${item.name}</span>
                            <span class="cart-item-meta">${price} · Qty ${item.quantity}</span>
                        </div>
                        <div class="cart-item-actions">
                            <button type="button" data-action="decrease" data-item="${item.name}">-</button>
                            <button type="button" data-action="increase" data-item="${item.name}">+</button>
                            <button type="button" data-action="remove" data-item="${item.name}">Remove</button>
                        </div>
                    </div>
                `;
        })
        .join("");

      const total = cartState.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );
      cartTotalEl.textContent = `Total: ${formatCurrency(total)}`;
    }

    function adjustCartItem(itemName, delta) {
      const cartState = getCartState().map((item) => ({ ...item }));
      const item = cartState.find((entry) => entry.name === itemName);
      if (!item) return;

      item.quantity = (item.quantity || 0) + delta;
      const nextCart =
        item.quantity <= 0 ? cartState.filter((entry) => entry.name !== itemName) : cartState;

      setCartState(nextCart);
      saveCartToStorage();
      renderCart();
    }

    function clearCart() {
      setCartState([]);
      saveCartToStorage();
      renderCart();
    }

    function addToCart(itemName, itemPrice) {
      const priceValue = parsePriceValue(itemPrice);
      const cartState = getCartState().map((item) => ({ ...item }));
      const existing = cartState.find((item) => item.name === itemName);

      if (existing) {
        existing.quantity += 1;
      } else {
        cartState.push({
          name: itemName,
          price: priceValue,
          quantity: 1,
        });
      }

      setCartState(cartState);
      saveCartToStorage();
      renderCart();
      notificationService.showNotification(
        `Added ${itemName} to cart (${formatCurrency(priceValue)})`,
        "success"
      );
    }

    return {
      getCartState,
      setCartState,
      parsePriceValue,
      formatCurrency,
      loadCartFromStorage,
      saveCartToStorage,
      getCartCount,
      renderCart,
      adjustCartItem,
      clearCart,
      addToCart,
    };
  })();

  const navigationService = {
    initializeNavigation() {
      const navButtons = document.querySelectorAll(".nav-btn");

      navButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const targetSection = this.getAttribute("data-section");
          console.log("Navigation button clicked:", targetSection);
          sectionService.showSection(targetSection);
        });
      });

      console.log("Navigation system initialized with", navButtons.length, "buttons");
    },
    animateSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";

        setTimeout(() => {
          section.style.transition = "all 0.5s ease";
          section.style.opacity = "1";
          section.style.transform = "translateY(0)";
        }, 50);
      }
    },
    trackSectionView(sectionId) {
      console.log(`Section viewed: ${sectionId}`);

      const activityList = document.querySelector(".activity-list");
      if (activityList) {
        const sectionNames = {
          dashboard: "Dashboard",
          "data-aggregator": "Data Hub",
          "ar-diagnostics": "AR Diagnostics",
          marketplace: "Marketplace",
          inventory: "Inventory",
          analytics: "Analytics",
          compliance: "Compliance",
        };

        const newActivity = document.createElement("div");
        newActivity.className = "activity-item";
        newActivity.innerHTML = `
                    <i class="fas fa-eye"></i>
                    <span>Viewed ${sectionNames[sectionId] || sectionId}</span>
                    <small>Just now</small>
                `;
        activityList.insertBefore(newActivity, activityList.firstChild);

        const activities = activityList.querySelectorAll(".activity-item");
        if (activities.length > 5) {
          activities[activities.length - 1].remove();
        }
      }
    },
    showWelcomeMessage() {
      setTimeout(() => {
        notificationService.showNotification("Welcome to RepairBridge Platform!", "success");
      }, 1000);
    },
  };

  const interactionService = {
    initializeInteractiveComponents() {
      const quickActionButtons = document.querySelectorAll(".action-btn");
      quickActionButtons.forEach((button) => {
        if (button.getAttribute("onclick")) return;
        button.addEventListener("click", function () {
          const action = this.dataset.action || this.textContent.trim();
          interactionService.handleQuickAction(action);
        });
      });

      const statCards = document.querySelectorAll(".stat-card");
      statCards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-8px) scale(1.02)";
        });

        card.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
        });
      });

      const marketplaceItems = document.querySelectorAll(".marketplace-item");
      marketplaceItems.forEach((item) => {
        item.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-6px) scale(1.02)";
        });

        item.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
        });
      });
    },
    handleQuickAction(action) {
      switch (action) {
        case "New Diagnostic":
          notificationService.showNotification("Starting new diagnostic session...", "info");
          document.querySelector('[data-section="ar-diagnostics"]').click();
          break;
        case "Sync Data":
          notificationService.showNotification("Syncing data sources...", "info");
          dataRefreshService.updateDataSources();
          break;
        case "Generate Report":
          notificationService.showNotification("Generating compliance report...", "info");
          complianceService.generateComplianceReport();
          break;
        default:
          notificationService.showNotification("Action not implemented yet", "warning");
      }
    },
  };

  const dataRefreshService = {
    initializeDataRefresh() {
      setInterval(() => dataRefreshService.updateDataSources(), 30000);

      const refreshButtons = document.querySelectorAll(".refresh-btn");
      refreshButtons.forEach((button) => {
        button.addEventListener("click", function () {
          this.style.animation = "spin 1s linear";
          dataRefreshService.updateDataSources();

          setTimeout(() => {
            this.style.animation = "";
          }, 1000);
        });
      });

      setInterval(() => dataRefreshService.updateRealTimeData(), 2000);
    },
    updateDataSources() {
      const sourceItems = document.querySelectorAll(".source-item");

      sourceItems.forEach((item) => {
        const statusIcon = item.querySelector("i");
        const statusText = item.querySelector("small");

        if (statusIcon && statusText) {
          if (Math.random() > 0.1) {
            statusIcon.className = "fas fa-circle connected";
            statusText.textContent = "Last sync: Just now";
          } else {
            statusIcon.className = "fas fa-circle disconnected";
            statusText.textContent = "Connection issue";
          }
        }
      });

      const progressBar = document.querySelector(".progress-fill");
      if (progressBar) {
        const newWidth = Math.min(100, Math.floor(Math.random() * 20) + 75);
        progressBar.style.width = newWidth + "%";
        const quotaLabel = progressBar.parentElement
          ? progressBar.parentElement.nextElementSibling
          : null;
        if (quotaLabel) {
          quotaLabel.textContent = newWidth + "% of monthly quota";
        }
      }
    },
    updateRealTimeData() {
      const dataValues = document.querySelectorAll(".data-value");

      dataValues.forEach((value) => {
        const currentText = value.textContent;

        if (currentText.includes("RPM")) {
          const newValue = (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
          value.textContent = newValue + " RPM";
        } else if (currentText.includes("°F")) {
          const newValue = Math.floor(Math.random() * 20) + 185;
          value.textContent = newValue + "°F";
        } else if (currentText.includes("PSI")) {
          const newValue = Math.floor(Math.random() * 10) + 40;
          value.textContent = newValue + " PSI";
        }
      });
    },
  };

  const marketplaceService = {
    initializeMarketplace() {
      const categoryButtons = document.querySelectorAll(".category-btn");
      const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

      categoryButtons.forEach((button) => {
        button.addEventListener("click", function () {
          categoryButtons.forEach((btn) => btn.classList.remove("active"));
          this.classList.add("active");

          const category = this.getAttribute("data-category");
          marketplaceService.filterMarketplaceItems(category);
        });
      });

      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const item = this.closest(".marketplace-item");
          const itemName = item.querySelector("h4").textContent;
          const itemPrice = item.querySelector(".discount-price").textContent;

          cartService.addToCart(itemName, itemPrice);
        });
      });

      const clearButton = document.getElementById("clear-cart-btn");
      if (clearButton) {
        clearButton.addEventListener("click", () => {
          cartService.clearCart();
          notificationService.showNotification("Cart cleared", "info");
        });
      }

      const cartItemsEl = document.getElementById("cart-items");
      if (cartItemsEl) {
        cartItemsEl.addEventListener("click", (event) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;
          const action = target.dataset.action;
          const itemName = target.dataset.item;
          if (!action || !itemName) return;

          if (action === "increase") {
            cartService.adjustCartItem(itemName, 1);
          } else if (action === "decrease") {
            cartService.adjustCartItem(itemName, -1);
          } else if (action === "remove") {
            cartService.adjustCartItem(itemName, -999);
          }
        });
      }

      cartService.loadCartFromStorage();
      cartService.renderCart();
    },
    filterMarketplaceItems(category) {
      notificationService.showNotification(`Filtering marketplace by ${category}`, "info");

      const items = document.querySelectorAll(".marketplace-item");
      items.forEach((item) => {
        item.style.opacity = "0.5";

        setTimeout(() => {
          item.style.opacity = "1";
        }, 300);
      });
    },
  };

  const complianceService = {
    initializeCompliance() {
      const toolButtons = document.querySelectorAll(".tool-btn");
      const exportButton = document.querySelector(".export-btn");
      const manageSubscriptionBtn = document.querySelector(".manage-subscription-btn");

      toolButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const toolName = this.querySelector("span").textContent;
          complianceService.launchComplianceTool(toolName);
        });
      });

      if (exportButton) {
        exportButton.addEventListener("click", function () {
          complianceService.exportTransactionLog();
        });
      }

      if (manageSubscriptionBtn) {
        manageSubscriptionBtn.addEventListener("click", function () {
          complianceService.openSubscriptionManagement();
        });
      }
    },
    launchComplianceTool(toolName) {
      notificationService.showNotification(`Launching ${toolName}...`, "info");

      setTimeout(() => {
        notificationService.showNotification(`${toolName} opened successfully`, "success");
      }, 1500);
    },
    openSubscriptionManagement() {
      notificationService.showNotification("Opening subscription management...", "info");

      setTimeout(() => {
        notificationService.showNotification("Subscription management loaded", "success");
      }, 1000);
    },
    exportTransactionLog() {
      notificationService.showNotification("Preparing transaction log export...", "info");

      setTimeout(() => {
        notificationService.showNotification("Transaction log exported successfully!", "success");
      }, 1500);
    },
    generateComplianceReport() {
      notificationService.showNotification("Generating compliance report...", "info");

      setTimeout(() => {
        notificationService.showNotification("Compliance report generated!", "success");
      }, 2000);
    },
  };

  const voiceService = {
    setupVoiceContextTracking() {
      // Placeholder: hook voice context updates on section changes
    },
    setupVoiceUI() {
      const voiceInterface = document.getElementById("voice-interface");
      if (!voiceInterface) return;
      if (window.voiceCommandSystem) {
        voiceInterface.style.display = "block";
      } else {
        voiceInterface.style.display = "none";
      }
    },
  };

  const competitiveService = {
    initializeCompetitiveFeatures() {
      if (window.telematicsSystem) {
        setTimeout(() => {
          if (document.getElementById("telematics-data")) {
            window.telematicsSystem.renderTelematicsData();
          }
        }, 1000);
      }

      if (window.blockchainSystem) {
        setTimeout(() => {
          if (document.getElementById("blockchain-status")) {
            document.getElementById("blockchain-status").innerHTML =
              window.blockchainSystem.renderBlockchainStatus();
          }
          if (document.getElementById("blockchain-blocks")) {
            document.getElementById("blockchain-blocks").innerHTML =
              window.blockchainSystem.renderRecentBlocks();
          }
          if (document.getElementById("blockchain-certificates")) {
            document.getElementById("blockchain-certificates").innerHTML =
              window.blockchainSystem.renderCertificates();
          }
        }, 1000);
      }

      if (window.voiceCommandSystem) {
        voiceService.setupVoiceUI();
      }

      if (window.customerPortalSystem) {
        setTimeout(() => {
          if (document.getElementById("customer-portal-data")) {
            competitiveService.showCustomerPortalDemo();
          }
        }, 1000);
      }

      console.log("Competitive features initialized");
    },
    showCustomerPortalDemo() {
      const container = document.getElementById("customer-portal-data");
      if (!container) return;
      container.innerHTML = `
                <div class="activity-item">
                    <span>✔️ Appointment Confirmed</span>
                    <small>Today, 10:30 AM</small>
                </div>
                <div class="activity-item">
                    <span>🧾 Invoice Ready</span>
                    <small>Balance: $0.00</small>
                </div>
            `;
    },
  };

  const sectionService = {
    showSection(sectionId) {
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
      });

      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.remove("active");
      });

      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");
        const navBtn = document.querySelector(`[data-section="${sectionId}"]`);
        if (navBtn) {
          navBtn.classList.add("active");
        }

        sectionService.initializeSectionFunctionality(sectionId);

        if (window.voiceCommandSystem) {
          window.voiceCommandSystem.updateContext(sectionId);
        }
      }
    },
    initializeSectionFunctionality(sectionId) {
      switch (sectionId) {
        case "dashboard":
          loadDashboardData();
          break;
        case "data-aggregator":
          loadDataAggregatorContent();
          break;
        case "ar-diagnostics":
          loadARDiagnostics();
          break;
        case "marketplace":
          if (window.marketplaceManager && window.marketplaceManager.renderMarketplaceItems) {
            window.marketplaceManager.renderMarketplaceItems();
          }
          break;
        case "inventory":
          if (window.inventoryManager && window.inventoryManager.loadInventoryData) {
            window.inventoryManager.loadInventoryData();
          }
          break;
        case "analytics":
          if (window.analyticsManager && window.analyticsManager.loadAnalytics) {
            window.analyticsManager.loadAnalytics();
          }
          break;
        case "compliance":
          loadComplianceContent();
          break;
        case "settings":
          if (window.settingsManager && window.settingsManager.loadSettingsInterface) {
            window.settingsManager.loadSettingsInterface();
          }
          break;
      }
    },
  };

  const legacyActionService = {
    quickAction(action) {
      switch (action) {
        case "diagnostic":
          notificationService.showNotification("Starting new diagnostic session...", "info");
          if (document.querySelector('[data-section="ar-diagnostics"]')) {
            sectionService.showSection("ar-diagnostics");
          }
          setTimeout(() => {
            notificationService.showNotification("Diagnostic tools ready!", "success");
          }, 1500);
          break;
        case "sync":
          notificationService.showNotification("Syncing data sources...", "info");
          dataRefreshService.updateDataSources();
          setTimeout(() => {
            notificationService.showNotification("All data sources synchronized!", "success");
          }, 1200);
          break;
        case "report":
          notificationService.showNotification("Generating compliance report...", "info");
          complianceService.generateComplianceReport();
          break;
        default:
          notificationService.showNotification("Action not implemented yet", "warning");
      }
    },
    updateLiveData() {
      notificationService.showNotification("Refreshing live data...", "info");
      setTimeout(() => {
        const rpm = document.getElementById("rpm-value");
        const temp = document.getElementById("temp-value");
        const pressure = document.getElementById("pressure-value");

        if (rpm) rpm.textContent = (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
        if (temp) temp.textContent = Math.floor(Math.random() * 20) + 185 + "°F";
        if (pressure) pressure.textContent = Math.floor(Math.random() * 10) + 40 + " PSI";

        notificationService.showNotification("Live data updated!", "success");
      }, 800);
    },
    refreshData() {
      notificationService.showNotification("Refreshing data sources...", "info");
      setTimeout(() => {
        dataRefreshService.updateDataSources();
        notificationService.showNotification("Data sources refreshed!", "success");
      }, 1000);
    },
  };

  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .notification-content { display: flex; align-items: center; gap: 10px; }
        .ar-active { text-align: center; color: rgba(255, 255, 255, 0.9); }
        .ar-video-wrap {
            position: relative;
            width: 100%;
            max-width: 720px;
            margin: 0 auto 16px;
            aspect-ratio: 16 / 9;
            background: rgba(0, 0, 0, 0.45);
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .ar-video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .ar-active i { font-size: 4rem; color: #22c55e; margin-bottom: 16px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .ar-stop-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: none;
            color: #ffffff;
            padding: 16px 32px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            font-size: 1.1rem;
            margin-top: 20px;
        }
        .ar-stop-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4); }
    `;
  document.head.appendChild(style);

  window.RepairBridgeServices.notification = notificationService;
  window.RepairBridgeServices.cart = cartService;
  window.RepairBridgeServices.navigation = navigationService;
  window.RepairBridgeServices.interaction = interactionService;
  window.RepairBridgeServices.dataRefresh = dataRefreshService;
  window.RepairBridgeServices.marketplace = marketplaceService;
  window.RepairBridgeServices.compliance = complianceService;
  window.RepairBridgeServices.voice = voiceService;
  window.RepairBridgeServices.competitive = competitiveService;
  window.RepairBridgeServices.section = sectionService;
  window.RepairBridgeServices.legacyActions = legacyActionService;
})();
