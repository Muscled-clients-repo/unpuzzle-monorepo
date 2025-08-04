import { fetchApi } from './api.js';

export class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.authCheckInterval = null;
    }

    async checkAuth() {
        try {
            const response = await fetchApi('/api/auth/check');
            const data = await response.json();
            
            this.isAuthenticated = data.authenticated;
            this.user = data.user || null;
            
            return data;
        } catch (error) {
            console.error('Auth check failed:', error);
            this.isAuthenticated = false;
            this.user = null;
            return { authenticated: false };
        }
    }

    async logout() {
        try {
            await fetchApi('/api/auth/logout', {
                method: 'POST'
            });
            
            this.isAuthenticated = false;
            this.user = null;
            
            // Redirect to main domain
            window.location.href = 'https://nazmulcodes.org';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async refreshToken() {
        try {
            await fetchApi('/api/auth/refresh', {
                method: 'POST'
            });
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    // Start periodic auth checking
    startAuthCheck(interval = 5 * 60 * 1000) { // 5 minutes
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }

        this.authCheckInterval = setInterval(async () => {
            const authData = await this.checkAuth();
            if (!authData.authenticated) {
                this.handleAuthFailure();
            }
        }, interval);
    }

    stopAuthCheck() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
            this.authCheckInterval = null;
        }
    }

    handleAuthFailure() {
        console.warn('Authentication lost, redirecting to login...');
        // You can customize this behavior
        window.location.href = 'https://nazmulcodes.org/signin';
    }

    // Initialize authentication
    async init() {
        await this.checkAuth();
        this.startAuthCheck();
        return this.isAuthenticated;
    }

    // Get user info
    getUser() {
        return this.user;
    }

    // Check if user is authenticated
    isAuth() {
        return this.isAuthenticated;
    }
}

// Global auth manager instance
window.authManager = new AuthManager();