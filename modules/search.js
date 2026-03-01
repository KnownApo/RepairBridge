/**
 * Search Functionality
 * Handles vehicle data search and filtering
 */

function getLastVinReport() {
  if (typeof RepairBridgeState !== "undefined") {
    return RepairBridgeState.getState().lastVinReport;
  }
  return null;
}

function setLastVinReport(report) {
  if (typeof RepairBridgeState !== "undefined") {
    RepairBridgeState.setState({ lastVinReport: report });
  }
}

function initializeSearch() {
  const searchButton =
    document.querySelector(".search-btn") || document.getElementById("search-btn");
  const searchInput =
    document.querySelector(".search-input") || document.getElementById("vehicle-search");
  const searchSelect =
    document.querySelector(".search-select") || document.getElementById("make-filter");

  renderSearchEmptyState();

  if (searchButton) {
    searchButton.addEventListener("click", function () {
      const query = searchInput ? searchInput.value.trim() : "";
      const make = searchSelect ? searchSelect.value : "All Makes";

      if (query) {
        performVehicleSearch(query, make);
      } else {
        showNotification("Please enter a VIN or License Plate", "warning");
      }
    });
  }

  // Enable search on Enter key
  if (searchInput && searchButton) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchButton.click();
      }
    });
  }
}

function renderSearchEmptyState() {
  const container = document.getElementById("search-results");
  if (!container || container.innerHTML.trim()) return;
  container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🔎</div>
            <h4>Run a VIN search to get started</h4>
            <p>Enter a VIN to pull recalls, complaints, and TSB highlights.</p>
        </div>
    `;
}

function setSearchLoading(isLoading, label = "Searching...") {
  const container = document.getElementById("search-results");
  const searchButton =
    document.querySelector(".search-btn") || document.getElementById("search-btn");

  if (searchButton) {
    if (!searchButton.dataset.defaultLabel) {
      searchButton.dataset.defaultLabel = searchButton.innerHTML;
    }
    if (isLoading) {
      searchButton.classList.add("is-loading");
      searchButton.disabled = true;
      searchButton.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span>${label}`;
    } else {
      searchButton.classList.remove("is-loading");
      searchButton.disabled = false;
      searchButton.innerHTML = searchButton.dataset.defaultLabel;
    }
  }

  if (container) {
    if (isLoading) {
      container.classList.add("is-loading");
      container.innerHTML = `
                <div class="search-loading" role="status" aria-live="polite">
                    <div class="spinner" aria-hidden="true"></div>
                    <div>
                        <h4>Searching vehicle data</h4>
                        <p>Pulling VIN details, recalls, complaints, and TSBs.</p>
                    </div>
                </div>
            `;
    } else {
      container.classList.remove("is-loading");
    }
  }
}

/**
 * Performs vehicle search
 * @param {string} query - Search query (VIN or license plate)
 * @param {string} make - Vehicle make filter
 */
async function performVehicleSearch(query, make) {
  const isVin = query.replace(/[^A-Za-z0-9]/g, "").length >= 11;
  setSearchLoading(true, isVin ? "Searching VIN..." : "Searching...");
  showNotification("Searching vehicle database...", "info");

  try {
    if (isVin) {
      const vin = query.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      const vinData = await fetchVinData(vin);
      const recalls = await fetchRecalls(vinData);
      const complaints = await fetchComplaints(vinData);
      const tsbs = await fetchTsbs(vinData);
      displayVinResults(vinData, recalls, complaints, tsbs);
      return;
    }

    const results = await fetchVehicleMatches(query, make);
    displaySearchResults(results);
    if (!results.length) {
      showNotification("No matching vehicles found.", "warning");
    } else {
      showNotification(`Found ${results.length} matching vehicles`, "success");
    }
  } finally {
    setSearchLoading(false);
  }
}

async function fetchMakeMatches(query) {
  if (!window.RepairBridgeDataAdapters) return [];
  return RepairBridgeDataAdapters.getMakes({ query });
}

async function fetchModelsForMake(make) {
  if (!window.RepairBridgeDataAdapters) return [];
  return RepairBridgeDataAdapters.getModelsForMake(make);
}

async function fetchVehicleMatches(query, make) {
  const q = query.trim();
  if (!q) return [];

  let resolvedMake = make;
  let models = [];

  if (!resolvedMake || resolvedMake === "All Makes") {
    const makeMatches = await fetchMakeMatches(q);
    if (!makeMatches.length) return [];
    const exact = makeMatches.find(
      (item) => item.Make_Name && item.Make_Name.toLowerCase() === q.toLowerCase()
    );
    resolvedMake = exact?.Make_Name || makeMatches[0].Make_Name;
    models = await fetchModelsForMake(resolvedMake);
  } else {
    models = await fetchModelsForMake(resolvedMake);
  }

  const filteredModels = models.filter((item) => {
    if (!q) return true;
    const modelName = item.Model_Name || "";
    return (
      modelName.toLowerCase().includes(q.toLowerCase()) ||
      resolvedMake.toLowerCase().includes(q.toLowerCase())
    );
  });

  const results = (filteredModels.length ? filteredModels : models).slice(0, 8).map((item) => ({
    vin: "—",
    make: resolvedMake,
    model: item.Model_Name || "Model",
    year: "—",
    lastService: "—",
    status: "Reference",
  }));

  return results;
}

/**
 * Displays search results
 * @param {Array} results - Search results to display
 */
function displaySearchResults(results) {
  const container = document.getElementById("search-results");
  if (!container) return;

  let html = '<h4 style="color: white; margin-bottom: 16px;">Search Results:</h4>';

  results.forEach((result) => {
    const year = result.year && result.year !== "Unknown" ? result.year : "—";
    const make = result.make || "Unknown";
    const model = result.model || "—";
    const title = `${year} ${make} ${model}`.replace(/\s+/g, " ").trim();
    const vin = result.vin || "—";
    const lastService = result.lastService || "—";
    const status = result.status || "Unknown";
    html += `
            <div class="result-item">
                <div class="result-info">
                    <h4>${title}</h4>
                    <p>VIN: ${vin}</p>
                    <p>Last Service: ${lastService}</p>
                </div>
                <div class="result-status ${status.toLowerCase().replace(" ", "-")}">
                    ${status}
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
}

async function fetchVinData(vin) {
  if (!window.RepairBridgeDataAdapters) {
    showNotification("Vehicle data adapters not loaded.", "warning");
    return {
      vin,
      make: "Unknown",
      model: "Unknown",
      year: "Unknown",
      trim: "—",
      body: "—",
      engine: "—",
    };
  }

  try {
    return await RepairBridgeDataAdapters.decodeVin(vin);
  } catch (err) {
    console.warn("VIN decode failed", err);
    showNotification("VIN lookup failed. Please try again.", "error");
    return {
      vin,
      make: "Unknown",
      model: "Unknown",
      year: "Unknown",
      trim: "—",
      body: "—",
      engine: "—",
    };
  }
}

async function fetchRecalls(vinData) {
  if (!vinData || vinData.make === "Unknown") return [];
  if (!window.RepairBridgeDataAdapters) return [];
  try {
    return await RepairBridgeDataAdapters.getRecalls(vinData);
  } catch (err) {
    console.warn("Recall fetch failed", err);
    showNotification("Recall data unavailable.", "warning");
    return [];
  }
}

async function fetchComplaints(vinData) {
  if (!vinData || vinData.make === "Unknown") return [];
  if (!window.RepairBridgeDataAdapters) return [];
  try {
    return await RepairBridgeDataAdapters.getComplaints(vinData);
  } catch (err) {
    console.warn("Complaints fetch failed", err);
    showNotification("Complaint data unavailable.", "warning");
    return [];
  }
}

async function fetchTsbs(vinData) {
  if (!vinData || vinData.make === "Unknown") return null;
  if (!window.RepairBridgeDataAdapters) return null;
  try {
    return await RepairBridgeDataAdapters.getTsbs(vinData);
  } catch (err) {
    console.warn("TSB fetch failed", err);
    showNotification("TSB data unavailable.", "warning");
    return null; // null indicates unavailable
  }
}

function displayVinResults(vinData, recalls, complaints, tsbs) {
  const container = document.getElementById("search-results");
  if (!container) return;

  const recallCount = recalls.length;
  const complaintCount = complaints.length;
  const tsbCount = Array.isArray(tsbs) ? tsbs.length : null;

  const recallList =
    recalls
      .slice(0, 5)
      .map((r) => `<li>${r.Component || "Recall"} — ${r.Summary || "Details available"}</li>`)
      .join("") || "<li>No recalls found</li>";

  const complaintList =
    complaints
      .slice(0, 5)
      .map((c) => `<li>${c.Component || "Complaint"} — ${c.Summary || "Details available"}</li>`)
      .join("") || "<li>No complaints found</li>";

  const tsbList = Array.isArray(tsbs)
    ? tsbs
        .slice(0, 5)
        .map((t) => `<li>${t.Component || "TSB"} — ${t.Summary || "Details available"}</li>`)
        .join("") || "<li>No TSBs found</li>"
    : "<li>TSB data unavailable (no free public endpoint)</li>";

  container.innerHTML = `
        <div class="source-item">
            <span>🚗 ${vinData.year} ${vinData.make} ${vinData.model}</span>
            <small>VIN: ${vinData.vin} • Trim: ${vinData.trim}</small>
        </div>
        <div class="source-item">
            <span>Body: ${vinData.body}</span>
            <small>Engine: ${vinData.engine}</small>
        </div>
        <div class="source-item">
            <span>Recalls: ${recallCount}</span>
            <small>Complaints: ${complaintCount}${tsbCount !== null ? ` • TSBs: ${tsbCount}` : ""}</small>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Top Recalls</h4>
            <ul style="color:#fff; padding-left:18px;">${recallList}</ul>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Top Complaints</h4>
            <ul style="color:#fff; padding-left:18px;">${complaintList}</ul>
        </div>
        <div class="widget" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">TSB Bulletins (best effort)</h4>
            <ul style="color:#fff; padding-left:18px;">${tsbList}</ul>
        </div>
        <div class="widget tsb-fallback" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">TSB Fallback (manual)</h4>
            <p class="widget-note">Paste a TSB link or upload a PDF to attach to this report.</p>
            <div class="tsb-fallback-controls">
                <input type="url" id="tsb-fallback-link" class="search-input" placeholder="TSB link (PDF, OEM portal, etc.)">
                <input type="file" id="tsb-fallback-file" class="search-input" accept=".pdf">
                <button type="button" class="action-btn" onclick="saveTsbFallback()">💾 Save TSB</button>
            </div>
            <ul id="tsb-fallback-list" class="report-list"></ul>
        </div>
        <div class="widget" id="labor-estimate-panel" style="margin-top:16px;">
            <h4 style="color:#fff;margin-bottom:8px;">Repair Estimate</h4>
            <div class="labor-estimate-controls">
                <input type="text" id="labor-procedure" class="search-input" placeholder="Procedure (e.g., front brake pads)">
                <input type="number" id="labor-rate" class="search-input" placeholder="Labor rate (USD/hr)">
                <input type="text" id="labor-region" class="search-input" placeholder="Region (city/state)">
                <input type="number" id="labor-mileage" class="search-input" placeholder="Mileage">
                <button type="button" class="action-btn" onclick="refreshLaborEstimate()">🔄 Refresh estimate</button>
            </div>
            <p id="labor-estimate-status" style="color:#fff;">Checking connected labor estimate providers...</p>
            <ul id="labor-estimate-list" style="color:#fff; padding-left:18px;">
                <li>Labor hours: —</li>
                <li>Parts estimate: —</li>
                <li>Total estimate: —</li>
            </ul>
            <p id="labor-estimate-meta" class="widget-note"></p>
        </div>
        <button type="button" class="action-btn" style="margin-top:16px;" onclick="downloadVinReport()">⬇️ Download VIN Report (.txt)</button>
        <button type="button" class="action-btn" style="margin-top:10px;" onclick="downloadVinReportCSV()">⬇️ Download VIN Report (.csv)</button>
        <button type="button" class="action-btn" style="margin-top:10px;" onclick="downloadVinReportPDF()">⬇️ Download VIN Report (.pdf)</button>
    `;

  setLastVinReport({ vinData, recalls, complaints, tsbs, tsbFallbacks: [] });
  renderTsbFallbackList();
  saveSearchHistory(vinData, recallCount, complaintCount, tsbCount);
  loadLaborEstimatePanel(vinData);

  showNotification(
    `VIN lookup complete — ${recallCount} recalls, ${complaintCount} complaints`,
    "success"
  );
}

function getLaborInputs() {
  const procedure = document.getElementById("labor-procedure")?.value?.trim();
  const laborRateRaw = document.getElementById("labor-rate")?.value;
  const region = document.getElementById("labor-region")?.value?.trim();
  const mileageRaw = document.getElementById("labor-mileage")?.value;
  return {
    procedure: procedure || null,
    laborRate: laborRateRaw ? Number(laborRateRaw) : null,
    region: region || null,
    mileage: mileageRaw ? Number(mileageRaw) : null,
  };
}

function normalizeLaborInputs() {
  const inputs = getLaborInputs();
  const errors = [];

  if (inputs.laborRate !== null && (Number.isNaN(inputs.laborRate) || inputs.laborRate <= 0)) {
    errors.push("Labor rate must be a positive number.");
  }

  if (inputs.mileage !== null && (Number.isNaN(inputs.mileage) || inputs.mileage < 0)) {
    errors.push("Mileage must be a positive number.");
  }

  return { inputs, errors };
}

function ensureLaborDefaults() {
  const laborRateField = document.getElementById("labor-rate");
  if (laborRateField && !laborRateField.value) {
    laborRateField.value = "135";
  }
}

async function loadLaborEstimatePanel(vinData, overrides = {}) {
  const statusEl = document.getElementById("labor-estimate-status");
  const listEl = document.getElementById("labor-estimate-list");
  const metaEl = document.getElementById("labor-estimate-meta");

  if (!statusEl || !listEl) return;

  statusEl.textContent = "Checking connected labor estimate providers...";

  if (!window.RepairBridgeLabor) {
    statusEl.textContent = "Labor estimate adapters not loaded.";
    return;
  }

  ensureLaborDefaults();
  const { inputs, errors } = normalizeLaborInputs();
  if (errors.length) {
    statusEl.textContent = errors.join(" ");
    if (metaEl) metaEl.textContent = "";
    return;
  }

  const context = { ...inputs, ...overrides, vinData };

  try {
    const estimate = await RepairBridgeLabor.getEstimate(context);
    if (!estimate || estimate.status !== "ok") {
      statusEl.textContent = estimate?.reason || "No labor estimate providers connected.";
      if (metaEl) metaEl.textContent = "";
      return;
    }

    const currency = estimate.currency || "USD";
    const fmtCurrency = (value) => {
      if (value === null || value === undefined || value === "") return "—";
      if (typeof value === "string") return value;
      try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
      } catch (error) {
        console.warn("Currency formatting failed", error);
        return `$${value}`;
      }
    };

    const hoursText =
      estimate.laborHours !== undefined && estimate.laborHours !== null
        ? `${estimate.laborHours} hrs`
        : "—";
    const hoursRange = Array.isArray(estimate.laborHoursRange)
      ? `${estimate.laborHoursRange[0]}–${estimate.laborHoursRange[1]} hrs`
      : null;
    const partsRange = Array.isArray(estimate.partsEstimateRange)
      ? `${fmtCurrency(estimate.partsEstimateRange[0])}–${fmtCurrency(
          estimate.partsEstimateRange[1]
        )}`
      : null;

    listEl.innerHTML = `
            <li>Labor hours: ${hoursText}${hoursRange ? ` (range ${hoursRange})` : ""}</li>
            <li>Labor rate: ${estimate.laborRate ? fmtCurrency(estimate.laborRate) + "/hr" : "—"}</li>
            <li>Parts estimate: ${fmtCurrency(estimate.partsEstimate)}${partsRange ? ` (range ${partsRange})` : ""}</li>
            <li>Shop fees: ${fmtCurrency(estimate.miscFees)}</li>
            <li>Total estimate: ${fmtCurrency(estimate.totalEstimate)}</li>
            <li>Confidence: ${estimate.confidence || "—"}</li>
        `;

    const sources = Array.isArray(estimate.sourcesUsed) ? estimate.sourcesUsed.join(", ") : "";
    statusEl.textContent = `Source: ${estimate.providerName || estimate.provider || "Labor provider"}`;
    if (metaEl) {
      metaEl.textContent = [
        estimate.notes,
        estimate.timeToComplete,
        sources && `Signals: ${sources}`,
      ]
        .filter(Boolean)
        .join(" · ");
    }
  } catch (err) {
    console.warn("Labor estimate lookup failed", err);
    statusEl.textContent = "Labor estimate unavailable.";
    if (metaEl) metaEl.textContent = "";
  }
}

function refreshLaborEstimate() {
  const report = getLastVinReport();
  if (!report?.vinData) {
    showNotification("Run a VIN search first.", "warning");
    return;
  }
  const { inputs, errors } = normalizeLaborInputs();
  if (errors.length) {
    showNotification(errors.join(" "), "warning");
    return;
  }
  loadLaborEstimatePanel(report.vinData, inputs);
}

function getBackendBaseUrl() {
  if (typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.getEndpoint) {
    return RepairBridgeConfig.getEndpoint("backendBase");
  }
  return window.REPAIRBRIDGE_BACKEND_URL || "http://localhost:5050";
}

async function persistSearchHistory(entry, vinData) {
  const baseUrl = getBackendBaseUrl();
  if (!baseUrl) return;

  try {
    const session = window.RepairBridgeAuth?.getSession?.();
    await fetch(`${baseUrl}/api/v1/vin-lookups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vin: entry.vin,
        source: "frontend",
        payload: {
          title: entry.title,
          recalls: entry.recalls,
          complaints: entry.complaints,
          tsbs: entry.tsbs,
          searchedAt: entry.ts,
          make: vinData?.make,
          model: vinData?.model,
          year: vinData?.year,
          userId: session?.userId || null,
          shopId: session?.shopId || null,
        },
      }),
    });
  } catch (err) {
    console.warn("Search history persistence failed", err);
  }
}

function saveSearchHistory(vinData, recallCount, complaintCount, tsbCount) {
  const entry = {
    vin: vinData.vin,
    title: `${vinData.year} ${vinData.make} ${vinData.model}`,
    recalls: recallCount,
    complaints: complaintCount,
    tsbs: tsbCount,
    ts: Date.now(),
  };

  const history = JSON.parse(localStorage.getItem("rb_search_history") || "[]");
  const filtered = history.filter((h) => h.vin !== entry.vin);
  filtered.unshift(entry);
  localStorage.setItem("rb_search_history", JSON.stringify(filtered.slice(0, 10)));
  renderSearchHistory();
  persistSearchHistory(entry, vinData);
}

function loadSearchHistory() {
  renderSearchHistory();
}

function renderSearchHistory() {
  const container = document.getElementById("search-history");
  if (!container) return;

  const history = JSON.parse(localStorage.getItem("rb_search_history") || "[]");
  if (!history.length) {
    container.innerHTML =
      '<div class="activity-item"><span>No searches yet</span><small>Run a VIN lookup</small></div>';
    return;
  }

  container.innerHTML = history
    .map((item) => {
      const tsbText =
        item.tsbs === null || item.tsbs === undefined ? "TSBs: —" : `TSBs: ${item.tsbs}`;
      return `
            <div class="activity-item">
                <span>${item.title}</span>
                <small>VIN: ${item.vin} • Recalls: ${item.recalls} • Complaints: ${item.complaints} • ${tsbText}</small>
            </div>
        `;
    })
    .join("");
}

function renderTsbFallbackList() {
  const listEl = document.getElementById("tsb-fallback-list");
  if (!listEl) return;
  const items = getLastVinReport()?.tsbFallbacks || [];
  if (!items.length) {
    listEl.innerHTML = '<li class="report-empty">No manual TSBs added yet</li>';
    return;
  }
  listEl.innerHTML = items
    .map((item) => {
      const linkHtml = item.link
        ? `<a href="${item.link}" target="_blank" rel="noopener">${item.link}</a>`
        : "";
      const fileHtml = item.fileDataUrl
        ? `<a href="${item.fileDataUrl}" download="${item.fileName || "tsb.pdf"}">${item.fileName || "Attached PDF"}</a>`
        : item.fileName
          ? item.fileName
          : "";
      const detail = [linkHtml, fileHtml].filter(Boolean).join(" • ") || "Manual TSB attached";
      return `<li><strong>Manual TSB</strong><span>${detail}</span></li>`;
    })
    .join("");
}

function saveTsbFallback() {
  if (!getLastVinReport()) {
    showNotification("Run a VIN search first", "warning");
    return;
  }

  const linkEl = document.getElementById("tsb-fallback-link");
  const fileEl = document.getElementById("tsb-fallback-file");
  const link = linkEl ? linkEl.value.trim() : "";
  const file = fileEl?.files?.[0];

  if (!link && !file) {
    showNotification("Add a link or upload a PDF before saving.", "warning");
    return;
  }

  const fallback = {
    link: link || null,
    fileName: file ? file.name : null,
    fileDataUrl: null,
    addedAt: Date.now(),
  };

  const finalizeSave = () => {
    const report = getLastVinReport();
    if (!report) return;
    const list = report.tsbFallbacks || [];
    list.unshift(fallback);
    const nextReport = { ...report, tsbFallbacks: list.slice(0, 5) };
    setLastVinReport(nextReport);
    renderTsbFallbackList();
    if (linkEl) linkEl.value = "";
    if (fileEl) fileEl.value = "";
    showNotification("Manual TSB added to this report", "success");
  };

  if (file) {
    const maxBytes = 1500000;
    if (file.size > maxBytes) {
      showNotification(
        "TSB PDF is too large for local storage. Please use a link instead.",
        "warning"
      );
      if (!link) return;
      finalizeSave();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      fallback.fileDataUrl = reader.result;
      finalizeSave();
    };
    reader.onerror = () => {
      showNotification("Could not read the TSB file. Try uploading again.", "warning");
    };
    reader.readAsDataURL(file);
  } else {
    finalizeSave();
  }
}

function clearSearchHistory() {
  localStorage.removeItem("rb_search_history");
  renderSearchHistory();
  showNotification("Search history cleared", "info");
}

function searchVehicle() {
  const queryEl = document.getElementById("vehicle-search");
  const makeEl = document.getElementById("make-filter");
  const query = queryEl ? queryEl.value.trim() : "";
  const make = makeEl ? makeEl.value : "All Makes";

  if (!query) {
    showNotification("Please enter a VIN or License Plate", "warning");
    return;
  }

  performVehicleSearch(query, make);
}

// expose for inline onclick
window.initializeSearch = initializeSearch;
window.loadSearchHistory = loadSearchHistory;
window.searchVehicle = searchVehicle;
window.clearSearchHistory = clearSearchHistory;
window.saveTsbFallback = saveTsbFallback;
window.refreshLaborEstimate = refreshLaborEstimate;
