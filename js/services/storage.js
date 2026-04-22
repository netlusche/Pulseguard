/**
 * Storage Abstraction Layer (Repository Pattern)
 * Scaling between LocalStorage and Backend (SQLite/MariaDB).
 */

class LocalStorageProvider {
    constructor(key = 'pulseguard_data') {
        this.key = key;
    }

    async getAll() {
        return JSON.parse(localStorage.getItem(this.key) || '[]');
    }

    async saveAll(measurements) {
        localStorage.setItem(this.key, JSON.stringify(measurements));
        return true;
    }
}

/**
 * PHP Backend Provider (SQLite / MariaDB Bridge)
 */
class PHPBackendProvider {
    constructor(baseUrl = './api') {
        this.baseUrl = baseUrl;
    }

    getHeaders() {
        const token = localStorage.getItem('pulseguard_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async getAll() {
        const response = await fetch(`${this.baseUrl}/index.php`, {
            headers: this.getHeaders()
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    }

    async save(measurement) {
        const response = await fetch(`${this.baseUrl}/index.php`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(measurement)
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    }

    async delete(id) {
        const response = await fetch(`${this.baseUrl}/index.php?id=${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        if (!response.ok) throw new Error('API Error');
        return await response.json();
    }
}

export class StorageService {
    constructor(provider) {
        // Default to PHP Backend now as requested
        this.provider = provider || new PHPBackendProvider();
    }

    async getMeasurements() {
        return await this.provider.getAll();
    }

    async addMeasurement(measurement) {
        // If it's the PHP backend, we use its save method
        if (this.provider.save) {
            return await this.provider.save(measurement);
        } else {
            // Fallback for LocalStorage
            const data = await this.provider.getAll();
            data.push({ id: Date.now(), ...measurement });
            return await this.provider.saveAll(data);
        }
    }

    async deleteMeasurement(id) {
        if (this.provider.delete) {
            return await this.provider.delete(id);
        } else {
            const data = await this.provider.getAll();
            const filtered = data.filter(m => m.id !== id);
            return await this.provider.saveAll(filtered);
        }
    }
}
