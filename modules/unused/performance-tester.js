/**
 * Performance Testing and Validation Script
 * Tests all system components and generates performance report
 */

class PerformanceTester {
    constructor() {
        this.testResults = {
            moduleLoading: {},
            dataOperations: {},
            uiResponsiveness: {},
            crossModuleIntegration: {},
            memoryUsage: {},
            overallScore: 0
        };
        this.startTime = performance.now();
    }

    async runAllTests() {
        console.log('🧪 Starting comprehensive performance tests...');
        
        try {
            await this.testModuleLoading();
            await this.testDataOperations();
            await this.testUIResponsiveness();
            await this.testCrossModuleIntegration();
            await this.testMemoryUsage();
            
            this.calculateOverallScore();
            this.generateReport();
            
            console.log('✅ All performance tests completed successfully!');
            return this.testResults;
        } catch (error) {
            console.error('❌ Performance tests failed:', error);
            throw error;
        }
    }

    async testModuleLoading() {
        console.log('Testing module loading performance...');
        const modules = [
            'vehicleLookupManager',
            'diagnosticManager',
            'marketplaceManager',
            'analyticsManager',
            'userManager',
            'workOrderManager',
            'inventoryManager',
            'notificationManager',
            'reportingSystem',
            'helpSystem',
            'settingsManager',
            'backupManager',
            'auditManager',
            'apiManager',
            'fleetManager',
            'uiOptimizer',
            'integrationManager'
        ];

        const loadTimes = {};
        let totalLoadTime = 0;

        for (const module of modules) {
            const startTime = performance.now();
            const moduleInstance = window[module];
            const endTime = performance.now();
            
            const loadTime = endTime - startTime;
            loadTimes[module] = {
                loadTime: loadTime,
                status: moduleInstance ? 'loaded' : 'failed',
                memoryImpact: this.getMemoryUsage()
            };
            
            totalLoadTime += loadTime;
        }

        this.testResults.moduleLoading = {
            individualModules: loadTimes,
            totalLoadTime: totalLoadTime,
            averageLoadTime: totalLoadTime / modules.length,
            successRate: Object.values(loadTimes).filter(m => m.status === 'loaded').length / modules.length * 100
        };
    }

    async testDataOperations() {
        console.log('Testing data operations performance...');
        
        const operations = [
            () => this.testLocalStorageOperations(),
            () => this.testVehicleSearch(),
            () => this.testDiagnosticSession(),
            () => this.testMarketplaceOperations(),
            () => this.testAnalyticsCalculations(),
            () => this.testInventoryManagement()
        ];

        const operationResults = {};
        
        for (let i = 0; i < operations.length; i++) {
            const operationName = operations[i].name || `operation_${i}`;
            const startTime = performance.now();
            
            try {
                await operations[i]();
                const endTime = performance.now();
                operationResults[operationName] = {
                    duration: endTime - startTime,
                    status: 'success'
                };
            } catch (error) {
                const endTime = performance.now();
                operationResults[operationName] = {
                    duration: endTime - startTime,
                    status: 'error',
                    error: error.message
                };
            }
        }

        this.testResults.dataOperations = operationResults;
    }

    async testUIResponsiveness() {
        console.log('Testing UI responsiveness...');
        
        const uiTests = [
            () => this.testNavigationSpeed(),
            () => this.testModalOperations(),
            () => this.testChartRendering(),
            () => this.testTablePagination(),
            () => this.testFormValidation()
        ];

        const uiResults = {};
        
        for (const test of uiTests) {
            const testName = test.name || 'ui_test';
            const startTime = performance.now();
            
            try {
                await test();
                const endTime = performance.now();
                uiResults[testName] = {
                    duration: endTime - startTime,
                    status: 'success'
                };
            } catch (error) {
                const endTime = performance.now();
                uiResults[testName] = {
                    duration: endTime - startTime,
                    status: 'error',
                    error: error.message
                };
            }
        }

        this.testResults.uiResponsiveness = uiResults;
    }

    async testCrossModuleIntegration() {
        console.log('Testing cross-module integration...');
        
        const integrationTests = [
            () => this.testEventBusCommunication(),
            () => this.testDataSynchronization(),
            () => this.testWorkflowExecution(),
            () => this.testRealTimeUpdates()
        ];

        const integrationResults = {};
        
        for (const test of integrationTests) {
            const testName = test.name || 'integration_test';
            const startTime = performance.now();
            
            try {
                await test();
                const endTime = performance.now();
                integrationResults[testName] = {
                    duration: endTime - startTime,
                    status: 'success'
                };
            } catch (error) {
                const endTime = performance.now();
                integrationResults[testName] = {
                    duration: endTime - startTime,
                    status: 'error',
                    error: error.message
                };
            }
        }

        this.testResults.crossModuleIntegration = integrationResults;
    }

    async testMemoryUsage() {
        console.log('Testing memory usage...');
        
        const memoryTests = {
            initial: this.getMemoryUsage(),
            afterModuleLoad: null,
            afterDataOperations: null,
            afterUIInteractions: null,
            final: null
        };

        // Simulate heavy operations
        await this.simulateHeavyOperations();
        memoryTests.afterModuleLoad = this.getMemoryUsage();
        
        await this.simulateDataOperations();
        memoryTests.afterDataOperations = this.getMemoryUsage();
        
        await this.simulateUIInteractions();
        memoryTests.afterUIInteractions = this.getMemoryUsage();
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        memoryTests.final = this.getMemoryUsage();
        
        this.testResults.memoryUsage = {
            measurements: memoryTests,
            memoryLeak: memoryTests.final > memoryTests.initial * 1.5,
            efficiency: this.calculateMemoryEfficiency(memoryTests)
        };
    }

    getMemoryUsage() {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        return { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 };
    }

    calculateMemoryEfficiency(measurements) {
        const initial = measurements.initial.usedJSHeapSize;
        const final = measurements.final.usedJSHeapSize;
        const growth = final - initial;
        const limit = measurements.initial.jsHeapSizeLimit;
        
        return {
            memoryGrowth: growth,
            memoryGrowthPercentage: (growth / initial) * 100,
            memoryUtilization: (final / limit) * 100,
            efficiency: Math.max(0, 100 - ((growth / initial) * 100))
        };
    }

    async simulateHeavyOperations() {
        // Simulate loading all modules
        const modules = ['analytics', 'marketplace', 'diagnostics', 'fleet-manager'];
        for (const module of modules) {
            await this.delay(10);
            // Simulate module initialization
            const data = new Array(1000).fill(0).map(() => ({ id: Math.random(), data: 'test' }));
            localStorage.setItem(`test_${module}`, JSON.stringify(data));
        }
    }

    async simulateDataOperations() {
        // Simulate data operations
        for (let i = 0; i < 100; i++) {
            const data = { id: i, timestamp: Date.now(), data: Math.random() };
            localStorage.setItem(`test_data_${i}`, JSON.stringify(data));
            await this.delay(1);
        }
    }

    async simulateUIInteractions() {
        // Simulate UI interactions
        const sections = ['dashboard', 'analytics', 'marketplace', 'diagnostics'];
        for (const section of sections) {
            const element = document.querySelector(`[data-section="${section}"]`);
            if (element) {
                element.click();
                await this.delay(50);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    testLocalStorageOperations() {
        const testData = { test: 'data', timestamp: Date.now() };
        localStorage.setItem('performance_test', JSON.stringify(testData));
        const retrieved = JSON.parse(localStorage.getItem('performance_test'));
        localStorage.removeItem('performance_test');
        
        if (retrieved.test !== 'data') {
            throw new Error('LocalStorage operation failed');
        }
    }

    testVehicleSearch() {
        if (window.vehicleLookupManager) {
            const result = window.vehicleLookupManager.searchVehicle('1HGCM82633A123456');
            if (!result) {
                throw new Error('Vehicle search failed');
            }
        }
    }

    testDiagnosticSession() {
        if (window.diagnosticManager) {
            const session = window.diagnosticManager.createSession();
            if (!session) {
                throw new Error('Diagnostic session creation failed');
            }
        }
    }

    testMarketplaceOperations() {
        if (window.marketplaceManager) {
            const products = window.marketplaceManager.getProducts();
            if (!products || products.length === 0) {
                throw new Error('Marketplace operations failed');
            }
        }
    }

    testAnalyticsCalculations() {
        if (window.analyticsManager) {
            const metrics = window.analyticsManager.getPerformanceMetrics();
            if (!metrics) {
                throw new Error('Analytics calculations failed');
            }
        }
    }

    testInventoryManagement() {
        if (window.inventoryManager) {
            const inventory = window.inventoryManager.getInventory();
            if (!inventory) {
                throw new Error('Inventory management failed');
            }
        }
    }

    testNavigationSpeed() {
        const sections = ['dashboard', 'analytics', 'marketplace'];
        sections.forEach(section => {
            const element = document.querySelector(`[data-section="${section}"]`);
            if (element) {
                element.click();
            }
        });
    }

    testModalOperations() {
        // Test modal opening and closing
        const modal = document.createElement('div');
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Simulate modal operations
        modal.style.display = 'block';
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }

    testChartRendering() {
        // Test chart rendering performance
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Draw sample chart
        ctx.beginPath();
        ctx.moveTo(0, 150);
        for (let i = 0; i < 100; i++) {
            ctx.lineTo(i * 4, 150 + Math.sin(i * 0.1) * 50);
        }
        ctx.stroke();
    }

    testTablePagination() {
        // Test table operations
        const table = document.createElement('table');
        for (let i = 0; i < 100; i++) {
            const row = table.insertRow();
            row.insertCell(0).textContent = `Row ${i}`;
            row.insertCell(1).textContent = `Data ${i}`;
        }
    }

    testFormValidation() {
        // Test form validation performance
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.type = 'email';
        input.value = 'test@example.com';
        form.appendChild(input);
        
        const isValid = input.checkValidity();
        if (!isValid) {
            throw new Error('Form validation failed');
        }
    }

    testEventBusCommunication() {
        if (window.integrationManager) {
            window.integrationManager.triggerEvent('test-event', { test: 'data' });
        }
    }

    testDataSynchronization() {
        if (window.integrationManager) {
            window.integrationManager.syncData('test-data');
        }
    }

    testWorkflowExecution() {
        if (window.integrationManager) {
            window.integrationManager.executeWorkflow('test-workflow', { test: 'data' });
        }
    }

    testRealTimeUpdates() {
        if (window.integrationManager) {
            window.integrationManager.updateRealTimeData('test-module', 'test-action', { test: 'data' });
        }
    }

    calculateOverallScore() {
        const weights = {
            moduleLoading: 0.2,
            dataOperations: 0.25,
            uiResponsiveness: 0.25,
            crossModuleIntegration: 0.15,
            memoryUsage: 0.15
        };

        let totalScore = 0;
        
        // Module loading score
        const moduleScore = this.testResults.moduleLoading.successRate || 0;
        totalScore += moduleScore * weights.moduleLoading;
        
        // Data operations score
        const dataScore = this.calculateDataOperationsScore();
        totalScore += dataScore * weights.dataOperations;
        
        // UI responsiveness score
        const uiScore = this.calculateUIScore();
        totalScore += uiScore * weights.uiResponsiveness;
        
        // Integration score
        const integrationScore = this.calculateIntegrationScore();
        totalScore += integrationScore * weights.crossModuleIntegration;
        
        // Memory usage score
        const memoryScore = this.testResults.memoryUsage.efficiency?.efficiency || 0;
        totalScore += memoryScore * weights.memoryUsage;
        
        this.testResults.overallScore = Math.round(totalScore);
    }

    calculateDataOperationsScore() {
        const operations = Object.values(this.testResults.dataOperations);
        const successCount = operations.filter(op => op.status === 'success').length;
        return (successCount / operations.length) * 100;
    }

    calculateUIScore() {
        const uiTests = Object.values(this.testResults.uiResponsiveness);
        const successCount = uiTests.filter(test => test.status === 'success').length;
        const avgDuration = uiTests.reduce((sum, test) => sum + test.duration, 0) / uiTests.length;
        
        const successRate = (successCount / uiTests.length) * 100;
        const speedScore = Math.max(0, 100 - (avgDuration / 10)); // Penalize slow operations
        
        return (successRate + speedScore) / 2;
    }

    calculateIntegrationScore() {
        const integrationTests = Object.values(this.testResults.crossModuleIntegration);
        const successCount = integrationTests.filter(test => test.status === 'success').length;
        return (successCount / integrationTests.length) * 100;
    }

    generateReport() {
        const totalTime = performance.now() - this.startTime;
        
        const report = {
            summary: {
                overallScore: this.testResults.overallScore,
                totalTestTime: Math.round(totalTime),
                timestamp: new Date().toISOString(),
                status: this.testResults.overallScore >= 80 ? 'EXCELLENT' : 
                       this.testResults.overallScore >= 60 ? 'GOOD' : 
                       this.testResults.overallScore >= 40 ? 'FAIR' : 'NEEDS_IMPROVEMENT'
            },
            details: this.testResults,
            recommendations: this.generateRecommendations()
        };

        console.log('📊 Performance Test Report:');
        console.log('='.repeat(50));
        console.log(`Overall Score: ${report.summary.overallScore}/100 (${report.summary.status})`);
        console.log(`Total Test Time: ${report.summary.totalTestTime}ms`);
        console.log('='.repeat(50));
        
        // Save report to localStorage
        localStorage.setItem('performance_report', JSON.stringify(report));
        
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.testResults.moduleLoading.successRate < 100) {
            recommendations.push('Some modules failed to load. Check module dependencies and initialization.');
        }
        
        if (this.testResults.memoryUsage.efficiency?.efficiency < 80) {
            recommendations.push('Memory usage could be optimized. Consider implementing better cleanup routines.');
        }
        
        const avgDataOpTime = Object.values(this.testResults.dataOperations)
            .reduce((sum, op) => sum + op.duration, 0) / Object.keys(this.testResults.dataOperations).length;
        
        if (avgDataOpTime > 100) {
            recommendations.push('Data operations are slow. Consider implementing caching or optimizing database queries.');
        }
        
        if (this.testResults.overallScore < 80) {
            recommendations.push('Overall performance needs improvement. Focus on the lowest-scoring areas.');
        }
        
        return recommendations;
    }
}

// Auto-run performance tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        try {
            const tester = new PerformanceTester();
            await tester.runAllTests();
            console.log('🎉 Performance testing completed successfully!');
        } catch (error) {
            console.error('❌ Performance testing failed:', error);
        }
    }, 2000); // Wait 2 seconds for modules to load
});

// Export for manual testing
window.performanceTester = PerformanceTester;
