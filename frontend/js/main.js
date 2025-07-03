// Main application logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation based on authentication status
    updateNavigation();
    
    // Add fade-in animation to main content
    document.body.classList.add('fade-in');
});

// Update navigation based on authentication status
function updateNavigation() {
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const profileNav = document.getElementById('profileNav');
    const logoutNav = document.getElementById('logoutNav');
    
    if (isLoggedIn()) {
        // User is logged in - show profile and logout, hide login and register
        if (loginNav) loginNav.classList.add('d-none');
        if (registerNav) registerNav.classList.add('d-none');
        if (profileNav) profileNav.classList.remove('d-none');
        if (logoutNav) logoutNav.classList.remove('d-none');
    } else {
        // User is not logged in - show login and register, hide profile and logout
        if (loginNav) loginNav.classList.remove('d-none');
        if (registerNav) registerNav.classList.remove('d-none');
        if (profileNav) profileNav.classList.add('d-none');
        if (logoutNav) logoutNav.classList.add('d-none');
    }
}

// Global error handler for uncaught promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <strong>An error occurred:</strong> ${event.reason.message || 'Please try again later.'}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert error at the top of the page
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorDiv, container.firstChild);
    }
});

// Utility functions
function showMessage(message, type = 'info', targetElement = null) {
    const alertClass = `alert-${type}`;
    const messageHtml = `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    
    if (targetElement) {
        targetElement.innerHTML = messageHtml;
    } else {
        // Create a temporary message at the top of the page
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messageHtml;
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(tempDiv.firstChild, container.firstChild);
        }
    }
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // Basic password validation - at least 8 characters
    return password.length >= 8;
}

function validateForm(formData) {
    const errors = [];
    
    // Check required fields
    for (const [key, value] of Object.entries(formData)) {
        if (!value || value.trim() === '') {
            errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        }
    }
    
    // Validate email if present
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Validate password if present
    if (formData.password && !validatePassword(formData.password)) {
        errors.push('Password must be at least 8 characters long');
    }
    
    return errors;
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Local storage helpers
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function getLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

// Cookie helpers (if needed for future features)
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
