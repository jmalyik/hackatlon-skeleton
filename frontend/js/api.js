// API communication utilities
// API_BASE_URL is defined in auth.js

// Generic API call function
async function apiCall(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    // Add authentication token if required
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        } else {
            throw new Error('Authentication required but no token found');
        }
    }

    const options = {
        method: method,
        headers: headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Test public API endpoint
async function testPublicAPI() {
    const resultDiv = document.getElementById('publicApiResult');
    const button = document.querySelector('button[onclick="testPublicAPI()"]');
    
    // Show loading state
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Testing...';
    }
    
    try {
        const response = await apiCall('/api/hello/', 'GET', null, false);
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="alert alert-success">
            <strong>✅ API Response:</strong><br>
            <pre>${JSON.stringify(response, null, 2)}</pre>
        </div>`;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `<div class="alert alert-danger">
            <strong>❌ API Error:</strong> ${error.message}
        </div>`;
    } finally {
        // Reset button state
        if (button) {
            button.disabled = false;
            button.innerHTML = 'Test Public API';
        }
    }
}

// Test authenticated API endpoint
async function testAuthenticatedAPI() {
    const resultDiv = document.getElementById('authenticatedApiResult');
    const button = document.querySelector('button[onclick="testAuthenticatedAPI()"]');
    
    // Show loading state
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Testing...';
    }
    
    try {
        const response = await apiCall('/api/hello-dear/', 'GET', null, true);
        resultDiv.innerHTML = `<div class="alert alert-success">
            <strong>✅ API Response:</strong><br>
            <pre>${JSON.stringify(response, null, 2)}</pre>
        </div>`;
    } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger">
            <strong>❌ API Error:</strong> ${error.message}
        </div>`;
    } finally {
        // Reset button state
        if (button) {
            button.disabled = false;
            button.innerHTML = 'Test Authenticated API';
        }
    }
}

// Helper function to handle API errors
function handleApiError(error, targetElement) {
    console.error('API Error:', error);
    if (targetElement) {
        targetElement.innerHTML = `<div class="alert alert-danger">
            <strong>Error:</strong> ${error.message}
        </div>`;
    }
}

// Helper function to show loading state
function showLoading(targetElement, message = 'Loading...') {
    if (targetElement) {
        targetElement.innerHTML = `<div class="text-center">
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            ${message}
        </div>`;
    }
}

// Helper function to clear content
function clearContent(targetElement) {
    if (targetElement) {
        targetElement.innerHTML = '';
    }
}
