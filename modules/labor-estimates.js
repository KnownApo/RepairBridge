/**
 * Labor Estimate Provider Adapter Interface
 *
 * Adapter shape:
 * {
 *   id: 'provider-id',
 *   name: 'Provider Name',
 *   priority: 100, // lower = preferred
 *   isAvailable?: async () => boolean,
 *   getEstimate: async ({ vinData, procedure, region, laborRate }) => ({
 *     laborHours: number,
 *     partsEstimate: number,
 *     totalEstimate: number,
 *     currency: 'USD',
 *     notes?: string,
 *     sourceUrl?: string,
 *     confidence?: 'low'|'medium'|'high'
 *   })
 * }
 */

const RepairBridgeLabor = (() => {
    const adapters = [];

    function normalizeAdapter(adapter = {}) {
        if (!adapter || typeof adapter !== 'object') {
            throw new Error('Labor adapter must be an object');
        }
        const { id, name, getEstimate } = adapter;
        if (!id || !name) {
            throw new Error('Labor adapter requires id and name');
        }
        if (typeof getEstimate !== 'function') {
            throw new Error(`Labor adapter ${id} must define getEstimate()`);
        }
        return {
            priority: 100,
            ...adapter
        };
    }

    function registerAdapter(adapter) {
        const normalized = normalizeAdapter(adapter);
        const exists = adapters.find(item => item.id === normalized.id);
        if (exists) {
            console.warn(`Labor adapter '${normalized.id}' already registered.`);
            return;
        }
        adapters.push(normalized);
        adapters.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
    }

    function listAdapters() {
        return adapters.map(adapter => ({
            id: adapter.id,
            name: adapter.name,
            priority: adapter.priority ?? 100
        }));
    }

    function hasAdapters() {
        return adapters.length > 0;
    }

    async function getEstimate(context = {}) {
        if (!adapters.length) {
            return { status: 'unavailable', reason: 'No labor estimate adapters registered.' };
        }

        let lastError = null;
        for (const adapter of adapters) {
            try {
                if (typeof adapter.isAvailable === 'function') {
                    const available = await adapter.isAvailable(context);
                    if (!available) continue;
                }
                const estimate = await adapter.getEstimate(context);
                if (!estimate) continue;
                return {
                    status: 'ok',
                    provider: adapter.id,
                    providerName: adapter.name,
                    ...estimate
                };
            } catch (err) {
                lastError = err;
                console.warn(`Labor adapter '${adapter.id}' failed`, err);
            }
        }

        return {
            status: 'unavailable',
            reason: 'No labor estimate providers returned data.',
            lastError: lastError ? String(lastError) : undefined
        };
    }

    return {
        registerAdapter,
        listAdapters,
        hasAdapters,
        getEstimate
    };
})();

window.RepairBridgeLabor = RepairBridgeLabor;
