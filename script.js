// Network configurations
const NETWORKS = {
    ethereum: {
        name: 'Ethereum Mainnet',
        rpc: 'https://mainnet.infura.io/v3/c7646448da474d328123576232a8c192',
        currency: 'ETH',
        symbol: '🔷',
        chainId: 1
    },
    polygon: {
        name: 'Polygon',
        rpc: 'https://polygon-mainnet.infura.io/v3/c7646448da474d328123576232a8c192',
        currency: 'MATIC',
        symbol: '🟣',
        chainId: 137
    },
    base: {
        name: 'Base',
        rpc: 'https://base-mainnet.infura.io/v3/c7646448da474d328123576232a8c192',
        currency: 'ETH',
        symbol: '🔵',
        chainId: 8453
    },
    sepolia: {
        name: 'Sepolia Testnet',
        rpc: 'https://sepolia.infura.io/v3/c7646448da474d328123576232a8c192',
        currency: 'SepoliaETH',
        symbol: '🧪',
        chainId: 11155111
    }
};

// Global variables
let provider;
let currentNetwork = 'ethereum';

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Multi-Network Balance Checker Ready!');
    
    // Initialize with default network
    updateNetwork();
});

// Function to update network when user changes selection
function updateNetwork() {
    const networkSelect = document.getElementById('network');
    currentNetwork = networkSelect.value;
    
    console.log(`🔄 Switching to ${NETWORKS[currentNetwork].name}`);
    
    // Update provider with new network
    provider = new ethers.JsonRpcProvider(NETWORKS[currentNetwork].rpc);
    
    // Update UI
    updateNetworkDisplay();
    
    // Clear previous results
    hideResult();
    hideError();
}

// Function to update network display
function updateNetworkDisplay() {
    const network = NETWORKS[currentNetwork];
    
    // Update network info section
    document.getElementById('current-network').innerHTML = 
        `Current Network: <strong>${network.symbol} ${network.name}</strong>`;
    document.getElementById('network-currency').innerHTML = 
        `Native Currency: <strong>${network.currency}</strong>`;
    
    // Update network info styling
    const networkInfo = document.getElementById('network-info');
    networkInfo.className = `network-info network-${currentNetwork}`;
}

// Enhanced balance checking function
async function checkBalance() {
    const addressInput = document.getElementById('address');
    const address = addressInput.value.trim();
    
    if (!address) {
        showError('Please enter an Ethereum address');
        return;
    }
    
    showLoading();
    hideError();
    hideResult();
    
    try {
        // Validate address format
        if (!ethers.isAddress(address)) {
            throw new Error('Invalid Ethereum address format');
        }
        
        // Get network info
        const network = NETWORKS[currentNetwork];
        
        console.log(`📡 Fetching balance on ${network.name} for:`, address);
        
        // Get balance from current network
        const balanceWei = await provider.getBalance(address);
        const balanceEther = ethers.formatEther(balanceWei);
        
        // Show result with network info
        showResult(address, balanceEther, balanceWei, network);
        
        console.log('✅ Balance fetched successfully');
        
    } catch (error) {
        console.error('❌ Error:', error);
        
        if (error.message.includes('Invalid')) {
            showError('Invalid Ethereum address. Please check and try again.');
        } else if (error.message.includes('network') || error.code === 'NETWORK_ERROR') {
            showError(`Network error on ${NETWORKS[currentNetwork].name}. Please try again.`);
        } else {
            showError('Something went wrong. Please try again.');
        }
    } finally {
        hideLoading();
    }
}

// Enhanced result display function
function showResult(address, balanceEther, balanceWei, network) {
    const resultDiv = document.getElementById('result');
    const balanceDisplay = document.getElementById('balance-display');
    const addressDisplay = document.getElementById('address-display');
    const networkDisplay = document.getElementById('network-display');
    
    balanceDisplay.innerHTML = `
        <strong>💰 Balance: ${parseFloat(balanceEther).toFixed(6)} ${network.currency}</strong><br>
        <small>Wei: ${balanceWei.toString()}</small>
    `;
    
    addressDisplay.innerHTML = `
        <strong>📍 Address:</strong> ${address}
    `;
    
    networkDisplay.innerHTML = `
        <strong>🌐 Network:</strong> ${network.symbol} ${network.name}
    `;
    
    resultDiv.classList.remove('hidden');
}

// Helper function to show errors
function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = `❌ ${message}`;
    errorDiv.classList.remove('hidden');
}

// Helper function to show loading
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Helper functions to hide elements
function hideResult() {
    document.getElementById('result').classList.add('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Add Enter key support
document.getElementById('address').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkBalance();
    }
});

// Quick network switching with keyboard shortcuts (bonus feature!)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                document.getElementById('network').value = 'ethereum';
                updateNetwork();
                break;
            case '2':
                document.getElementById('network').value = 'polygon';
                updateNetwork();
                break;
            case '3':
                document.getElementById('network').value = 'base';
                updateNetwork();
                break;
            case '4':
                document.getElementById('network').value = 'sepolia';
                updateNetwork();
                break;
        }
    }
});