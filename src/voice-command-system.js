/**
 * Voice Command System
 * Speech recognition and voice control interface
 */

class VoiceCommandSystem {
    constructor() {
        this.recognition = null;
        this.synthesis = null;
        this.isListening = false;
        this.isEnabled = false;
        this.currentLanguage = 'en-US';
        this.commandHistory = [];
        this.voiceCommands = new Map();
        this.contextualCommands = new Map();
        this.currentContext = 'global';
        this.confidenceThreshold = 0.7;
        this.wakeWords = ['hey repair bridge', 'repair bridge', 'bridge'];
        this.isWakeWordMode = false;
        this.continuousMode = false;
        this.init();
    }

    init() {
        this.checkBrowserSupport();
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
        this.setupVoiceCommands();
        this.loadSettings();
        console.log('Voice Command System initialized');
    }

    checkBrowserSupport() {
        // Check for Web Speech API support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported in this browser');
            this.isEnabled = false;
            return;
        }

        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported in this browser');
        }

        this.isEnabled = true;
    }

    setupSpeechRecognition() {
        if (!this.isEnabled) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI();
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            this.processResult(event);
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.updateUI();
            
            if (event.error === 'not-allowed') {
                this.showMicrophonePermissionError();
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI();
            
            if (this.continuousMode) {
                setTimeout(() => this.startListening(), 1000);
            }
        };
    }

    setupSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
            this.loadVoices();
            
            // Load voices when they become available
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        this.selectedVoice = this.voices.find(voice => 
            voice.lang === this.currentLanguage && voice.default
        ) || this.voices[0];
    }

    setupVoiceCommands() {
        // Global commands
        this.voiceCommands.set('navigate to dashboard', () => this.navigateTo('dashboard'));
        this.voiceCommands.set('go to dashboard', () => this.navigateTo('dashboard'));
        this.voiceCommands.set('show dashboard', () => this.navigateTo('dashboard'));
        
        this.voiceCommands.set('navigate to vehicles', () => this.navigateTo('vehicle-lookup'));
        this.voiceCommands.set('go to vehicles', () => this.navigateTo('vehicle-lookup'));
        this.voiceCommands.set('show vehicles', () => this.navigateTo('vehicle-lookup'));
        
        this.voiceCommands.set('navigate to marketplace', () => this.navigateTo('marketplace'));
        this.voiceCommands.set('go to marketplace', () => this.navigateTo('marketplace'));
        this.voiceCommands.set('show marketplace', () => this.navigateTo('marketplace'));
        
        this.voiceCommands.set('navigate to diagnostics', () => this.navigateTo('diagnostic'));
        this.voiceCommands.set('go to diagnostics', () => this.navigateTo('diagnostic'));
        this.voiceCommands.set('show diagnostics', () => this.navigateTo('diagnostic'));
        
        this.voiceCommands.set('navigate to analytics', () => this.navigateTo('analytics'));
        this.voiceCommands.set('go to analytics', () => this.navigateTo('analytics'));
        this.voiceCommands.set('show analytics', () => this.navigateTo('analytics'));
        
        this.voiceCommands.set('navigate to fleet', () => this.navigateTo('fleet'));
        this.voiceCommands.set('go to fleet', () => this.navigateTo('fleet'));
        this.voiceCommands.set('show fleet', () => this.navigateTo('fleet'));
        
        this.voiceCommands.set('navigate to settings', () => this.navigateTo('settings'));
        this.voiceCommands.set('go to settings', () => this.navigateTo('settings'));
        this.voiceCommands.set('show settings', () => this.navigateTo('settings'));
        
        // Search commands
        this.voiceCommands.set('search for', (query) => this.performSearch(query));
        this.voiceCommands.set('find', (query) => this.performSearch(query));
        this.voiceCommands.set('look for', (query) => this.performSearch(query));
        
        // System commands
        this.voiceCommands.set('help', () => this.showHelp());
        this.voiceCommands.set('what can you do', () => this.showHelp());
        this.voiceCommands.set('show help', () => this.showHelp());
        
        this.voiceCommands.set('stop listening', () => this.stopListening());
        this.voiceCommands.set('stop', () => this.stopListening());
        this.voiceCommands.set('cancel', () => this.stopListening());
        
        this.voiceCommands.set('start continuous mode', () => this.startContinuousMode());
        this.voiceCommands.set('stop continuous mode', () => this.stopContinuousMode());
        
        // Vehicle lookup commands
        this.contextualCommands.set('vehicle-lookup', new Map([
            ['search by vin', () => this.focusVinSearch()],
            ['search by license plate', () => this.focusLicenseSearch()],
            ['show vehicle details', () => this.showVehicleDetails()],
            ['clear search', () => this.clearSearch()],
            ['new search', () => this.newSearch()]
        ]));
        
        // Diagnostic commands
        this.contextualCommands.set('diagnostic', new Map([
            ['start scan', () => this.startDiagnosticScan()],
            ['stop scan', () => this.stopDiagnosticScan()],
            ['clear codes', () => this.clearDiagnosticCodes()],
            ['show live data', () => this.showLiveData()],
            ['run test', () => this.runDiagnosticTest()],
            ['save report', () => this.saveDiagnosticReport()]
        ]));
        
        // Marketplace commands
        this.contextualCommands.set('marketplace', new Map([
            ['add to cart', () => this.addToCart()],
            ['view cart', () => this.viewCart()],
            ['checkout', () => this.checkout()],
            ['filter by price', () => this.filterByPrice()],
            ['sort by rating', () => this.sortByRating()],
            ['show categories', () => this.showCategories()]
        ]));
        
        // Analytics commands
        this.contextualCommands.set('analytics', new Map([
            ['show revenue', () => this.showRevenue()],
            ['show performance', () => this.showPerformance()],
            ['generate report', () => this.generateReport()],
            ['export data', () => this.exportAnalytics()],
            ['refresh data', () => this.refreshAnalytics()]
        ]));
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('voice_settings') || '{}');
        this.currentLanguage = settings.language || 'en-US';
        this.confidenceThreshold = settings.confidenceThreshold || 0.7;
        this.isWakeWordMode = settings.wakeWordMode || false;
        this.continuousMode = settings.continuousMode || false;
        
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage;
        }
    }

    saveSettings() {
        const settings = {
            language: this.currentLanguage,
            confidenceThreshold: this.confidenceThreshold,
            wakeWordMode: this.isWakeWordMode,
            continuousMode: this.continuousMode
        };
        localStorage.setItem('voice_settings', JSON.stringify(settings));
    }

    startListening() {
        if (!this.isEnabled || this.isListening) return;
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    }

    stopListening() {
        if (!this.isEnabled || !this.isListening) return;
        
        this.recognition.stop();
        this.continuousMode = false;
        this.speak('Voice commands stopped');
    }

    startContinuousMode() {
        this.continuousMode = true;
        this.speak('Continuous mode activated');
        if (!this.isListening) {
            this.startListening();
        }
    }

    stopContinuousMode() {
        this.continuousMode = false;
        this.speak('Continuous mode deactivated');
    }

    processResult(event) {
        const results = event.results;
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < results.length; i++) {
            const result = results[i];
            const transcript = result[0].transcript.toLowerCase().trim();
            
            if (result.isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Update UI with interim results
        this.updateTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript) {
            this.processCommand(finalTranscript, results[event.resultIndex][0].confidence);
        }
    }

    processCommand(transcript, confidence) {
        console.log(`Processing command: "${transcript}" (confidence: ${confidence})`);
        
        // Check confidence threshold
        if (confidence < this.confidenceThreshold) {
            this.speak('I didn\'t understand that clearly. Please try again.');
            return;
        }
        
        // Add to command history
        this.commandHistory.push({
            transcript,
            confidence,
            timestamp: new Date().toISOString(),
            context: this.currentContext
        });
        
        // Check for wake words if in wake word mode
        if (this.isWakeWordMode && !this.checkWakeWord(transcript)) {
            return;
        }
        
        // Process command
        const commandFound = this.executeCommand(transcript);
        
        if (!commandFound) {
            this.handleUnknownCommand(transcript);
        }
        
        // Keep only last 50 commands
        if (this.commandHistory.length > 50) {
            this.commandHistory.splice(0, this.commandHistory.length - 50);
        }
        
        // Save command history
        localStorage.setItem('voice_command_history', JSON.stringify(this.commandHistory));
    }

    checkWakeWord(transcript) {
        return this.wakeWords.some(wakeWord => 
            transcript.includes(wakeWord.toLowerCase())
        );
    }

    executeCommand(transcript) {
        // Check contextual commands first
        const contextCommands = this.contextualCommands.get(this.currentContext);
        if (contextCommands) {
            for (const [command, action] of contextCommands) {
                if (transcript.includes(command)) {
                    action();
                    return true;
                }
            }
        }
        
        // Check global commands
        for (const [command, action] of this.voiceCommands) {
            if (transcript.includes(command)) {
                if (command.includes('search for') || command.includes('find') || command.includes('look for')) {
                    const query = transcript.replace(command, '').trim();
                    action(query);
                } else {
                    action();
                }
                return true;
            }
        }
        
        // Check for number-based commands
        if (this.processNumberCommand(transcript)) {
            return true;
        }
        
        return false;
    }

    processNumberCommand(transcript) {
        // Handle commands like "click item 3" or "select option 2"
        const numberMatch = transcript.match(/(?:click|select|choose|item|option)\s+(\d+)/);
        if (numberMatch) {
            const number = parseInt(numberMatch[1]);
            this.clickItemByNumber(number);
            return true;
        }
        
        // Handle "scroll up" or "scroll down"
        if (transcript.includes('scroll up')) {
            this.scrollPage('up');
            return true;
        } else if (transcript.includes('scroll down')) {
            this.scrollPage('down');
            return true;
        }
        
        return false;
    }

    handleUnknownCommand(transcript) {
        const suggestions = this.getSuggestions(transcript);
        
        if (suggestions.length > 0) {
            this.speak(`I didn't understand that. Did you mean: ${suggestions[0]}?`);
        } else {
            this.speak('I didn\'t understand that command. Say "help" to see available commands.');
        }
    }

    getSuggestions(transcript) {
        const allCommands = Array.from(this.voiceCommands.keys());
        const contextCommands = this.contextualCommands.get(this.currentContext);
        
        if (contextCommands) {
            allCommands.push(...Array.from(contextCommands.keys()));
        }
        
        // Simple similarity check
        const suggestions = allCommands.filter(command => {
            const words = command.split(' ');
            const transcriptWords = transcript.split(' ');
            
            return words.some(word => 
                transcriptWords.some(tWord => 
                    this.levenshteinDistance(word, tWord) <= 2
                )
            );
        });
        
        return suggestions.slice(0, 3);
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    speak(text, options = {}) {
        if (!this.synthesis) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.selectedVoice;
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        
        utterance.onstart = () => {
            console.log('Speaking:', text);
        };
        
        utterance.onend = () => {
            console.log('Speech finished');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
        };
        
        this.synthesis.speak(utterance);
    }

    // Command implementations
    navigateTo(section) {
        if (window.app && window.app.showSection) {
            window.app.showSection(section);
            this.currentContext = section;
            this.speak(`Navigating to ${section.replace('-', ' ')}`);
        }
    }

    performSearch(query) {
        if (!query) {
            this.speak('What would you like to search for?');
            return;
        }
        
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
        if (searchInput) {
            searchInput.value = query;
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.speak(`Searching for ${query}`);
        } else {
            this.speak('Search function not available in this section');
        }
    }

    showHelp() {
        const commands = this.getAvailableCommands();
        this.speak('Available commands include: ' + commands.slice(0, 5).join(', '));
        
        // Show help modal
        this.showHelpModal(commands);
    }

    showHelpModal(commands) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Voice Commands Help</h3>
                    <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-content">
                    <div class="help-sections">
                        <div class="help-section">
                            <h4>Global Commands</h4>
                            <ul>
                                ${Array.from(this.voiceCommands.keys()).map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4>Current Context: ${this.currentContext}</h4>
                            <ul>
                                ${this.getContextualCommands().map(cmd => `<li>"${cmd}"</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4>Tips</h4>
                            <ul>
                                <li>Speak clearly and at normal pace</li>
                                <li>Use "Hey Repair Bridge" as a wake word</li>
                                <li>Say "stop" to stop listening</li>
                                <li>Say "help" for this menu</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    getAvailableCommands() {
        const globalCommands = Array.from(this.voiceCommands.keys());
        const contextCommands = this.getContextualCommands();
        return [...globalCommands, ...contextCommands];
    }

    getContextualCommands() {
        const contextCommands = this.contextualCommands.get(this.currentContext);
        return contextCommands ? Array.from(contextCommands.keys()) : [];
    }

    // Context-specific command implementations
    focusVinSearch() {
        const vinInput = document.querySelector('input[placeholder*="VIN"]');
        if (vinInput) {
            vinInput.focus();
            this.speak('VIN search focused');
        }
    }

    focusLicenseSearch() {
        const licenseInput = document.querySelector('input[placeholder*="license"]');
        if (licenseInput) {
            licenseInput.focus();
            this.speak('License plate search focused');
        }
    }

    showVehicleDetails() {
        const detailsButton = document.querySelector('button[onclick*="details"]');
        if (detailsButton) {
            detailsButton.click();
            this.speak('Showing vehicle details');
        }
    }

    clearSearch() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[type="text"]');
        searchInputs.forEach(input => input.value = '');
        this.speak('Search cleared');
    }

    newSearch() {
        this.clearSearch();
        this.speak('Ready for new search');
    }

    startDiagnosticScan() {
        const scanButton = document.querySelector('button[onclick*="scan"]');
        if (scanButton) {
            scanButton.click();
            this.speak('Starting diagnostic scan');
        }
    }

    stopDiagnosticScan() {
        const stopButton = document.querySelector('button[onclick*="stop"]');
        if (stopButton) {
            stopButton.click();
            this.speak('Stopping diagnostic scan');
        }
    }

    clearDiagnosticCodes() {
        if (window.diagnosticManager && window.diagnosticManager.clearCodes) {
            window.diagnosticManager.clearCodes();
            this.speak('Diagnostic codes cleared');
        }
    }

    showLiveData() {
        const liveDataButton = document.querySelector('button[onclick*="live"]');
        if (liveDataButton) {
            liveDataButton.click();
            this.speak('Showing live data');
        }
    }

    runDiagnosticTest() {
        const testButton = document.querySelector('button[onclick*="test"]');
        if (testButton) {
            testButton.click();
            this.speak('Running diagnostic test');
        }
    }

    saveDiagnosticReport() {
        if (window.diagnosticManager && window.diagnosticManager.saveReport) {
            window.diagnosticManager.saveReport();
            this.speak('Diagnostic report saved');
        }
    }

    // Utility methods
    clickItemByNumber(number) {
        const clickableItems = document.querySelectorAll('button, a, .clickable');
        if (clickableItems[number - 1]) {
            clickableItems[number - 1].click();
            this.speak(`Clicked item ${number}`);
        } else {
            this.speak(`Item ${number} not found`);
        }
    }

    scrollPage(direction) {
        const scrollAmount = direction === 'up' ? -300 : 300;
        window.scrollBy(0, scrollAmount);
        this.speak(`Scrolled ${direction}`);
    }

    updateUI() {
        const voiceButton = document.querySelector('.voice-control-btn');
        if (voiceButton) {
            voiceButton.classList.toggle('listening', this.isListening);
            voiceButton.classList.toggle('continuous', this.continuousMode);
        }
        
        const statusIndicator = document.querySelector('.voice-status');
        if (statusIndicator) {
            statusIndicator.textContent = this.isListening ? 'Listening...' : 'Ready';
        }
    }

    updateTranscript(text) {
        const transcriptEl = document.querySelector('.voice-transcript');
        if (transcriptEl) {
            transcriptEl.textContent = text;
        }
    }

    showMicrophonePermissionError() {
        if (window.notificationManager) {
            window.notificationManager.showNotification(
                'Microphone access denied. Please allow microphone access to use voice commands.',
                'error'
            );
        }
    }

    // Settings methods
    setLanguage(language) {
        this.currentLanguage = language;
        if (this.recognition) {
            this.recognition.lang = language;
        }
        this.loadVoices();
        this.saveSettings();
        this.speak(`Language changed to ${language}`);
    }

    setConfidenceThreshold(threshold) {
        this.confidenceThreshold = threshold;
        this.saveSettings();
        this.speak(`Confidence threshold set to ${threshold}`);
    }

    toggleWakeWordMode() {
        this.isWakeWordMode = !this.isWakeWordMode;
        this.saveSettings();
        this.speak(`Wake word mode ${this.isWakeWordMode ? 'enabled' : 'disabled'}`);
    }

    // Update context when navigating
    updateContext(newContext) {
        this.currentContext = newContext;
        console.log(`Voice context updated to: ${newContext}`);
    }

    // Public API methods
    isSupported() {
        return this.isEnabled;
    }

    getCommandHistory() {
        return this.commandHistory;
    }

    getAvailableLanguages() {
        return [
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'es-ES', name: 'Spanish' },
            { code: 'fr-FR', name: 'French' },
            { code: 'de-DE', name: 'German' },
            { code: 'it-IT', name: 'Italian' },
            { code: 'pt-BR', name: 'Portuguese' },
            { code: 'zh-CN', name: 'Chinese' },
            { code: 'ja-JP', name: 'Japanese' },
            { code: 'ko-KR', name: 'Korean' }
        ];
    }

    // Cleanup
    cleanup() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        this.saveSettings();
    }
}

// Initialize voice command system
window.voiceCommandSystem = new VoiceCommandSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCommandSystem;
}
