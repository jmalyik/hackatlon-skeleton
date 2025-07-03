// Authentication utilities
const API_BASE_URL = 'http://localhost:8000';

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Get stored auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Store auth token
function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

// Remove auth token
function removeAuthToken() {
    localStorage.removeItem('authToken');
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/token/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        
        if (response.ok && data.auth_token) {
            setAuthToken(data.auth_token);
            return true;
        } else {
            console.error('Login failed:', data);
            return false;
        }
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Register function
async function register(username, email, firstName, lastName, password, passwordConfirm) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password,
                password_confirm: passwordConfirm
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            return true;
        } else {
            console.error('Registration failed:', data);
            return false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        return false;
    }
}

// Logout function
async function logout() {
    try {
        const token = getAuthToken();
        if (token) {
            await fetch(`${API_BASE_URL}/api/auth/token/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                }
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        removeAuthToken();
        window.location.href = 'index.html';
    }
}

// Get current user information
async function getCurrentUser() {
    try {
        const token = getAuthToken();
        if (!token) {
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/users/me/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to get current user');
            return null;
        }
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}
