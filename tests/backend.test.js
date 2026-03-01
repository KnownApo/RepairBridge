const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const path = require("node:path");

const PORT = 5057;
const BASE_URL = `http://localhost:${PORT}`;

function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, "..", "backend", "server.js");
    const child = spawn("node", [serverPath], {
      env: { ...process.env, PORT: String(PORT) },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error("Backend failed to start"));
    }, 8000);

    const onReady = (data) => {
      const message = data.toString();
      if (message.includes("RepairBridge backend listening")) {
        clearTimeout(timeout);
        child.stdout.off("data", onReady);
        resolve(child);
      }
    };

    child.stdout.on("data", onReady);
    child.stderr.on("data", (data) => {
      const message = data.toString();
      if (message.toLowerCase().includes("error")) {
        // keep logging but don't fail immediately
      }
    });
  });
}

async function stopServer(child) {
  if (!child) return;
  child.kill();
}

test("labor estimates endpoint returns baseline payload", async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${BASE_URL}/api/v1/labor-estimates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vinData: { VIN: "1HGBH41JXMN109186" } }),
    });
    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.ok(payload.data);
    assert.equal(payload.data.currency, "USD");
    assert.ok(payload.data.totalEstimate >= 0);
  } finally {
    await stopServer(server);
  }
});

test("NHTSA endpoints validate required parameters", async () => {
  const server = await startServer();
  try {
    const response = await fetch(`${BASE_URL}/api/v1/nhtsa/recalls`);
    assert.equal(response.status, 400);
    const payload = await response.json();
    assert.ok(payload.error);
  } finally {
    await stopServer(server);
  }
});
