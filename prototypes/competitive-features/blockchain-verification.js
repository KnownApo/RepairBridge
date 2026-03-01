/**
 * Blockchain Verification System
 * Immutable vehicle history and certification
 */

class BlockchainVerificationSystem {
    constructor() {
        this.blockchain = [];
        this.pendingTransactions = [];
        this.certificates = new Map();
        this.hashAlgorithm = 'SHA-256';
        this.difficulty = 4;
        this.miningReward = 10;
        this.walletAddress = 'REPAIRBRIDGE_WALLET';
        this.networkPeers = [];
        this.consensusThreshold = 0.51;
        this.init();
    }

    init() {
        this.loadBlockchain();
        this.createGenesisBlock();
        this.loadCertificates();
        this.setupNetworkSimulation();
        console.log('Blockchain Verification System initialized');
    }

    createGenesisBlock() {
        if (this.blockchain.length === 0) {
            const genesisBlock = new Block(0, Date.now(), {
                type: 'genesis',
                message: 'RepairBridge Genesis Block',
                timestamp: new Date().toISOString()
            }, '0');
            
            genesisBlock.mineBlock(this.difficulty);
            this.blockchain.push(genesisBlock);
            this.saveBlockchain();
        }
    }

    loadBlockchain() {
        const saved = localStorage.getItem('blockchain_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.blockchain = data.map(blockData => {
                const block = new Block(
                    blockData.index,
                    blockData.timestamp,
                    blockData.data,
                    blockData.previousHash
                );
                block.hash = blockData.hash;
                block.nonce = blockData.nonce;
                return block;
            });
        }
    }

    saveBlockchain() {
        localStorage.setItem('blockchain_data', JSON.stringify(this.blockchain));
    }

    loadCertificates() {
        const saved = localStorage.getItem('blockchain_certificates');
        if (saved) {
            const certificates = JSON.parse(saved);
            certificates.forEach(cert => {
                this.certificates.set(cert.id, cert);
            });
        }
    }

    saveCertificates() {
        const certificates = Array.from(this.certificates.values());
        localStorage.setItem('blockchain_certificates', JSON.stringify(certificates));
    }

    setupNetworkSimulation() {
        // Simulate network peers for consensus
        this.networkPeers = [
            { id: 'NODE_001', reputation: 0.95, location: 'US-East' },
            { id: 'NODE_002', reputation: 0.92, location: 'US-West' },
            { id: 'NODE_003', reputation: 0.88, location: 'EU-Central' },
            { id: 'NODE_004', reputation: 0.90, location: 'Asia-Pacific' },
            { id: 'NODE_005', reputation: 0.85, location: 'Canada' }
        ];
    }

    // Create a new transaction
    createTransaction(data) {
        const transaction = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            data: data,
            signature: this.signTransaction(data),
            status: 'pending'
        };
        
        this.pendingTransactions.push(transaction);
        return transaction;
    }

    // Mine pending transactions
    minePendingTransactions() {
        if (this.pendingTransactions.length === 0) {
            return null;
        }
        
        const block = new Block(
            this.blockchain.length,
            Date.now(),
            {
                transactions: this.pendingTransactions,
                miner: this.walletAddress
            },
            this.getLatestBlock().hash
        );
        
        block.mineBlock(this.difficulty);
        this.blockchain.push(block);
        
        // Clear pending transactions
        this.pendingTransactions = [];
        
        // Save blockchain
        this.saveBlockchain();
        
        // Broadcast to network
        this.broadcastBlock(block);
        
        return block;
    }

    // Get the latest block
    getLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    }

    // Validate the blockchain
    isChainValid() {
        for (let i = 1; i < this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const previousBlock = this.blockchain[i - 1];
            
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }
            
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        
        return true;
    }

    // Vehicle-specific blockchain methods
    recordVehicleHistory(vehicleData) {
        const historyRecord = {
            type: 'vehicle_history',
            vin: vehicleData.vin,
            action: vehicleData.action,
            details: vehicleData.details,
            timestamp: new Date().toISOString(),
            verifiedBy: vehicleData.verifiedBy || 'system',
            location: vehicleData.location
        };
        
        return this.createTransaction(historyRecord);
    }

    recordMaintenanceEvent(maintenanceData) {
        const maintenanceRecord = {
            type: 'maintenance',
            vin: maintenanceData.vin,
            serviceType: maintenanceData.serviceType,
            parts: maintenanceData.parts,
            labor: maintenanceData.labor,
            cost: maintenanceData.cost,
            serviceProvider: maintenanceData.serviceProvider,
            timestamp: new Date().toISOString(),
            warranty: maintenanceData.warranty,
            certifications: maintenanceData.certifications
        };
        
        return this.createTransaction(maintenanceRecord);
    }

    recordInspectionResult(inspectionData) {
        const inspectionRecord = {
            type: 'inspection',
            vin: inspectionData.vin,
            inspectionType: inspectionData.inspectionType,
            results: inspectionData.results,
            passed: inspectionData.passed,
            inspector: inspectionData.inspector,
            facility: inspectionData.facility,
            timestamp: new Date().toISOString(),
            validUntil: inspectionData.validUntil,
            certificateNumber: inspectionData.certificateNumber
        };
        
        return this.createTransaction(inspectionRecord);
    }

    recordOwnershipTransfer(transferData) {
        const transferRecord = {
            type: 'ownership_transfer',
            vin: transferData.vin,
            fromOwner: transferData.fromOwner,
            toOwner: transferData.toOwner,
            salePrice: transferData.salePrice,
            timestamp: new Date().toISOString(),
            dealership: transferData.dealership,
            lienHolder: transferData.lienHolder,
            titleNumber: transferData.titleNumber
        };
        
        return this.createTransaction(transferRecord);
    }

    recordRecallNotice(recallData) {
        const recallRecord = {
            type: 'recall',
            vin: recallData.vin,
            recallNumber: recallData.recallNumber,
            manufacturer: recallData.manufacturer,
            description: recallData.description,
            severity: recallData.severity,
            repairRequired: recallData.repairRequired,
            timestamp: new Date().toISOString(),
            completedDate: recallData.completedDate
        };
        
        return this.createTransaction(recallRecord);
    }

    // Certificate management
    createCertificate(certificateData) {
        const certificate = {
            id: this.generateId(),
            type: certificateData.type,
            vin: certificateData.vin,
            issuer: certificateData.issuer,
            issuedDate: new Date().toISOString(),
            validUntil: certificateData.validUntil,
            data: certificateData.data,
            signature: this.signCertificate(certificateData),
            blockHash: null, // Will be set when mined
            verified: false
        };
        
        this.certificates.set(certificate.id, certificate);
        
        // Record certificate creation on blockchain
        this.createTransaction({
            type: 'certificate_created',
            certificateId: certificate.id,
            certificateData: certificate
        });
        
        this.saveCertificates();
        return certificate;
    }

    verifyCertificate(certificateId) {
        const certificate = this.certificates.get(certificateId);
        if (!certificate) {
            return { valid: false, reason: 'Certificate not found' };
        }
        
        // Verify signature
        const signatureValid = this.verifySignature(certificate.data, certificate.signature);
        if (!signatureValid) {
            return { valid: false, reason: 'Invalid signature' };
        }
        
        // Check if certificate is on blockchain
        const blockchainRecord = this.findCertificateOnBlockchain(certificateId);
        if (!blockchainRecord) {
            return { valid: false, reason: 'Certificate not found on blockchain' };
        }
        
        // Check expiration
        if (certificate.validUntil && new Date(certificate.validUntil) < new Date()) {
            return { valid: false, reason: 'Certificate expired' };
        }
        
        return { valid: true, certificate: certificate, blockHash: blockchainRecord.hash };
    }

    findCertificateOnBlockchain(certificateId) {
        for (const block of this.blockchain) {
            if (block.data.transactions) {
                for (const transaction of block.data.transactions) {
                    if (transaction.data.type === 'certificate_created' &&
                        transaction.data.certificateId === certificateId) {
                        return block;
                    }
                }
            }
        }
        return null;
    }

    // Get vehicle history from blockchain
    getVehicleHistory(vin) {
        const history = [];
        
        for (const block of this.blockchain) {
            if (block.data.transactions) {
                for (const transaction of block.data.transactions) {
                    if (transaction.data.vin === vin) {
                        history.push({
                            ...transaction.data,
                            blockHash: block.hash,
                            blockIndex: block.index,
                            verified: true
                        });
                    }
                }
            }
        }
        
        return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Verify vehicle authenticity
    verifyVehicleAuthenticity(vin) {
        const history = this.getVehicleHistory(vin);
        
        if (history.length === 0) {
            return { authentic: false, reason: 'No blockchain records found' };
        }
        
        // Check for suspicious patterns
        const suspiciousIndicators = this.detectSuspiciousActivity(history);
        
        if (suspiciousIndicators.length > 0) {
            return { 
                authentic: false, 
                reason: 'Suspicious activity detected',
                indicators: suspiciousIndicators 
            };
        }
        
        return { 
            authentic: true, 
            history: history,
            recordCount: history.length 
        };
    }

    detectSuspiciousActivity(history) {
        const indicators = [];
        
        // Check for rapid ownership changes
        const ownershipChanges = history.filter(h => h.type === 'ownership_transfer');
        if (ownershipChanges.length > 3) {
            const rapidChanges = ownershipChanges.filter((change, index) => {
                if (index === 0) return false;
                const prevChange = ownershipChanges[index - 1];
                const daysDiff = (new Date(change.timestamp) - new Date(prevChange.timestamp)) / (1000 * 60 * 60 * 24);
                return daysDiff < 30;
            });
            
            if (rapidChanges.length > 0) {
                indicators.push('Rapid ownership changes detected');
            }
        }
        
        // Check for maintenance inconsistencies
        const maintenanceRecords = history.filter(h => h.type === 'maintenance');
        for (let i = 1; i < maintenanceRecords.length; i++) {
            const current = maintenanceRecords[i];
            const previous = maintenanceRecords[i - 1];
            
            if (current.details?.odometer && previous.details?.odometer) {
                if (current.details.odometer < previous.details.odometer) {
                    indicators.push('Odometer rollback detected');
                }
            }
        }
        
        // Check for missing inspection records
        const inspections = history.filter(h => h.type === 'inspection');
        if (inspections.length === 0 && history.length > 5) {
            indicators.push('Missing inspection records');
        }
        
        return indicators;
    }

    // Smart contract simulation
    executeSmartContract(contractData) {
        // Simulate smart contract execution
        const contract = {
            id: this.generateId(),
            type: contractData.type,
            conditions: contractData.conditions,
            actions: contractData.actions,
            parties: contractData.parties,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        // Validate conditions
        const conditionsMet = this.validateContractConditions(contract);
        
        if (conditionsMet) {
            contract.status = 'executed';
            contract.executedAt = new Date().toISOString();
            
            // Execute actions
            this.executeContractActions(contract);
            
            // Record on blockchain
            this.createTransaction({
                type: 'smart_contract_executed',
                contractId: contract.id,
                contractData: contract
            });
        }
        
        return contract;
    }

    validateContractConditions(contract) {
        // Simulate condition validation
        // In reality, this would check against real data
        return Math.random() > 0.2; // 80% success rate for demo
    }

    executeContractActions(contract) {
        // Simulate action execution
        contract.actions.forEach(action => {
            console.log(`Executing action: ${action.type}`);
            
            switch (action.type) {
                case 'transfer_payment':
                    this.processPayment(action.data);
                    break;
                case 'update_ownership':
                    this.updateOwnership(action.data);
                    break;
                case 'issue_certificate':
                    this.createCertificate(action.data);
                    break;
                case 'schedule_maintenance':
                    this.scheduleMaintenanceReminder(action.data);
                    break;
            }
        });
    }

    processPayment(paymentData) {
        // Simulate payment processing
        console.log(`Processing payment: ${paymentData.amount} from ${paymentData.from} to ${paymentData.to}`);
    }

    updateOwnership(ownershipData) {
        // Simulate ownership update
        console.log(`Updating ownership: ${ownershipData.vin} to ${ownershipData.newOwner}`);
    }

    scheduleMaintenanceReminder(maintenanceData) {
        // Simulate maintenance reminder
        console.log(`Scheduling maintenance reminder for ${maintenanceData.vin}`);
    }

    // Consensus mechanism simulation
    requestConsensus(proposedBlock) {
        // Simulate network consensus
        const votes = this.networkPeers.map(peer => ({
            peerId: peer.id,
            vote: Math.random() > 0.1 ? 'approve' : 'reject', // 90% approval rate
            reputation: peer.reputation,
            timestamp: new Date().toISOString()
        }));
        
        const approvals = votes.filter(v => v.vote === 'approve');
        const totalReputation = votes.reduce((sum, v) => sum + v.reputation, 0);
        const approvalReputation = approvals.reduce((sum, v) => sum + v.reputation, 0);
        
        const consensusReached = (approvalReputation / totalReputation) >= this.consensusThreshold;
        
        return {
            consensusReached,
            votes,
            approvalPercentage: (approvalReputation / totalReputation) * 100
        };
    }

    broadcastBlock(block) {
        // Simulate block broadcasting
        console.log(`Broadcasting block ${block.index} to network`);
        
        // Request consensus
        const consensus = this.requestConsensus(block);
        
        if (consensus.consensusReached) {
            console.log(`Block ${block.index} accepted by network`);
            
            // Notify other modules
            if (window.integrationManager) {
                window.integrationManager.triggerEvent('blockchain-block-added', {
                    blockIndex: block.index,
                    blockHash: block.hash,
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            console.log(`Block ${block.index} rejected by network`);
        }
        
        return consensus;
    }

    // Utility methods
    generateId() {
        return 'BC_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    signTransaction(data) {
        // Simulate digital signature
        return this.hash(JSON.stringify(data) + 'PRIVATE_KEY');
    }

    signCertificate(data) {
        // Simulate certificate signing
        return this.hash(JSON.stringify(data) + 'CERTIFICATE_KEY');
    }

    verifySignature(data, signature) {
        // Simulate signature verification
        const expectedSignature = this.hash(JSON.stringify(data) + 'PRIVATE_KEY');
        return signature === expectedSignature;
    }

    hash(data) {
        // Simple hash function for demo (in production, use crypto.subtle)
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    // UI Methods
    renderBlockchainStatus() {
        return `
            <div class="blockchain-status">
                <div class="status-card">
                    <h4>Blockchain Status</h4>
                    <div class="status-item">
                        <span class="label">Total Blocks:</span>
                        <span class="value">${this.blockchain.length}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Pending Transactions:</span>
                        <span class="value">${this.pendingTransactions.length}</span>
                    </div>
                    <div class="status-item">
                        <span class="label">Chain Valid:</span>
                        <span class="value ${this.isChainValid() ? 'valid' : 'invalid'}">
                            ${this.isChainValid() ? '✓ Valid' : '✗ Invalid'}
                        </span>
                    </div>
                    <div class="status-item">
                        <span class="label">Network Peers:</span>
                        <span class="value">${this.networkPeers.length}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderRecentBlocks() {
        const recentBlocks = this.blockchain.slice(-5).reverse();
        
        return `
            <div class="recent-blocks">
                <h4>Recent Blocks</h4>
                <div class="blocks-list">
                    ${recentBlocks.map(block => this.renderBlockCard(block)).join('')}
                </div>
            </div>
        `;
    }

    renderBlockCard(block) {
        const transactionCount = block.data.transactions ? block.data.transactions.length : 0;
        const blockTime = new Date(block.timestamp).toLocaleString();
        
        return `
            <div class="block-card">
                <div class="block-header">
                    <span class="block-index">#${block.index}</span>
                    <span class="block-time">${blockTime}</span>
                </div>
                <div class="block-info">
                    <div class="info-item">
                        <span class="label">Hash:</span>
                        <span class="value hash">${block.hash.substring(0, 16)}...</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Transactions:</span>
                        <span class="value">${transactionCount}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Nonce:</span>
                        <span class="value">${block.nonce}</span>
                    </div>
                </div>
                <div class="block-actions">
                    <button class="btn btn-sm" onclick="blockchainSystem.viewBlockDetails(${block.index})">
                        View Details
                    </button>
                </div>
            </div>
        `;
    }

    renderCertificates() {
        const certificates = Array.from(this.certificates.values());
        
        return `
            <div class="certificates-section">
                <h4>Digital Certificates</h4>
                <div class="certificates-grid">
                    ${certificates.map(cert => this.renderCertificateCard(cert)).join('')}
                </div>
            </div>
        `;
    }

    renderCertificateCard(certificate) {
        const isExpired = certificate.validUntil && new Date(certificate.validUntil) < new Date();
        const statusClass = isExpired ? 'expired' : 'valid';
        
        return `
            <div class="certificate-card ${statusClass}">
                <div class="cert-header">
                    <h5>${certificate.type}</h5>
                    <span class="cert-status ${statusClass}">
                        ${isExpired ? 'Expired' : 'Valid'}
                    </span>
                </div>
                <div class="cert-info">
                    <div class="info-item">
                        <span class="label">VIN:</span>
                        <span class="value">${certificate.vin}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Issuer:</span>
                        <span class="value">${certificate.issuer}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Issued:</span>
                        <span class="value">${new Date(certificate.issuedDate).toLocaleDateString()}</span>
                    </div>
                    ${certificate.validUntil ? `
                        <div class="info-item">
                            <span class="label">Valid Until:</span>
                            <span class="value">${new Date(certificate.validUntil).toLocaleDateString()}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="cert-actions">
                    <button class="btn btn-sm" onclick="blockchainSystem.verifyCertificateUI('${certificate.id}')">
                        Verify
                    </button>
                    <button class="btn btn-sm" onclick="blockchainSystem.viewCertificateDetails('${certificate.id}')">
                        Details
                    </button>
                </div>
            </div>
        `;
    }

    // UI Event Handlers
    viewBlockDetails(blockIndex) {
        const block = this.blockchain[blockIndex];
        if (!block) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Block Details - #${block.index}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-content">
                    <div class="block-details">
                        <div class="detail-section">
                            <h4>Block Information</h4>
                            <div class="detail-item">
                                <span class="label">Index:</span>
                                <span class="value">${block.index}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Timestamp:</span>
                                <span class="value">${new Date(block.timestamp).toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Hash:</span>
                                <span class="value hash">${block.hash}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Previous Hash:</span>
                                <span class="value hash">${block.previousHash}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Nonce:</span>
                                <span class="value">${block.nonce}</span>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Transactions</h4>
                            <div class="transactions-list">
                                ${block.data.transactions ? block.data.transactions.map(tx => `
                                    <div class="transaction-item">
                                        <div class="tx-header">
                                            <span class="tx-id">${tx.id}</span>
                                            <span class="tx-type">${tx.data.type}</span>
                                        </div>
                                        <div class="tx-details">
                                            <pre>${JSON.stringify(tx.data, null, 2)}</pre>
                                        </div>
                                    </div>
                                `).join('') : '<p>No transactions</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    verifyCertificateUI(certificateId) {
        const verification = this.verifyCertificate(certificateId);
        
        if (window.notificationManager) {
            if (verification.valid) {
                window.notificationManager.showNotification(
                    'Certificate verified successfully', 
                    'success'
                );
            } else {
                window.notificationManager.showNotification(
                    `Certificate verification failed: ${verification.reason}`, 
                    'error'
                );
            }
        }
    }

    viewCertificateDetails(certificateId) {
        const certificate = this.certificates.get(certificateId);
        if (!certificate) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Certificate Details</h3>
                    <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
                </div>
                <div class="modal-content">
                    <div class="certificate-details">
                        <div class="detail-section">
                            <h4>Certificate Information</h4>
                            <div class="detail-item">
                                <span class="label">ID:</span>
                                <span class="value">${certificate.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Type:</span>
                                <span class="value">${certificate.type}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">VIN:</span>
                                <span class="value">${certificate.vin}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Issuer:</span>
                                <span class="value">${certificate.issuer}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Issued Date:</span>
                                <span class="value">${new Date(certificate.issuedDate).toLocaleString()}</span>
                            </div>
                            ${certificate.validUntil ? `
                                <div class="detail-item">
                                    <span class="label">Valid Until:</span>
                                    <span class="value">${new Date(certificate.validUntil).toLocaleString()}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="detail-section">
                            <h4>Certificate Data</h4>
                            <pre>${JSON.stringify(certificate.data, null, 2)}</pre>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Verification</h4>
                            <button class="btn" onclick="blockchainSystem.verifyCertificateUI('${certificate.id}')">
                                Verify Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Public API
    getBlockchainInfo() {
        return {
            blockCount: this.blockchain.length,
            pendingTransactions: this.pendingTransactions.length,
            isValid: this.isChainValid(),
            certificates: this.certificates.size,
            networkPeers: this.networkPeers.length
        };
    }

    // Cleanup
    cleanup() {
        this.saveBlockchain();
        this.saveCertificates();
    }
}

// Block class
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return this.simpleHash(
            this.index + 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.data) + 
            this.nonce
        );
    }

    simpleHash(data) {
        // Simple hash function for demo
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join('0');
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`Block mined: ${this.hash}`);
    }

    hasValidTransactions() {
        // Validate transactions in the block
        if (!this.data.transactions) return true;
        
        for (const transaction of this.data.transactions) {
            if (!transaction.id || !transaction.timestamp || !transaction.data) {
                return false;
            }
        }
        
        return true;
    }
}

// Initialize blockchain system
window.blockchainSystem = new BlockchainVerificationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlockchainVerificationSystem;
}
