/**
 * Vehicle Database - Mock Data for RepairBridge Platform
 * Contains comprehensive vehicle information for demonstration
 */

const vehicleDatabase = {
    // Ford Vehicles
    "1FTFW1E50NFB12345": {
        vin: "1FTFW1E50NFB12345",
        make: "Ford",
        model: "F-150",
        year: 2023,
        engine: "3.5L V6 EcoBoost",
        transmission: "10-Speed Automatic",
        drivetrain: "4WD",
        color: "Oxford White",
        mileage: 15420,
        owner: {
            name: "John Smith",
            phone: "(555) 123-4567",
            email: "john.smith@email.com"
        },
        serviceHistory: [
            {
                date: "2024-12-15",
                mileage: 15200,
                service: "Oil Change & Filter",
                cost: 89.99,
                shop: "Mike's Auto Service"
            },
            {
                date: "2024-10-22",
                mileage: 14800,
                service: "Tire Rotation",
                cost: 45.00,
                shop: "Quick Tire"
            }
        ],
        diagnosticCodes: [],
        recommendations: [
            "Next oil change due at 18,000 miles",
            "Brake inspection recommended at 20,000 miles"
        ],
        warranties: [
            {
                type: "Powertrain",
                expires: "2028-08-15",
                coverage: "Engine, Transmission, Drivetrain"
            }
        ],
        recalls: [],
        specifications: {
            fuelType: "Gasoline",
            fuelCapacity: "26.0 gallons",
            towingCapacity: "11,500 lbs",
            payloadCapacity: "1,980 lbs",
            mpgCity: 20,
            mpgHighway: 24
        }
    },

    // Toyota Vehicles
    "4T1C11AK5NU123456": {
        vin: "4T1C11AK5NU123456",
        make: "Toyota",
        model: "Camry",
        year: 2022,
        engine: "2.5L 4-Cylinder",
        transmission: "8-Speed Automatic",
        drivetrain: "FWD",
        color: "Midnight Black Metallic",
        mileage: 28540,
        owner: {
            name: "Sarah Johnson",
            phone: "(555) 987-6543",
            email: "sarah.johnson@email.com"
        },
        serviceHistory: [
            {
                date: "2024-11-08",
                mileage: 28200,
                service: "30K Mile Service",
                cost: 299.99,
                shop: "Toyota Service Center"
            },
            {
                date: "2024-08-15",
                mileage: 27500,
                service: "Brake Pad Replacement",
                cost: 245.50,
                shop: "Brake Masters"
            }
        ],
        diagnosticCodes: [
            {
                code: "P0171",
                description: "System Too Lean (Bank 1)",
                severity: "Medium",
                status: "Pending"
            }
        ],
        recommendations: [
            "Air filter replacement recommended",
            "Transmission fluid service due soon"
        ],
        warranties: [
            {
                type: "Basic",
                expires: "2025-08-20",
                coverage: "3 year/36,000 mile"
            }
        ],
        recalls: [
            {
                code: "22V-468",
                description: "Fuel Pump Recall",
                status: "Completed",
                date: "2024-09-12"
            }
        ],
        specifications: {
            fuelType: "Gasoline",
            fuelCapacity: "15.8 gallons",
            towingCapacity: "1,000 lbs",
            payloadCapacity: "1,050 lbs",
            mpgCity: 28,
            mpgHighway: 39
        }
    },

    // BMW Vehicles
    "WBA3A5C59DF123456": {
        vin: "WBA3A5C59DF123456",
        make: "BMW",
        model: "320i",
        year: 2023,
        engine: "2.0L Turbocharged 4-Cylinder",
        transmission: "8-Speed Automatic",
        drivetrain: "RWD",
        color: "Alpine White",
        mileage: 8920,
        owner: {
            name: "Michael Chen",
            phone: "(555) 456-7890",
            email: "michael.chen@email.com"
        },
        serviceHistory: [
            {
                date: "2024-12-10",
                mileage: 8850,
                service: "First Service Inspection",
                cost: 195.00,
                shop: "BMW Service Center"
            }
        ],
        diagnosticCodes: [],
        recommendations: [
            "Next service due at 10,000 miles",
            "Tire pressure monitoring system check recommended"
        ],
        warranties: [
            {
                type: "New Vehicle Limited",
                expires: "2027-08-25",
                coverage: "4 year/50,000 mile"
            }
        ],
        recalls: [],
        specifications: {
            fuelType: "Premium Gasoline",
            fuelCapacity: "15.6 gallons",
            towingCapacity: "N/A",
            payloadCapacity: "1,080 lbs",
            mpgCity: 26,
            mpgHighway: 36
        }
    },

    // Chevrolet Vehicles
    "1G1BE5SM8H7123456": {
        vin: "1G1BE5SM8H7123456",
        make: "Chevrolet",
        model: "Malibu",
        year: 2021,
        engine: "1.5L Turbocharged 4-Cylinder",
        transmission: "CVT",
        drivetrain: "FWD",
        color: "Summit White",
        mileage: 42180,
        owner: {
            name: "David Wilson",
            phone: "(555) 234-5678",
            email: "david.wilson@email.com"
        },
        serviceHistory: [
            {
                date: "2024-11-25",
                mileage: 42000,
                service: "Oil Change & Multi-Point Inspection",
                cost: 79.99,
                shop: "Jiffy Lube"
            },
            {
                date: "2024-09-30",
                mileage: 41200,
                service: "Coolant System Flush",
                cost: 129.99,
                shop: "Auto Zone Service"
            }
        ],
        diagnosticCodes: [
            {
                code: "P0456",
                description: "Evaporative Emission System Small Leak",
                severity: "Low",
                status: "Active"
            }
        ],
        recommendations: [
            "Evaporative emission system inspection needed",
            "Cabin air filter replacement recommended"
        ],
        warranties: [
            {
                type: "Powertrain",
                expires: "2026-07-15",
                coverage: "5 year/60,000 mile"
            }
        ],
        recalls: [],
        specifications: {
            fuelType: "Gasoline",
            fuelCapacity: "15.8 gallons",
            towingCapacity: "1,000 lbs",
            payloadCapacity: "1,100 lbs",
            mpgCity: 29,
            mpgHighway: 36
        }
    },

    // Honda Vehicles
    "19XFC2F59ME123456": {
        vin: "19XFC2F59ME123456",
        make: "Honda",
        model: "Civic",
        year: 2021,
        engine: "1.5L Turbocharged 4-Cylinder",
        transmission: "CVT",
        drivetrain: "FWD",
        color: "Sonic Gray Pearl",
        mileage: 35600,
        owner: {
            name: "Emily Rodriguez",
            phone: "(555) 345-6789",
            email: "emily.rodriguez@email.com"
        },
        serviceHistory: [
            {
                date: "2024-12-01",
                mileage: 35400,
                service: "Oil Change & Tire Rotation",
                cost: 69.99,
                shop: "Honda Service Center"
            }
        ],
        diagnosticCodes: [],
        recommendations: [
            "Transmission fluid service due at 40,000 miles",
            "Spark plug replacement recommended at 60,000 miles"
        ],
        warranties: [
            {
                type: "Basic",
                expires: "2024-09-20",
                coverage: "3 year/36,000 mile"
            }
        ],
        recalls: [],
        specifications: {
            fuelType: "Gasoline",
            fuelCapacity: "12.4 gallons",
            towingCapacity: "N/A",
            payloadCapacity: "1,000 lbs",
            mpgCity: 31,
            mpgHighway: 40
        }
    }
};

// License plate to VIN mapping
const licensePlateDatabase = {
    "ABC123": "1FTFW1E50NFB12345",
    "XYZ789": "4T1C11AK5NU123456",
    "BMW001": "WBA3A5C59DF123456",
    "CHV456": "1G1BE5SM8H7123456",
    "HND789": "19XFC2F59ME123456"
};

// Diagnostic trouble codes database
const dtcDatabase = {
    "P0171": {
        code: "P0171",
        description: "System Too Lean (Bank 1)",
        causes: [
            "Dirty or faulty mass airflow sensor",
            "Vacuum leaks",
            "Fuel system problems",
            "Exhaust leaks"
        ],
        solutions: [
            "Clean or replace mass airflow sensor",
            "Inspect vacuum lines",
            "Check fuel pressure",
            "Inspect exhaust system"
        ]
    },
    "P0456": {
        code: "P0456",
        description: "Evaporative Emission System Small Leak",
        causes: [
            "Loose or damaged gas cap",
            "Cracked EVAP lines",
            "Faulty purge valve",
            "Damaged charcoal canister"
        ],
        solutions: [
            "Tighten or replace gas cap",
            "Inspect EVAP system lines",
            "Replace purge valve",
            "Test charcoal canister"
        ]
    }
};

// OEM data sources
const oemDataSources = {
    "Ford": {
        name: "Ford Motor Company",
        status: "connected",
        lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        apiEndpoint: "https://api.ford.com/v1/vehicles",
        dataTypes: ["diagnostics", "service_history", "recalls", "warranties"]
    },
    "Toyota": {
        name: "Toyota Motors",
        status: "connected",
        lastSync: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
        apiEndpoint: "https://api.toyota.com/v2/vehicle-data",
        dataTypes: ["diagnostics", "service_history", "recalls", "warranties"]
    },
    "BMW": {
        name: "BMW Group",
        status: "disconnected",
        lastSync: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        apiEndpoint: "https://api.bmw.com/v1/connected-drive",
        dataTypes: ["diagnostics", "service_history", "recalls", "warranties"]
    },
    "GM": {
        name: "General Motors",
        status: "connected",
        lastSync: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
        apiEndpoint: "https://api.gm.com/v1/onstar",
        dataTypes: ["diagnostics", "service_history", "recalls", "warranties"]
    },
    "Honda": {
        name: "Honda Motor Company",
        status: "connected",
        lastSync: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        apiEndpoint: "https://api.honda.com/v1/vehicle-info",
        dataTypes: ["diagnostics", "service_history", "recalls", "warranties"]
    }
};

// Marketplace items database
const marketplaceItems = {
    tools: [
        {
            id: "tool-001",
            name: "OBD-II Scanner Pro",
            description: "Professional diagnostic scanner with live data streaming and code clearing capabilities",
            price: 299,
            discountPrice: 249,
            discount: 17,
            category: "tools",
            image: "obd-scanner.jpg",
            features: ["Live data streaming", "Code clearing", "Freeze frame data", "Manufacturer specific codes"],
            rating: 4.8,
            reviews: 156
        },
        {
            id: "tool-002",
            name: "Leak Detection Kit",
            description: "UV dye and detection system for identifying fluid leaks in automotive systems",
            price: 89,
            discountPrice: 69,
            discount: 22,
            category: "tools",
            image: "leak-detection.jpg",
            features: ["UV dye tablets", "LED UV light", "Safety glasses", "Application guide"],
            rating: 4.6,
            reviews: 89
        },
        {
            id: "tool-003",
            name: "Digital Multimeter",
            description: "High-precision automotive multimeter with specialized automotive functions",
            price: 159,
            discountPrice: 129,
            discount: 19,
            category: "tools",
            image: "multimeter.jpg",
            features: ["Auto-ranging", "RPM measurement", "Duty cycle", "Temperature probe"],
            rating: 4.7,
            reviews: 234
        }
    ],
    training: [
        {
            id: "training-001",
            name: "EV Diagnostics Course",
            description: "Comprehensive electric vehicle diagnostic training with hands-on practice",
            price: 499,
            discountPrice: 399,
            discount: 20,
            category: "training",
            image: "ev-training.jpg",
            features: ["20 hours of content", "Hands-on labs", "Certificate included", "1 year access"],
            rating: 4.9,
            reviews: 67
        },
        {
            id: "training-002",
            name: "HVAC System Repair",
            description: "Complete automotive HVAC system diagnosis and repair training",
            price: 299,
            discountPrice: 239,
            discount: 20,
            category: "training",
            image: "hvac-training.jpg",
            features: ["15 hours of content", "Refrigerant handling", "System diagnosis", "Repair procedures"],
            rating: 4.5,
            reviews: 123
        }
    ],
    certifications: [
        {
            id: "cert-001",
            name: "ASE Certification Prep",
            description: "Complete preparation course for ASE certification exams",
            price: 199,
            discountPrice: 149,
            discount: 25,
            category: "certifications",
            image: "ase-cert.jpg",
            features: ["Practice exams", "Study guides", "Video tutorials", "Exam registration"],
            rating: 4.8,
            reviews: 445
        },
        {
            id: "cert-002",
            name: "Hybrid Vehicle Certification",
            description: "Specialized certification for hybrid vehicle service and repair",
            price: 399,
            discountPrice: 319,
            discount: 20,
            category: "certifications",
            image: "hybrid-cert.jpg",
            features: ["Safety protocols", "High voltage systems", "Battery service", "Certification exam"],
            rating: 4.7,
            reviews: 78
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        vehicleDatabase,
        licensePlateDatabase,
        dtcDatabase,
        oemDataSources,
        marketplaceItems
    };
}
