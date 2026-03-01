/**
 * Reports + Exports
 */

function getLastVinReport() {
  if (typeof RepairBridgeState !== "undefined") {
    return RepairBridgeState.getState().lastVinReport;
  }
  return null;
}

function downloadVinReport() {
  const payload = getLastVinReport();
  if (!payload) {
    showNotification("Run a VIN search first", "warning");
    return;
  }
  const { vinData, recalls, complaints, tsbs } = payload;

  const lines = [];
  lines.push(`RepairBridge VIN Report`);
  lines.push(`VIN: ${vinData.vin}`);
  lines.push(`Vehicle: ${vinData.year} ${vinData.make} ${vinData.model} (${vinData.trim})`);
  lines.push(`Body: ${vinData.body} | Engine: ${vinData.engine}`);
  lines.push("");
  lines.push(`Recalls (${recalls.length}):`);
  recalls.forEach((r) =>
    lines.push(`- ${r.Component || "Recall"}: ${r.Summary || "Details available"}`)
  );
  lines.push("");
  lines.push(`Complaints (${complaints.length}):`);
  complaints.forEach((c) =>
    lines.push(`- ${c.Component || "Complaint"}: ${c.Summary || "Details available"}`)
  );
  lines.push("");
  if (Array.isArray(tsbs)) {
    lines.push(`TSBs (${tsbs.length}):`);
    tsbs.forEach((t) =>
      lines.push(`- ${t.Component || "TSB"}: ${t.Summary || "Details available"}`)
    );
  } else {
    lines.push("TSBs: unavailable (no free public endpoint)");
  }

  const fallbackList = payload?.tsbFallbacks || [];
  if (fallbackList.length) {
    lines.push("");
    lines.push(`Manual TSBs (${fallbackList.length}):`);
    fallbackList.forEach((item) => {
      const detail =
        [item.link, item.fileName].filter(Boolean).join(" | ") || "Manual TSB attached";
      lines.push(`- ${detail}`);
    });
  }

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vin-report-${vinData.vin}.txt`;
  a.click();
  URL.revokeObjectURL(url);

  saveReportToHistory(
    vinData,
    recalls.length,
    complaints.length,
    Array.isArray(tsbs) ? tsbs.length : null
  );
}

function buildVinReportCsvLines(payload) {
  if (!payload) return [];
  const { vinData, recalls = [], complaints = [], tsbs } = payload;

  const rows = [];
  rows.push(["Type", "Component", "Summary"]);

  recalls.forEach((r) =>
    rows.push(["Recall", r.Component || "Recall", r.Summary || "Details available"])
  );
  complaints.forEach((c) =>
    rows.push(["Complaint", c.Component || "Complaint", c.Summary || "Details available"])
  );
  if (Array.isArray(tsbs)) {
    tsbs.forEach((t) => rows.push(["TSB", t.Component || "TSB", t.Summary || "Details available"]));
  } else {
    rows.push(["TSB", "Unavailable", "No free public endpoint"]);
  }

  const fallbackList = payload?.tsbFallbacks || [];
  fallbackList.forEach((item) => {
    const detail = [item.link, item.fileName].filter(Boolean).join(" | ") || "Manual TSB attached";
    rows.push(["Manual TSB", item.fileName || "Manual", detail]);
  });

  const vehicleBase = [vinData?.year, vinData?.make, vinData?.model].filter(Boolean).join(" ");
  const vehicle = vehicleBase ? `${vehicleBase}${vinData?.trim ? ` (${vinData.trim})` : ""}` : "";

  const meta = [
    ["VIN", vinData?.vin || ""],
    ["Vehicle", vehicle],
    ["Body", vinData?.body || ""],
    ["Engine", vinData?.engine || ""],
  ];

  const lines = [];
  meta.forEach(([k, v]) => lines.push(`${csvEscape(k)},${csvEscape(v)}`));
  lines.push("");
  rows.forEach((row) => lines.push(row.map(csvEscape).join(",")));

  return lines;
}

function downloadVinReportCSV() {
  const payload = getLastVinReport();
  if (!payload) {
    showNotification("Run a VIN search first", "warning");
    return;
  }

  const lines = buildVinReportCsvLines(payload);
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vin-report-${payload.vinData.vin}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadVinReportPDF() {
  const payload = getLastVinReport();
  if (!payload) {
    showNotification("Run a VIN search first", "warning");
    return;
  }
  const { vinData, recalls, complaints, tsbs } = payload;

  const tsbItems = Array.isArray(tsbs)
    ? tsbs
        .map((t) => `<li>${t.Component || "TSB"}: ${t.Summary || "Details available"}</li>`)
        .join("")
    : "<li>TSB data unavailable (no free public endpoint)</li>";

  const fallbackList = payload?.tsbFallbacks || [];
  const fallbackItems = fallbackList.length
    ? fallbackList
        .map((item) => {
          const detail =
            [item.link, item.fileName].filter(Boolean).join(" | ") || "Manual TSB attached";
          return `<li>${detail}</li>`;
        })
        .join("")
    : "<li>No manual TSBs attached</li>";

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showNotification("Pop-up blocked. Allow pop-ups to export PDF.", "warning");
    return;
  }

  const html = `
        <html>
        <head>
            <title>RepairBridge VIN Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
                h1 { margin-bottom: 8px; }
                h2 { margin-top: 24px; }
                .meta { margin-bottom: 16px; }
                .meta div { margin: 4px 0; }
                ul { padding-left: 18px; }
                .footer { margin-top: 24px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <h1>RepairBridge VIN Report</h1>
            <div class="meta">
                <div><strong>VIN:</strong> ${vinData.vin}</div>
                <div><strong>Vehicle:</strong> ${vinData.year} ${vinData.make} ${vinData.model} (${vinData.trim})</div>
                <div><strong>Body:</strong> ${vinData.body} | <strong>Engine:</strong> ${vinData.engine}</div>
                <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
            </div>
            <h2>Recalls (${recalls.length})</h2>
            <ul>${recalls.map((r) => `<li>${r.Component || "Recall"}: ${r.Summary || "Details available"}</li>`).join("") || "<li>No recalls found</li>"}</ul>
            <h2>Complaints (${complaints.length})</h2>
            <ul>${complaints.map((c) => `<li>${c.Component || "Complaint"}: ${c.Summary || "Details available"}</li>`).join("") || "<li>No complaints found</li>"}</ul>
            <h2>TSBs (${Array.isArray(tsbs) ? tsbs.length : "—"})</h2>
            <ul>${tsbItems}</ul>
            <h2>Manual TSBs (${fallbackList.length})</h2>
            <ul>${fallbackItems}</ul>
            <div class="footer">Data is provided for informational purposes only. Verify before making repair decisions.</div>
            <script>
                window.onload = () => {
                    window.print();
                };
            </script>
        </body>
        </html>
    `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const s = String(value).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}

function parseVinReportCsv(text) {
  const lines = text.split(/\r?\n/);
  const meta = {};
  const rows = [];
  let header = null;
  let inRows = false;

  lines.forEach((line) => {
    if (!line.trim()) {
      if (!inRows) inRows = true;
      return;
    }

    if (!inRows) {
      const [key, value] = parseCsvLine(line);
      if (key) meta[key] = value || "";
      return;
    }

    const parsed = parseCsvLine(line);
    if (!header) {
      header = parsed;
      return;
    }

    const entry = {};
    header.forEach((field, idx) => {
      if (field) entry[field] = parsed[idx] || "";
    });
    rows.push(entry);
  });

  return { meta, rows };
}

function saveReportToHistory(vinData, recallCount, complaintCount, tsbCount) {
  const lastReport = getLastVinReport();
  const report = {
    vin: vinData.vin,
    title: `${vinData.year} ${vinData.make} ${vinData.model}`,
    recalls: recallCount,
    complaints: complaintCount,
    tsbs: tsbCount,
    downloadedAt: Date.now(),
    details: {
      vinData: {
        vin: vinData.vin,
        year: vinData.year,
        make: vinData.make,
        model: vinData.model,
        trim: vinData.trim,
        body: vinData.body,
        engine: vinData.engine,
      },
      recalls: Array.isArray(lastReport?.recalls)
        ? lastReport.recalls.map((item) => ({
            component: item.Component || "Recall",
            summary: item.Summary || "Details available",
          }))
        : [],
      complaints: Array.isArray(lastReport?.complaints)
        ? lastReport.complaints.map((item) => ({
            component: item.Component || "Complaint",
            summary: item.Summary || "Details available",
          }))
        : [],
      tsbs: Array.isArray(lastReport?.tsbs)
        ? lastReport.tsbs.map((item) => ({
            component: item.Component || "TSB",
            summary: item.Summary || "Details available",
          }))
        : null,
      tsbFallbacks: Array.isArray(lastReport?.tsbFallbacks)
        ? lastReport.tsbFallbacks.map((item) => ({
            link: item.link || null,
            fileName: item.fileName || null,
            fileDataUrl: item.fileDataUrl || null,
            addedAt: item.addedAt || null,
          }))
        : [],
    },
  };
  const reports = JSON.parse(localStorage.getItem("rb_saved_reports") || "[]");
  const filtered = reports.filter((item) => item.vin !== report.vin);
  filtered.unshift(report);
  localStorage.setItem("rb_saved_reports", JSON.stringify(filtered.slice(0, 20)));
  renderSavedReports();
}

function loadSavedReports() {
  renderSavedReports();
}

function renderSavedReports() {
  const container = document.getElementById("saved-reports");
  if (!container) return;

  const reports = JSON.parse(localStorage.getItem("rb_saved_reports") || "[]");
  if (!reports.length) {
    container.innerHTML =
      '<div class="activity-item"><span>No saved reports yet</span><small>Download a VIN report to save it here</small></div>';
    return;
  }

  container.innerHTML = reports
    .map((report) => {
      const tsbText =
        report.tsbs === null || report.tsbs === undefined ? "TSBs: —" : `TSBs: ${report.tsbs}`;
      const savedAt = report.downloadedAt
        ? new Date(report.downloadedAt).toLocaleString()
        : "Just now";
      return `
            <div class="activity-item saved-report-item">
                <div class="saved-report-main">
                    <span>${report.title}</span>
                    <small>VIN: ${report.vin} • Recalls: ${report.recalls} • Complaints: ${report.complaints} • ${tsbText}</small>
                    <small>Saved: ${savedAt}</small>
                </div>
                <div class="saved-report-actions">
                    <button type="button" class="action-btn btn-small" onclick="openSavedReport('${report.vin}')">🧾 View</button>
                    <button type="button" class="action-btn btn-small" onclick="rerunSavedReport('${report.vin}')">🔁 Re-run</button>
                </div>
            </div>
        `;
    })
    .join("");
}

function rerunSavedReport(vin) {
  const input = document.getElementById("vehicle-search");
  const makeSelect = document.getElementById("make-filter");
  if (input) input.value = vin;
  if (typeof showSection === "function") {
    showSection("data-aggregator");
  }
  const make = makeSelect ? makeSelect.value : "All Makes";
  if (typeof performVehicleSearch === "function") {
    performVehicleSearch(vin, make);
  } else if (typeof searchVehicle === "function") {
    searchVehicle();
  }
}

function openSavedReport(vin) {
  const reports = JSON.parse(localStorage.getItem("rb_saved_reports") || "[]");
  const report = reports.find((item) => item.vin === vin);
  if (!report) {
    showNotification("Saved report not found", "warning");
    return;
  }

  window._rb_viewingVin = vin;
  renderSavedReportView(report);

  if (typeof showSection === "function") {
    showSection("report-view");
  }
}

function rerunViewedReport() {
  if (!window._rb_viewingVin) {
    showNotification("No saved report selected", "warning");
    return;
  }
  rerunSavedReport(window._rb_viewingVin);
}

function renderSavedReportView(report) {
  const titleEl = document.getElementById("report-view-title");
  const subtitleEl = document.getElementById("report-view-subtitle");
  const metaEl = document.getElementById("report-view-meta");
  const recallEl = document.getElementById("report-view-recalls");
  const complaintEl = document.getElementById("report-view-complaints");
  const tsbEl = document.getElementById("report-view-tsbs");
  const noteEl = document.getElementById("report-view-notes");

  if (titleEl) titleEl.textContent = `🧾 VIN Report - ${report.title}`;
  if (subtitleEl)
    subtitleEl.textContent = report.downloadedAt
      ? `Saved on ${new Date(report.downloadedAt).toLocaleString()}`
      : "Saved report details";

  const details = report.details || null;
  if (metaEl) {
    if (details?.vinData) {
      metaEl.innerHTML = `
                <div><strong>VIN:</strong> ${details.vinData.vin}</div>
                <div><strong>Vehicle:</strong> ${details.vinData.year} ${details.vinData.make} ${details.vinData.model} (${details.vinData.trim || "—"})</div>
                <div><strong>Body:</strong> ${details.vinData.body || "—"}</div>
                <div><strong>Engine:</strong> ${details.vinData.engine || "—"}</div>
            `;
    } else {
      metaEl.innerHTML = "<div>Full report details were not saved for this entry.</div>";
    }
  }

  const renderList = (items, container, emptyText) => {
    if (!container) return;
    if (!items || !items.length) {
      container.innerHTML = `<li class="report-empty">${emptyText}</li>`;
      return;
    }
    container.innerHTML = items
      .map(
        (item) => `
            <li>
                <strong>${item.component}</strong>
                <span>${item.summary}</span>
            </li>
        `
      )
      .join("");
  };

  renderList(
    details?.recalls || [],
    recallEl,
    details ? "No recalls recorded" : "Details unavailable. Re-run the report to refresh."
  );
  renderList(
    details?.complaints || [],
    complaintEl,
    details ? "No complaints recorded" : "Details unavailable. Re-run the report to refresh."
  );

  if (tsbEl) {
    if (!details) {
      tsbEl.innerHTML =
        '<li class="report-empty">Details unavailable. Re-run the report to refresh.</li>';
    } else if (details.tsbs === null) {
      tsbEl.innerHTML =
        '<li class="report-empty">TSB data unavailable (no free public endpoint).</li>';
    } else if (!details.tsbs.length) {
      tsbEl.innerHTML = '<li class="report-empty">No TSBs recorded</li>';
    } else {
      tsbEl.innerHTML = details.tsbs
        .map(
          (item) => `
                <li>
                    <strong>${item.component}</strong>
                    <span>${item.summary}</span>
                </li>
            `
        )
        .join("");
    }

    const fallbackItems = details?.tsbFallbacks || [];
    if (fallbackItems.length) {
      const fallbackHtml = fallbackItems
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
          return `
                    <li>
                        <strong>Manual TSB</strong>
                        <span>${detail}</span>
                    </li>
                `;
        })
        .join("");
      tsbEl.innerHTML += fallbackHtml;
    }
  }

  if (noteEl) {
    noteEl.textContent =
      "Data is provided for informational purposes only. Verify before making repair decisions.";
  }
}

function clearSavedReports() {
  localStorage.removeItem("rb_saved_reports");
  renderSavedReports();
  showNotification("Saved reports cleared", "info");
}

// expose for inline onclick
if (typeof window !== "undefined") {
  window.loadSavedReports = loadSavedReports;
  window.renderSavedReports = renderSavedReports;
  window.rerunSavedReport = rerunSavedReport;
  window.openSavedReport = openSavedReport;
  window.rerunViewedReport = rerunViewedReport;
  window.clearSavedReports = clearSavedReports;
}

/**
 * Exports transaction log
 */
function exportTransactionLog() {
  showNotification("Generating transaction log export...", "info");

  // Simulate export process
  setTimeout(() => {
    showNotification("Transaction log exported successfully", "success");
  }, 2000);
}

/**
 * Generates compliance report
 */
async function generateComplianceReport() {
  const baseUrl =
    typeof RepairBridgeConfig !== "undefined" && RepairBridgeConfig.getEndpoint
      ? RepairBridgeConfig.getEndpoint("backendBase")
      : window.REPAIRBRIDGE_BACKEND_URL || "http://localhost:5050";

  try {
    const res = await fetch(`${baseUrl}/api/v1/compliance/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ summary: "Compliance report generated" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    showNotification("Compliance report generated successfully", "success");
  } catch (error) {
    console.warn("Compliance report generation failed:", error);
    showNotification("Compliance report service unavailable", "warning");
  }
}

// expose for inline onclick
if (typeof window !== "undefined") {
  window.downloadVinReport = downloadVinReport;
  window.downloadVinReportCSV = downloadVinReportCSV;
  window.downloadVinReportPDF = downloadVinReportPDF;
}

if (typeof module !== "undefined") {
  module.exports = {
    csvEscape,
    buildVinReportCsvLines,
    parseVinReportCsv,
    parseCsvLine,
  };
}
