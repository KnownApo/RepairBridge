# RepairBridge - Vehicle Data Management Platform

A comprehensive data-access and management platform designed to bridge the gap between independent mechanics and OEM vehicle data, empowering shops with legally accessible, aggregated vehicle information, tools, and workflows.
## 🚗 Overview

RepairBridge is a modern web application that provides independent auto repair shops with:

- **Data Aggregation**: Access to multiple OEM data feeds through right-to-repair access points
- **AR-Powered Diagnostics**: Augmented reality overlays for live vehicle inspections
- **Subscription Management**: Unified access to multiple automaker databases
- **Compliance & Security**: Secure data vault with full compliance logging
- **Marketplace Integration**: Tools, training, and certifications with group discounts

## 🎯 Target Audience

- **Primary**: Independent auto repair shops (1-5 bays) and rural service centers
- **Secondary**: Vehicle owners seeking transparency and affordable non-dealer repairs

## 💰 Business Model

- **Shop Subscriptions**: Tiered monthly plans based on data volume and coverage
- **AR Diagnostics Module**: Premium add-on for enhanced diagnostic capabilities
- **Marketplace Commissions**: Revenue share from tools and certifications

## 🛠️ Features

### Data Aggregator
- Real-time access to Ford, GM, Toyota, BMW, and other OEM databases
- Automated data synchronization and processing
- Advanced search capabilities by VIN or license plate
- Data usage analytics and quota management

### AR Diagnostics Assistant
- Live camera feed with augmented reality overlays
- Real-time vehicle data streaming
- Diagnostic history and report generation
- Interactive diagnostic controls

### Marketplace
- Curated selection of professional tools
- Training courses and certifications
- Group discount negotiations
- Secure payment processing

### Compliance & Security
- AES-256 encryption for all data
- Complete transaction logging
- Automated compliance reporting
- Regular security audits

## 🎨 Design Features

- **Modern Glassmorphism UI**: Frosted glass effects with subtle transparency
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Animated Gradients**: Dynamic background with smooth color transitions
- **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions
- **Professional Typography**: Clean, readable fonts with optimal hierarchy

## 📱 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with Flexbox/Grid, Glassmorphism effects
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Inter font family for optimal readability
- **Animations**: CSS animations and transitions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (for local development)

### Installation

1. Clone or download the project files
2. Open `index.html` in a web browser
3. For local development, serve files through a local web server (recommended)
   - Quick dev server: `npm run dev` (uses `http-server` on port 8080)
   - Or: `python -m http.server 8080`

**Note:** older prototype pages are kept under `/prototypes`.

### Backend (API skeleton)

A lightweight Express + SQLite backend lives in `backend/` for future integration.

```bash
cd backend
npm install
npm run dev
```

- Health check: `GET http://localhost:5050/health`
- Example endpoints: `/api/v1/users`, `/api/v1/shops`, `/api/v1/vin-lookups`, `/api/v1/reports`
- Configure `PORT` or `CORS_ORIGIN` via `.env` (see `.env.example`).

## 📜 Policies (Draft)
- [Privacy Policy](PRIVACY.md)
- [Terms of Service](TERMS.md)

### File Structure
```
RepairBridge/
├── index.html              # Main application layout (canonical entry)
├── styles.css              # Core styles and animations
├── enhanced-styles.css     # Additional styling experiments
├── layout-fix.css          # Layout adjustments
├── script.js               # Main JavaScript logic
├── prototypes/             # Archived prototype pages and scripts
├── modules/                # Active JavaScript modules
├── modules/unused/         # Archived/unused modules (see modules/unused/README.md)
├── src/                    # Source utilities and assets
├── data/                   # Sample dataset files
└── README.md               # Project documentation
```

## 📋 Features Walkthrough

### Dashboard
- Real-time statistics and KPIs
- Recent activity feed
- Quick action buttons
- System status indicators

### Data Hub
- OEM data source management
- Connection status monitoring
- Data analytics and usage tracking
- Advanced vehicle search

### AR Diagnostics
- Virtual camera interface
- Live data stream display
- Diagnostic history tracking
- Overlay control toggles

### Marketplace
- Category-based product filtering
- Discount pricing display
- Shopping cart functionality
- Group purchasing benefits

### Compliance
- Security status monitoring
- Transaction log management
- Compliance tool access
- Audit trail maintenance

## 🔧 Customization

### Data
- Demo data lives in `data/repairbridge.json`
- Update stats, sources, marketplace items, inventory, analytics, and account values there
- Compliance/security data is served from the backend (`/api/v1/compliance`).

### Styling
- Colors can be modified in the CSS custom properties
- Glassmorphism effects can be adjusted in the `.app-container` class
- Animation timing can be modified in the keyframes

### Content
- Product listings in the marketplace section
- Data source connections in the data aggregator
- Diagnostic templates in the AR section

### Functionality
- Search algorithms can be enhanced in `script.js`
- Data refresh intervals can be adjusted
- Notification system can be extended

### API Endpoints
- VIN/recall/complaint/TSB endpoints are configurable via `modules/config.js`
- Override endpoints in the browser console with:
  ```js
  RepairBridgeConfig.setEndpoints({
    vinDecodeBase: 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended',
    recallsBase: 'https://api.nhtsa.gov/recalls/recallsByVehicle',
    complaintsBase: 'https://api.nhtsa.gov/complaints/complaintsByVehicle',
    tsbsBase: 'https://api.nhtsa.gov/tsbs/tsbsByVehicle'
  })
  ```
- Reset to defaults with `RepairBridgeConfig.resetEndpoints()`

## 🔌 API Usage & Rate Limits

RepairBridge ships with a lightweight API wrapper (`modules/api.js`) that adds in-memory caching and client-side rate limiting.

**Core methods**
- `RepairBridgeAPI.getJson(url, options)`
- `RepairBridgeAPI.getText(url, options)`

**Options**
- `ttlMs` (default `300000`): cache time-to-live in ms (set `0` to disable caching)
- `cacheKey`: override cache key (defaults to the URL)
- `fetchOptions`: passed directly to `fetch` (default `{ cache: 'no-store' }`)
- `rateLimitMs`: per-request min interval override (ms)

**Rate limit defaults**
- `minIntervalMs: 350` (≈2.8 req/sec)
- `maxConcurrent: 1`

Update/read the global limiter:
```js
RepairBridgeAPI.setRateLimit({ minIntervalMs: 500, maxConcurrent: 2 })
RepairBridgeAPI.getRateLimit()
```

**Examples**
```js
// Fetch VIN data with 10 min cache
const data = await RepairBridgeAPI.getJson(url, { ttlMs: 600000 })

// Override per-request rate limit
await RepairBridgeAPI.getText(url, { rateLimitMs: 1000 })

// Clear cached API responses
RepairBridgeAPI.clearCache('https://api.nhtsa.gov')
```

## 📊 Analytics & Tracking

The platform includes basic analytics tracking for:
- Section navigation patterns
- Feature usage statistics
- Search query analysis
- User interaction metrics

## 🔐 Security Considerations

- All data transmissions should use HTTPS in production
- Input validation on all user inputs
- Secure storage of sensitive vehicle data
- Regular security audits and updates

## 📈 Future Enhancements

- Real-time collaboration features
- Advanced AI-powered diagnostics
- Integration with shop management systems
- Mobile app development
- Voice-activated controls

## 🧪 Archived Competitive Prototypes

The earlier competitive feature prototypes (telematics, blockchain verification, voice commands, AI diagnostic assistant, customer portal, and related CSS) are archived in `prototypes/competitive-features/`. They are not wired into `index.html` or `script.js` by default.

## 🐛 Known Issues

- AR functionality is currently simulated (requires camera API integration)
- Marketplace cart persists across sessions (localStorage)
- Make/model search results use NHTSA vPIC live data (VIN searches use NHTSA APIs)

## 📞 Support

For technical support or feature requests:
- Email: support@repairbridge.com
- Documentation: docs.repairbridge.com
- Community: forum.repairbridge.com

## 📄 License

©2025 RepairBridge Platform. All rights reserved.

---

**Note**: This is a demonstration platform showcasing the user interface and user experience design. For production deployment, backend integration, real data sources, and security implementations would be required.
