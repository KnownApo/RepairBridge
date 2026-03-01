(() => {
  window.RepairBridgeServices = window.RepairBridgeServices || {};

  const cameraService = (() => {
    let activeStream = null;

    async function startCamera(videoEl, options = {}) {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access not supported");
      }

      const facingMode = options.facingMode || "environment";
      const constraints = {
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      };

      activeStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoEl) {
        videoEl.srcObject = activeStream;
      }

      return activeStream;
    }

    function stopCamera(stream = activeStream) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (stream === activeStream) {
        activeStream = null;
      }
    }

    function getActiveStream() {
      return activeStream;
    }

    return {
      startCamera,
      stopCamera,
      getActiveStream,
    };
  })();

  window.RepairBridgeServices.camera = cameraService;
})();
