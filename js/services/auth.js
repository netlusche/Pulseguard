export class AuthService {
    constructor(baseUrl = './api') {
        this.baseUrl = baseUrl;
    }

    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/index.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Login failed');
        }
        const data = await response.json();
        
        if (data.require_2fa) {
            return data;
        }
        
        localStorage.setItem('pulseguard_token', data.token);
        localStorage.setItem('pulseguard_user', JSON.stringify(data.user));
        return data.user;
    }

    async verify2FA(email, code) {
        const response = await fetch(`${this.baseUrl}/index.php?action=verify_2fa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code })
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Invalid 2FA code');
        }
        
        const data = await response.json();
        localStorage.setItem('pulseguard_token', data.token);
        localStorage.setItem('pulseguard_user', JSON.stringify(data.user));
        return data.user;
    }

    async verifyToken(action, token) {
        const response = await fetch(`${this.baseUrl}/index.php?action=${action}&token=${token}`);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Verification failed');
        }
        return await response.json();
    }

    async register(email, password) {
        const response = await fetch(`${this.baseUrl}/index.php?action=register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Registration failed');
        }
        return await response.json();
    }

    async forgotPassword(email) {
        const response = await fetch(`${this.baseUrl}/index.php?action=forgot_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Request failed');
        }
        return await response.json();
    }

    async resetPassword(token, password) {
        const response = await fetch(`${this.baseUrl}/index.php?action=reset_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Reset failed');
        }
        return await response.json();
    }

    logout() {
        localStorage.removeItem('pulseguard_token');
        localStorage.removeItem('pulseguard_user');
    }

    async updateProfile(currentPassword, newEmail, newPassword) {
        const response = await fetch(`${this.baseUrl}/index.php?action=profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify({ currentPassword, newEmail, newPassword })
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || 'Profile update failed');
        }
        
        const data = await response.json();
        
        // Always save token/user. The API returns the currently active email in data.user
        localStorage.setItem('pulseguard_token', data.token);
        localStorage.setItem('pulseguard_user', JSON.stringify(data.user));
        return data;
    }

    async getSettings() {
        const response = await fetch(`${this.baseUrl}/index.php?action=settings`, {
            headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
        if (!response.ok) throw new Error('Failed to load settings');
        return await response.json();
    }

    async updateSettings(settings) {
        const response = await fetch(`${this.baseUrl}/index.php?action=settings`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(settings)
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return true;
    }

    getCurrentUser() {
        const user = localStorage.getItem('pulseguard_user');
        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return localStorage.getItem('pulseguard_token');
    }
}
