/**
 * AI Diagnostic Assistant
 * Intelligent diagnostic support with machine learning capabilities
 */

class AIDiagnosticAssistant {
    constructor() {
        this.models = {
            troubleshooting: null,
            prediction: null,
            classification: null
        };
        this.knowledgeBase = new Map();
        this.diagnosticHistory = [];
        this.learningData = [];
        this.isInitialized = false;
        this.apiKey = null; // Will be set in production
        this.init();
    }

    async init() {
        if (this.isInitialized) return;
        
        await this.loadKnowledgeBase();
        await this.initializeModels();
        this.setupVoiceRecognition();
        this.setupNaturalLanguageProcessing();
        this.loadDiagnosticHistory();
        
        this.isInitialized = true;
        console.log('AI Diagnostic Assistant initialized successfully');
    }

    async loadKnowledgeBase() {
        // Load comprehensive diagnostic knowledge base
        const knowledgeBase = {
            dtcCodes: {
                'P0300': {
                    description: 'Random/Multiple Cylinder Misfire Detected',
                    causes: [
                        'Ignition system issues',
                        'Fuel delivery problems',
                        'Engine mechanical problems',
                        'Vacuum leaks',
                        'Carbon buildup'
                    ],
                    solutions: [
                        'Check spark plugs and ignition coils',
                        'Inspect fuel injectors and fuel pressure',
                        'Perform compression test',
                        'Check for vacuum leaks',
                        'Clean carbon deposits'
                    ],
                    severity: 'high',
                    estimatedCost: { min: 150, max: 800 },
                    estimatedTime: { min: 1, max: 4 },
                    requiredTools: ['OBD scanner', 'Multimeter', 'Compression tester'],
                    relatedCodes: ['P0301', 'P0302', 'P0303', 'P0304']
                },
                'P0171': {
                    description: 'System Too Lean (Bank 1)',
                    causes: [
                        'Vacuum leak',
                        'Mass airflow sensor failure',
                        'Fuel pump issues',
                        'Dirty fuel injectors',
                        'Exhaust leak'
                    ],
                    solutions: [
                        'Check for vacuum leaks',
                        'Test MAF sensor',
                        'Test fuel pressure',
                        'Clean fuel injectors',
                        'Inspect exhaust system'
                    ],
                    severity: 'medium',
                    estimatedCost: { min: 100, max: 500 },
                    estimatedTime: { min: 0.5, max: 2 },
                    requiredTools: ['OBD scanner', 'Smoke machine', 'Fuel pressure tester'],
                    relatedCodes: ['P0174', 'P0100', 'P0101']
                },
                'P0420': {
                    description: 'Catalyst System Efficiency Below Threshold (Bank 1)',
                    causes: [
                        'Catalytic converter failure',
                        'Oxygen sensor issues',
                        'Engine misfires',
                        'Fuel contamination',
                        'Exhaust leaks'
                    ],
                    solutions: [
                        'Replace catalytic converter',
                        'Test oxygen sensors',
                        'Fix engine misfires',
                        'Use fuel system cleaner',
                        'Repair exhaust leaks'
                    ],
                    severity: 'medium',
                    estimatedCost: { min: 200, max: 1200 },
                    estimatedTime: { min: 1, max: 3 },
                    requiredTools: ['OBD scanner', 'Exhaust gas analyzer', 'Oscilloscope'],
                    relatedCodes: ['P0430', 'P0131', 'P0132']
                }
            },
            symptoms: {
                'rough_idle': {
                    description: 'Engine runs roughly at idle',
                    possibleCauses: ['P0300', 'P0171', 'vacuum_leak', 'dirty_injectors'],
                    diagnosticSteps: [
                        'Check for diagnostic codes',
                        'Inspect air intake system',
                        'Test fuel pressure',
                        'Check ignition system'
                    ],
                    urgency: 'medium'
                },
                'poor_acceleration': {
                    description: 'Vehicle lacks power during acceleration',
                    possibleCauses: ['P0171', 'fuel_pump', 'air_filter', 'turbo_issues'],
                    diagnosticSteps: [
                        'Check air filter',
                        'Test fuel pressure',
                        'Inspect turbocharger',
                        'Check exhaust system'
                    ],
                    urgency: 'medium'
                },
                'check_engine_light': {
                    description: 'Check engine light illuminated',
                    possibleCauses: ['any_dtc', 'loose_gas_cap', 'emissions_issue'],
                    diagnosticSteps: [
                        'Scan for diagnostic codes',
                        'Check gas cap',
                        'Inspect emissions system',
                        'Test sensors'
                    ],
                    urgency: 'high'
                }
            },
            vehicleData: {
                makes: ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Volkswagen'],
                commonIssues: {
                    'Toyota': ['oil_consumption', 'hybrid_battery', 'timing_chain'],
                    'Honda': ['transmission_issues', 'vtec_solenoid', 'power_steering'],
                    'Ford': ['transmission_problems', 'cooling_system', 'electrical_issues'],
                    'BMW': ['cooling_system', 'electrical_problems', 'suspension_issues'],
                    'Mercedes': ['air_suspension', 'electrical_complexity', 'maintenance_costs']
                }
            }
        };

        // Store in knowledge base
        Object.entries(knowledgeBase).forEach(([category, data]) => {
            this.knowledgeBase.set(category, data);
        });
    }

    async initializeModels() {
        // Initialize TensorFlow.js models for client-side inference
        if (typeof tf !== 'undefined') {
            try {
                // Load pre-trained models (would be actual model files in production)
                this.models.troubleshooting = await this.loadTroubleshootingModel();
                this.models.prediction = await this.loadPredictionModel();
                this.models.classification = await this.loadClassificationModel();
            } catch (error) {
                console.warn('TensorFlow.js models not available, using fallback logic');
                this.models = this.createFallbackModels();
            }
        } else {
            console.warn('TensorFlow.js not loaded, using fallback models');
            this.models = this.createFallbackModels();
        }
    }

    createFallbackModels() {
        return {
            troubleshooting: {
                predict: (symptoms) => this.fallbackTroubleshooting(symptoms)
            },
            prediction: {
                predict: (data) => this.fallbackPrediction(data)
            },
            classification: {
                predict: (input) => this.fallbackClassification(input)
            }
        };
    }

    async loadTroubleshootingModel() {
        // In production, this would load an actual TensorFlow model
        // For now, return a mock model
        return {
            predict: (symptoms) => {
                // Simulate ML inference with rule-based logic
                return this.analyzeSymptoms(symptoms);
            }
        };
    }

    async loadPredictionModel() {
        return {
            predict: (vehicleData) => {
                return this.predictMaintenance(vehicleData);
            }
        };
    }

    async loadClassificationModel() {
        return {
            predict: (input) => {
                return this.classifyIssue(input);
            }
        };
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'en-US';

            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceInput(transcript);
            };

            this.speechRecognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        }
    }

    setupNaturalLanguageProcessing() {
        // Simple NLP for processing user input
        this.nlpPatterns = {
            symptoms: [
                { pattern: /rough.*idle/i, symptom: 'rough_idle' },
                { pattern: /poor.*acceleration/i, symptom: 'poor_acceleration' },
                { pattern: /check.*engine.*light/i, symptom: 'check_engine_light' },
                { pattern: /hard.*start/i, symptom: 'hard_start' },
                { pattern: /stalls?/i, symptom: 'stalling' },
                { pattern: /noise.*engine/i, symptom: 'engine_noise' },
                { pattern: /overheating/i, symptom: 'overheating' },
                { pattern: /vibration/i, symptom: 'vibration' }
            ],
            urgency: [
                { pattern: /urgent|emergency|immediately/i, level: 'high' },
                { pattern: /soon|important/i, level: 'medium' },
                { pattern: /convenient|when.*time/i, level: 'low' }
            ]
        };
    }

    loadDiagnosticHistory() {
        const history = localStorage.getItem('ai_diagnostic_history');
        if (history) {
            this.diagnosticHistory = JSON.parse(history);
        }
    }

    saveDiagnosticHistory() {
        localStorage.setItem('ai_diagnostic_history', JSON.stringify(this.diagnosticHistory));
    }

    // Main AI diagnostic methods
    async diagnoseProblem(input) {
        const analysis = {
            timestamp: new Date().toISOString(),
            input: input,
            symptoms: this.extractSymptoms(input),
            dtcCodes: input.dtcCodes || [],
            vehicleInfo: input.vehicleInfo || {},
            analysis: null,
            recommendations: [],
            confidence: 0
        };

        // Analyze symptoms using AI
        if (analysis.symptoms.length > 0) {
            analysis.analysis = await this.analyzeSymptoms(analysis.symptoms);
        }

        // Analyze DTC codes
        if (analysis.dtcCodes.length > 0) {
            analysis.analysis = {
                ...analysis.analysis,
                ...await this.analyzeDTCCodes(analysis.dtcCodes)
            };
        }

        // Generate recommendations
        analysis.recommendations = this.generateRecommendations(analysis);
        analysis.confidence = this.calculateConfidence(analysis);

        // Store for learning
        this.diagnosticHistory.push(analysis);
        this.saveDiagnosticHistory();

        return analysis;
    }

    extractSymptoms(input) {
        const symptoms = [];
        
        if (typeof input === 'string') {
            // Extract symptoms from natural language
            this.nlpPatterns.symptoms.forEach(({ pattern, symptom }) => {
                if (pattern.test(input)) {
                    symptoms.push(symptom);
                }
            });
        } else if (input.symptoms) {
            symptoms.push(...input.symptoms);
        }

        return symptoms;
    }

    async analyzeSymptoms(symptoms) {
        const analysis = {
            identifiedSymptoms: [],
            possibleCauses: [],
            diagnosticSteps: [],
            urgency: 'medium'
        };

        const symptomData = this.knowledgeBase.get('symptoms') || {};
        
        symptoms.forEach(symptom => {
            if (symptomData[symptom]) {
                const data = symptomData[symptom];
                analysis.identifiedSymptoms.push({
                    symptom: symptom,
                    description: data.description,
                    urgency: data.urgency
                });
                
                analysis.possibleCauses.push(...data.possibleCauses);
                analysis.diagnosticSteps.push(...data.diagnosticSteps);
                
                // Set highest urgency level
                if (data.urgency === 'high') {
                    analysis.urgency = 'high';
                } else if (data.urgency === 'medium' && analysis.urgency === 'low') {
                    analysis.urgency = 'medium';
                }
            }
        });

        // Remove duplicates
        analysis.possibleCauses = [...new Set(analysis.possibleCauses)];
        analysis.diagnosticSteps = [...new Set(analysis.diagnosticSteps)];

        return analysis;
    }

    async analyzeDTCCodes(dtcCodes) {
        const analysis = {
            codes: [],
            relatedCodes: [],
            estimatedCost: { min: 0, max: 0 },
            estimatedTime: { min: 0, max: 0 },
            requiredTools: [],
            severity: 'low'
        };

        const dtcData = this.knowledgeBase.get('dtcCodes') || {};
        
        dtcCodes.forEach(code => {
            if (dtcData[code]) {
                const data = dtcData[code];
                analysis.codes.push({
                    code: code,
                    description: data.description,
                    causes: data.causes,
                    solutions: data.solutions,
                    severity: data.severity
                });
                
                analysis.relatedCodes.push(...data.relatedCodes);
                analysis.estimatedCost.min += data.estimatedCost.min;
                analysis.estimatedCost.max += data.estimatedCost.max;
                analysis.estimatedTime.min += data.estimatedTime.min;
                analysis.estimatedTime.max += data.estimatedTime.max;
                analysis.requiredTools.push(...data.requiredTools);
                
                // Set highest severity
                if (data.severity === 'high') {
                    analysis.severity = 'high';
                } else if (data.severity === 'medium' && analysis.severity === 'low') {
                    analysis.severity = 'medium';
                }
            }
        });

        // Remove duplicates
        analysis.relatedCodes = [...new Set(analysis.relatedCodes)];
        analysis.requiredTools = [...new Set(analysis.requiredTools)];

        return analysis;
    }

    generateRecommendations(analysis) {
        const recommendations = [];
        
        // Immediate actions based on urgency
        if (analysis.analysis && analysis.analysis.urgency === 'high') {
            recommendations.push({
                type: 'immediate',
                title: 'Immediate Attention Required',
                description: 'This issue requires immediate professional attention to prevent further damage.',
                priority: 1,
                icon: '🚨'
            });
        }

        // DTC-specific recommendations
        if (analysis.analysis && analysis.analysis.codes) {
            analysis.analysis.codes.forEach(codeData => {
                codeData.solutions.forEach((solution, index) => {
                    recommendations.push({
                        type: 'repair',
                        title: `${codeData.code}: ${solution}`,
                        description: `Address ${codeData.description.toLowerCase()}`,
                        priority: index + 2,
                        estimatedCost: codeData.estimatedCost,
                        estimatedTime: codeData.estimatedTime,
                        icon: '🔧'
                    });
                });
            });
        }

        // Preventive recommendations
        if (analysis.vehicleInfo && analysis.vehicleInfo.mileage > 100000) {
            recommendations.push({
                type: 'preventive',
                title: 'High Mileage Maintenance',
                description: 'Consider preventive maintenance for high-mileage vehicles.',
                priority: 10,
                icon: '🛡️'
            });
        }

        // Learning-based recommendations
        const learningRecommendations = this.generateLearningRecommendations(analysis);
        recommendations.push(...learningRecommendations);

        return recommendations.sort((a, b) => a.priority - b.priority);
    }

    generateLearningRecommendations(analysis) {
        const recommendations = [];
        
        // Analyze historical data for patterns
        const similarCases = this.findSimilarCases(analysis);
        
        if (similarCases.length > 0) {
            const successfulSolutions = this.extractSuccessfulSolutions(similarCases);
            
            successfulSolutions.forEach(solution => {
                recommendations.push({
                    type: 'learning',
                    title: `Based on Similar Cases: ${solution.title}`,
                    description: `${solution.successRate}% success rate in similar cases`,
                    priority: 5,
                    icon: '🧠'
                });
            });
        }

        return recommendations;
    }

    findSimilarCases(analysis) {
        return this.diagnosticHistory.filter(historyItem => {
            // Simple similarity check based on symptoms and DTC codes
            const symptomMatch = analysis.symptoms.some(symptom => 
                historyItem.symptoms.includes(symptom)
            );
            
            const dtcMatch = analysis.dtcCodes.some(code => 
                historyItem.dtcCodes.includes(code)
            );
            
            return symptomMatch || dtcMatch;
        });
    }

    extractSuccessfulSolutions(cases) {
        // Extract solutions that had positive outcomes
        const solutions = [];
        
        cases.forEach(caseData => {
            if (caseData.outcome === 'success') {
                caseData.recommendations.forEach(rec => {
                    solutions.push({
                        title: rec.title,
                        successRate: 85 // Placeholder - would be calculated from actual data
                    });
                });
            }
        });

        return solutions;
    }

    calculateConfidence(analysis) {
        let confidence = 0;
        
        // Base confidence on known symptoms and codes
        if (analysis.symptoms.length > 0) {
            confidence += 30;
        }
        
        if (analysis.dtcCodes.length > 0) {
            confidence += 50;
        }
        
        // Increase confidence based on historical data
        const similarCases = this.findSimilarCases(analysis);
        if (similarCases.length > 0) {
            confidence += Math.min(20, similarCases.length * 5);
        }
        
        return Math.min(100, confidence);
    }

    // Voice interaction methods
    startVoiceInput() {
        if (this.speechRecognition) {
            this.speechRecognition.start();
            return true;
        }
        return false;
    }

    processVoiceInput(transcript) {
        // Process voice input and trigger diagnosis
        const input = {
            text: transcript,
            source: 'voice',
            timestamp: new Date().toISOString()
        };
        
        this.diagnoseProblem(transcript).then(result => {
            this.handleDiagnosisResult(result, 'voice');
        });
    }

    // Predictive maintenance
    predictMaintenance(vehicleData) {
        const predictions = [];
        
        // Mileage-based predictions
        if (vehicleData.mileage) {
            const mileage = vehicleData.mileage;
            
            if (mileage > 90000 && mileage < 100000) {
                predictions.push({
                    type: 'maintenance',
                    item: 'Timing Belt',
                    dueAt: 100000,
                    priority: 'high',
                    estimatedCost: { min: 400, max: 800 }
                });
            }
            
            if (mileage > 145000 && mileage < 150000) {
                predictions.push({
                    type: 'maintenance',
                    item: 'Transmission Service',
                    dueAt: 150000,
                    priority: 'medium',
                    estimatedCost: { min: 200, max: 400 }
                });
            }
        }

        // Age-based predictions
        if (vehicleData.year) {
            const age = new Date().getFullYear() - vehicleData.year;
            
            if (age > 5) {
                predictions.push({
                    type: 'maintenance',
                    item: 'Battery Replacement',
                    dueAt: 'Soon',
                    priority: 'medium',
                    estimatedCost: { min: 100, max: 200 }
                });
            }
        }

        return predictions;
    }

    // Fallback methods for when AI models aren't available
    fallbackTroubleshooting(symptoms) {
        return this.analyzeSymptoms(symptoms);
    }

    fallbackPrediction(data) {
        return this.predictMaintenance(data);
    }

    fallbackClassification(input) {
        // Simple classification based on keywords
        const classifications = {
            engine: ['engine', 'motor', 'cylinder', 'piston', 'combustion'],
            transmission: ['transmission', 'gear', 'clutch', 'shift'],
            brake: ['brake', 'braking', 'stop', 'pad', 'rotor'],
            electrical: ['electrical', 'battery', 'alternator', 'starter', 'wire'],
            cooling: ['cooling', 'radiator', 'coolant', 'overheat', 'temperature'],
            fuel: ['fuel', 'gas', 'injection', 'pump', 'tank']
        };

        const text = input.toLowerCase();
        
        for (const [category, keywords] of Object.entries(classifications)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return {
                    category: category,
                    confidence: 0.8
                };
            }
        }

        return {
            category: 'general',
            confidence: 0.5
        };
    }

    // Integration with other modules
    integrateWithDiagnostics(diagnosticData) {
        // Enhance diagnostic data with AI insights
        const aiAnalysis = this.diagnoseProblem(diagnosticData);
        
        // Notify integration manager
        if (window.integrationManager) {
            window.integrationManager.triggerEvent('ai-diagnosis-complete', {
                diagnosticData: diagnosticData,
                aiAnalysis: aiAnalysis
            });
        }
        
        return aiAnalysis;
    }

    handleDiagnosisResult(result, source = 'manual') {
        // Handle diagnosis results and trigger appropriate actions
        
        // Update UI
        this.updateDiagnosticUI(result);
        
        // Send notifications
        if (window.notificationManager) {
            const severity = result.analysis?.severity || 'medium';
            const message = `AI Diagnosis complete. Severity: ${severity}`;
            window.notificationManager.showNotification(message, severity);
        }
        
        // Update analytics
        if (window.analyticsManager) {
            window.analyticsManager.trackAIDiagnosis(result);
        }
        
        // Log for audit
        if (window.auditManager) {
            window.auditManager.logAction({
                action: 'ai_diagnosis',
                source: source,
                result: result,
                timestamp: new Date().toISOString()
            });
        }
    }

    updateDiagnosticUI(result) {
        // Update the diagnostic UI with AI results
        const aiResultsContainer = document.getElementById('ai-results');
        if (aiResultsContainer) {
            aiResultsContainer.innerHTML = this.renderAIResults(result);
        }
    }

    renderAIResults(result) {
        const confidence = result.confidence || 0;
        const confidenceClass = confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low';
        
        return `
            <div class="ai-results-container">
                <div class="ai-header">
                    <h3>🤖 AI Diagnostic Analysis</h3>
                    <div class="confidence-indicator ${confidenceClass}">
                        Confidence: ${confidence}%
                    </div>
                </div>
                
                ${this.renderSymptomAnalysis(result.analysis)}
                ${this.renderRecommendations(result.recommendations)}
                ${this.renderPredictions(result.predictions)}
            </div>
        `;
    }

    renderSymptomAnalysis(analysis) {
        if (!analysis || !analysis.identifiedSymptoms) return '';
        
        return `
            <div class="symptom-analysis">
                <h4>Identified Symptoms</h4>
                <div class="symptoms-list">
                    ${analysis.identifiedSymptoms.map(symptom => `
                        <div class="symptom-item ${symptom.urgency}">
                            <span class="symptom-name">${symptom.symptom.replace('_', ' ')}</span>
                            <span class="symptom-description">${symptom.description}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderRecommendations(recommendations) {
        if (!recommendations || recommendations.length === 0) return '';
        
        return `
            <div class="recommendations">
                <h4>AI Recommendations</h4>
                <div class="recommendations-list">
                    ${recommendations.slice(0, 5).map(rec => `
                        <div class="recommendation-item">
                            <span class="recommendation-icon">${rec.icon}</span>
                            <div class="recommendation-content">
                                <h5>${rec.title}</h5>
                                <p>${rec.description}</p>
                                ${rec.estimatedCost ? `<span class="cost">Est: $${rec.estimatedCost.min}-$${rec.estimatedCost.max}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPredictions(predictions) {
        if (!predictions || predictions.length === 0) return '';
        
        return `
            <div class="predictions">
                <h4>Predictive Maintenance</h4>
                <div class="predictions-list">
                    ${predictions.map(pred => `
                        <div class="prediction-item ${pred.priority}">
                            <span class="prediction-due">${pred.dueAt}</span>
                            <div class="prediction-content">
                                <h5>${pred.item}</h5>
                                <span class="prediction-cost">Est: $${pred.estimatedCost.min}-$${pred.estimatedCost.max}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Public API
    async diagnose(input) {
        return await this.diagnoseProblem(input);
    }

    async chat(message) {
        // Simple chatbot functionality
        const response = await this.diagnoseProblem(message);
        return this.generateChatResponse(response);
    }

    generateChatResponse(analysis) {
        const responses = [
            "I've analyzed your input and found some potential issues.",
            "Based on my analysis, here's what I recommend:",
            "Let me help you understand what might be happening:",
            "I've identified some symptoms that we should address:"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            message: randomResponse,
            analysis: analysis,
            suggestions: analysis.recommendations?.slice(0, 3) || []
        };
    }

    // Learning and improvement
    provideFeedback(analysisId, feedback) {
        // Record feedback for continuous learning
        const feedbackData = {
            analysisId: analysisId,
            feedback: feedback,
            timestamp: new Date().toISOString()
        };
        
        this.learningData.push(feedbackData);
        localStorage.setItem('ai_learning_data', JSON.stringify(this.learningData));
    }

    // Cleanup
    cleanup() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
        }
    }
}

// Initialize AI assistant
window.aiDiagnosticAssistant = new AIDiagnosticAssistant();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIDiagnosticAssistant;
}
