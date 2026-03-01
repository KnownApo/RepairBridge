/**
 * Vehicle Data Adapter Layer
 * Provides a pluggable interface for VIN decoding + recall/complaint/TSB lookups.
 *
 * Adapter shape:
 * {
 *   id: 'nhtsa',
 *   name: 'NHTSA vPIC',
 *   priority: 10,
 *   isAvailable?: async (context) => boolean,
 *   decodeVin: async (vin) => vinData,
 *   getRecalls: async (vinData) => [],
 *   getComplaints: async (vinData) => [],
 *   getTsbs: async (vinData) => [] | null,
 *   getMakes: async ({ query }) => [],
 *   getModelsForMake: async (make) => [],
 *   getVehicleMatches: async ({ query, make }) => []
 * }
 */

const RepairBridgeDataAdapters = (() => {
    const adapters = [];

    function normalizeAdapter(adapter = {}) {
        if (!adapter || typeof adapter !== 'object') {
            throw new Error('Data adapter must be an object');
        }
        const { id, name } = adapter;
        if (!id || !name) throw new Error('Data adapter requires id + name');
        return { priority: 100, ...adapter };
    }

    function registerAdapter(adapter) {
        const normalized = normalizeAdapter(adapter);
        const exists = adapters.find(item => item.id === normalized.id);
        if (exists) {
            console.warn(`Data adapter '${normalized.id}' already registered.`);
            return exists;
        }
        adapters.push(normalized);
        adapters.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
        return normalized;
    }

    function listAdapters() {
        return adapters.map(adapter => ({
            id: adapter.id,
            name: adapter.name,
            priority: adapter.priority ?? 100
        }));
    }

    async function isAdapterAvailable(adapter, context) {
        if (!adapter || typeof adapter.isAvailable !== 'function') return true;
        try {
            return await adapter.isAvailable(context);
        } catch (err) {
            console.warn(`Data adapter '${adapter.id}' availability check failed`, err);
            return false;
        }
    }

    async function callAdapter(method, args = [], context = {}) {
        const errors = [];
        for (const adapter of adapters) {
            if (!(await isAdapterAvailable(adapter, context))) continue;
            if (typeof adapter[method] !== 'function') continue;
            try {
                return await adapter[method](...args);
            } catch (err) {
                errors.push({ id: adapter.id, error: err });
                console.warn(`Data adapter '${adapter.id}' failed for ${method}`, err);
            }
        }
        if (errors.length) throw errors[errors.length - 1].error;
        throw new Error(`No data adapters available for ${method}`);
    }

    return {
        registerAdapter,
        listAdapters,
        decodeVin: vin => callAdapter('decodeVin', [vin], { vin }),
        getRecalls: vinData => callAdapter('getRecalls', [vinData], { vinData }),
        getComplaints: vinData => callAdapter('getComplaints', [vinData], { vinData }),
        getTsbs: vinData => callAdapter('getTsbs', [vinData], { vinData }),
        getMakes: (payload = {}) => callAdapter('getMakes', [payload], payload),
        getModelsForMake: make => callAdapter('getModelsForMake', [make], { make }),
        getVehicleMatches: payload => callAdapter('getVehicleMatches', [payload], payload)
    };
})();

// NHTSA adapter
RepairBridgeDataAdapters.registerAdapter({
    id: 'nhtsa',
    name: 'NHTSA vPIC + Recalls',
    priority: 10,
    isAvailable: () => {
        if (typeof RepairBridgeConfig === 'undefined') return false;
        return Boolean(RepairBridgeConfig.getEndpoint('vinDecodeBase'));
    },
    decodeVin: async (vin) => {
        const base = RepairBridgeConfig.getEndpoint('vinDecodeBase');
        const sanitized = String(vin).replace(/^\/+|\/+$/g, '');
        const cleanedBase = String(base || '').replace(/\/+$/g, '');
        const url = `${cleanedBase}/${encodeURIComponent(sanitized)}?format=json`;
        const data = await RepairBridgeAPI.getJson(url);
        const row = data?.Results?.[0] || {};
        return {
            vin,
            make: row.Make || 'Unknown',
            model: row.Model || 'Unknown',
            year: row.ModelYear || 'Unknown',
            trim: row.Trim || row.Series || '—',
            body: row.BodyClass || '—',
            engine: row.EngineModel || row.EngineCylinders || '—'
        };
    },
    getRecalls: async (vinData) => {
        if (!vinData || vinData.make === 'Unknown') return [];
        const url = buildVehicleQueryUrl('recallsBase', vinData);
        const data = await RepairBridgeAPI.getJson(url);
        return data?.results || [];
    },
    getComplaints: async (vinData) => {
        if (!vinData || vinData.make === 'Unknown') return [];
        const url = buildVehicleQueryUrl('complaintsBase', vinData);
        const data = await RepairBridgeAPI.getJson(url);
        return data?.results || [];
    },
    getTsbs: async (vinData) => {
        if (!vinData || vinData.make === 'Unknown') return null;
        const url = buildVehicleQueryUrl('tsbsBase', vinData);
        const data = await RepairBridgeAPI.getJson(url);
        return data?.results || [];
    },
    getMakes: async ({ query } = {}) => {
        const base = RepairBridgeConfig.getEndpoint('makesBase');
        const url = buildMakesUrl(base);
        const data = await RepairBridgeAPI.getJson(url, { ttlMs: 24 * 60 * 60 * 1000 });
        const list = Array.isArray(data?.Results) ? data.Results : [];
        if (!query) return list.slice(0, 10);
        const q = String(query).toLowerCase();
        return list.filter(item => item.Make_Name && item.Make_Name.toLowerCase().includes(q)).slice(0, 10);
    },
    getModelsForMake: async (make) => {
        if (!make) return [];
        const base = RepairBridgeConfig.getEndpoint('modelsForMakeBase');
        const sanitized = String(make || '').replace(/^\/+|\/+$/g, '');
        const cleanedBase = String(base || '').replace(/\/+$/g, '');
        const url = `${cleanedBase}/${encodeURIComponent(sanitized)}?format=json`;
        const data = await RepairBridgeAPI.getJson(url, { ttlMs: 12 * 60 * 60 * 1000 });
        return Array.isArray(data?.Results) ? data.Results : [];
    },
    getVehicleMatches: async ({ query, make }) => {
        const q = String(query || '').trim();
        if (!q) return [];

        let resolvedMake = make;
        let models = [];

        if (!resolvedMake || resolvedMake === 'All Makes') {
            const makeMatches = await RepairBridgeDataAdapters.getMakes({ query: q });
            if (!makeMatches.length) return [];
            const exact = makeMatches.find(item => item.Make_Name && item.Make_Name.toLowerCase() === q.toLowerCase());
            resolvedMake = exact?.Make_Name || makeMatches[0].Make_Name;
            models = await RepairBridgeDataAdapters.getModelsForMake(resolvedMake);
        } else {
            models = await RepairBridgeDataAdapters.getModelsForMake(resolvedMake);
        }

        const filteredModels = models.filter(item => {
            if (!q) return true;
            const modelName = item.Model_Name || '';
            return modelName.toLowerCase().includes(q.toLowerCase()) || resolvedMake.toLowerCase().includes(q.toLowerCase());
        });

        return (filteredModels.length ? filteredModels : models)
            .slice(0, 8)
            .map(item => ({
                vin: '—',
                make: resolvedMake,
                model: item.Model_Name || 'Model',
                year: '—',
                lastService: '—',
                status: 'Reference'
            }));
    }
});

// Mock adapter (offline/demo)
const mockVehicles = [
    { vin: '1FTFW1E50NFB12345', make: 'Ford', model: 'F-150', year: '2023', trim: 'XLT', body: 'Pickup', engine: '3.5L V6' },
    { vin: '4T1C11AK5NU123456', make: 'Toyota', model: 'Camry', year: '2022', trim: 'SE', body: 'Sedan', engine: '2.5L I4' },
    { vin: 'WBA3A5C59DF123456', make: 'BMW', model: '320i', year: '2023', trim: 'Base', body: 'Sedan', engine: '2.0L Turbo' }
];

RepairBridgeDataAdapters.registerAdapter({
    id: 'mock',
    name: 'Mock Vehicle Data',
    priority: 90,
    decodeVin: async (vin) => {
        const match = mockVehicles.find(item => item.vin.toUpperCase() === String(vin).toUpperCase());
        if (match) {
            return {
                vin: match.vin,
                make: match.make,
                model: match.model,
                year: match.year,
                trim: match.trim || '—',
                body: match.body || '—',
                engine: match.engine || '—'
            };
        }
        return { vin, make: 'Unknown', model: 'Unknown', year: 'Unknown', trim: '—', body: '—', engine: '—' };
    },
    getRecalls: async () => [],
    getComplaints: async () => [],
    getTsbs: async () => [],
    getMakes: async ({ query } = {}) => {
        const makes = Array.from(new Set(mockVehicles.map(item => item.make)));
        const list = makes.map(name => ({ Make_ID: null, Make_Name: name }));
        if (!query) return list.slice(0, 10);
        const q = String(query).toLowerCase();
        return list.filter(item => item.Make_Name.toLowerCase().includes(q)).slice(0, 10);
    },
    getModelsForMake: async (make) => {
        if (!make) return [];
        const models = mockVehicles.filter(item => item.make.toLowerCase() === String(make).toLowerCase())
            .map(item => ({ Make_Name: item.make, Model_Name: item.model }));
        return models;
    },
    getVehicleMatches: async ({ query, make }) => {
        const q = String(query || '').toLowerCase();
        let matches = mockVehicles;
        if (make && make !== 'All Makes') {
            matches = matches.filter(item => item.make.toLowerCase() === String(make).toLowerCase());
        }
        if (q) {
            matches = matches.filter(item => item.make.toLowerCase().includes(q) || item.model.toLowerCase().includes(q));
        }
        return matches.slice(0, 8).map(item => ({
            vin: item.vin,
            make: item.make,
            model: item.model,
            year: item.year,
            lastService: '—',
            status: 'Reference'
        }));
    }
});

function buildMakesUrl(base) {
    try {
        const url = new URL(base);
        url.searchParams.set('format', 'json');
        return url.toString();
    } catch (err) {
        const joiner = String(base).includes('?') ? '&' : '?';
        return `${base}${joiner}format=json`;
    }
}

function buildVehicleQueryUrl(endpointName, vinData) {
    const base = RepairBridgeConfig.getEndpoint(endpointName);
    const { make, model, year } = vinData || {};
    try {
        const url = new URL(base);
        url.searchParams.set('make', make);
        url.searchParams.set('model', model);
        url.searchParams.set('modelYear', year);
        return url.toString();
    } catch (err) {
        const params = `make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
        const joiner = String(base).includes('?') ? '&' : '?';
        return `${base}${joiner}${params}`;
    }
}

window.RepairBridgeDataAdapters = RepairBridgeDataAdapters;
