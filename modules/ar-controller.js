(() => {
  window.RepairBridgeServices = window.RepairBridgeServices || {};

  const arController = (() => {
    let arVideoEl = null;

    function getNotificationService() {
      return window.RepairBridgeServices?.notification;
    }

    function getCameraService() {
      return window.RepairBridgeServices?.camera;
    }

    function getARContainer() {
      return document.getElementById("ar-viewport") || document.querySelector(".ar-placeholder");
    }

    function renderARPlaceholder(container) {
      if (!container) return;
      container.innerHTML = `
                <i class="fas fa-camera"></i>
                <h3>AR Camera View</h3>
                <p>Position camera toward vehicle component</p>
                <button type="button" class="action-btn" onclick="toggleAR()" id="ar-toggle">
                    <i class="fas fa-play"></i>
                    Start AR Session
                </button>
            `;
    }

    function renderARActive(container) {
      if (!container) return;
      container.innerHTML = `
                <div class="ar-active">
                    <div class="ar-video-wrap">
                        <video class="ar-video" autoplay playsinline muted></video>
                    </div>
                    <h3>AR Session Active</h3>
                    <p>Point camera at vehicle component</p>
                    <button type="button" class="ar-stop-btn" onclick="toggleAR()" id="ar-toggle">
                        <i class="fas fa-stop"></i>
                        Stop Session
                    </button>
                </div>
            `;
      arVideoEl = container.querySelector("video");
    }

    async function startARSession() {
      const container = getARContainer();
      const status = document.getElementById("ar-status");
      const notificationService = getNotificationService();
      const cameraService = getCameraService();

      if (!container) {
        notificationService?.showNotification("AR UI elements missing", "warning");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        notificationService?.showNotification(
          "Camera access not supported in this browser",
          "error"
        );
        return;
      }

      if (!cameraService?.startCamera) {
        notificationService?.showNotification("Camera service unavailable", "error");
        return;
      }

      notificationService?.showNotification("Requesting camera access...", "info");
      renderARActive(container);

      try {
        await cameraService.startCamera(arVideoEl, { facingMode: "environment" });

        if (status) {
          status.textContent = "Active";
          status.className = "status-badge active";
        }

        if (typeof RepairBridgeState !== "undefined") {
          RepairBridgeState.setState({ isARActive: true });
        }

        notificationService?.showNotification("AR session started successfully", "success");
      } catch (error) {
        console.error("Camera access error:", error);
        renderARPlaceholder(container);
        if (status) {
          status.textContent = "Ready";
          status.className = "status-badge active";
        }
        if (typeof RepairBridgeState !== "undefined") {
          RepairBridgeState.setState({ isARActive: false });
        }
        notificationService?.showNotification("Camera access denied or unavailable", "error");
      }
    }

    function stopARSession() {
      const container = getARContainer();
      const status = document.getElementById("ar-status");
      const notificationService = getNotificationService();
      const cameraService = getCameraService();

      if (cameraService?.stopCamera) {
        cameraService.stopCamera();
      }

      arVideoEl = null;
      renderARPlaceholder(container);

      if (status) {
        status.textContent = "Ready";
        status.className = "status-badge active";
      }

      if (typeof RepairBridgeState !== "undefined") {
        RepairBridgeState.setState({ isARActive: false });
      }

      notificationService?.showNotification("AR session stopped", "info");
    }

    function toggleAROverlay(overlayType, enabled) {
      const notificationService = getNotificationService();
      const action = enabled ? "enabled" : "disabled";
      notificationService?.showNotification(`${overlayType} overlay ${action}`, "info");
    }

    function initializeARControls() {
      const arStartButton = document.querySelector(".ar-start-btn");
      const toggleSwitches = document.querySelectorAll(".toggle-switch input");

      if (arStartButton) {
        arStartButton.addEventListener("click", function () {
          startARSession();
        });
      }

      toggleSwitches.forEach((toggle) => {
        toggle.addEventListener("change", function () {
          const overlayType = this.parentElement.textContent.trim();
          toggleAROverlay(overlayType, this.checked);
        });
      });
    }

    function toggleAR() {
      const isActive =
        typeof RepairBridgeState !== "undefined"
          ? Boolean(RepairBridgeState.getState().isARActive)
          : false;
      if (!isActive) {
        startARSession();
      } else {
        stopARSession();
      }
    }

    return {
      initializeARControls,
      startARSession,
      stopARSession,
      toggleAROverlay,
      toggleAR,
    };
  })();

  window.RepairBridgeServices.ar = arController;
})();
