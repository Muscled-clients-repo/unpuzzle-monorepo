/**
 * Storage Service
 * Handles localStorage, sessionStorage, and IndexedDB operations
 */

export interface StorageItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  expiry?: number;
}

export class StorageService {
  private prefix: string = 'unpuzzle_';
  
  /**
   * Set storage prefix
   */
  setPrefix(prefix: string): void {
    this.prefix = prefix;
  }
  
  /**
   * Get prefixed key
   */
  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
  
  /**
   * Check if storage is available
   */
  private isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
    try {
      const storage = window[type];
      const test = '__storage_test__';
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  // LocalStorage operations
  
  /**
   * Set item in localStorage
   */
  setLocal<T>(key: string, value: T, expiryInMinutes?: number): boolean {
    if (!this.isStorageAvailable('localStorage')) return false;
    
    try {
      const item: StorageItem<T> = {
        key,
        value,
        timestamp: Date.now(),
        expiry: expiryInMinutes ? Date.now() + (expiryInMinutes * 60 * 1000) : undefined,
      };
      
      localStorage.setItem(this.getPrefixedKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting localStorage item:', error);
      return false;
    }
  }
  
  /**
   * Get item from localStorage
   */
  getLocal<T>(key: string): T | null {
    if (!this.isStorageAvailable('localStorage')) return null;
    
    try {
      const stored = localStorage.getItem(this.getPrefixedKey(key));
      if (!stored) return null;
      
      const item: StorageItem<T> = JSON.parse(stored);
      
      // Check if item has expired
      if (item.expiry && Date.now() > item.expiry) {
        this.removeLocal(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }
  
  /**
   * Remove item from localStorage
   */
  removeLocal(key: string): boolean {
    if (!this.isStorageAvailable('localStorage')) return false;
    
    try {
      localStorage.removeItem(this.getPrefixedKey(key));
      return true;
    } catch (error) {
      console.error('Error removing localStorage item:', error);
      return false;
    }
  }

  // SessionStorage operations
  
  /**
   * Set item in sessionStorage
   */
  setSession<T>(key: string, value: T): boolean {
    if (!this.isStorageAvailable('sessionStorage')) return false;
    
    try {
      const item: StorageItem<T> = {
        key,
        value,
        timestamp: Date.now(),
      };
      
      sessionStorage.setItem(this.getPrefixedKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
      return false;
    }
  }
  
  /**
   * Get item from sessionStorage
   */
  getSession<T>(key: string): T | null {
    if (!this.isStorageAvailable('sessionStorage')) return null;
    
    try {
      const stored = sessionStorage.getItem(this.getPrefixedKey(key));
      if (!stored) return null;
      
      const item: StorageItem<T> = JSON.parse(stored);
      return item.value;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return null;
    }
  }
  
  /**
   * Remove item from sessionStorage
   */
  removeSession(key: string): boolean {
    if (!this.isStorageAvailable('sessionStorage')) return false;
    
    try {
      sessionStorage.removeItem(this.getPrefixedKey(key));
      return true;
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
      return false;
    }
  }

  // Utility methods
  
  /**
   * Clear all items with prefix from localStorage
   */
  clearLocal(): boolean {
    if (!this.isStorageAvailable('localStorage')) return false;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
  
  /**
   * Clear all items with prefix from sessionStorage
   */
  clearSession(): boolean {
    if (!this.isStorageAvailable('sessionStorage')) return false;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
      return false;
    }
  }
  
  /**
   * Clear all storage
   */
  clear(): boolean {
    const localSuccess = this.clearLocal();
    const sessionSuccess = this.clearSession();
    return localSuccess && sessionSuccess;
  }
  
  /**
   * Get all keys with prefix
   */
  getAllKeys(storageType: 'local' | 'session' = 'local'): string[] {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const isAvailable = this.isStorageAvailable(storageType === 'local' ? 'localStorage' : 'sessionStorage');
    
    if (!isAvailable) return [];
    
    const keys: string[] = [];
    
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    } catch (error) {
      console.error('Error getting storage keys:', error);
    }
    
    return keys;
  }
  
  /**
   * Get storage size in bytes
   */
  getStorageSize(storageType: 'local' | 'session' = 'local'): number {
    const storage = storageType === 'local' ? localStorage : sessionStorage;
    const isAvailable = this.isStorageAvailable(storageType === 'local' ? 'localStorage' : 'sessionStorage');
    
    if (!isAvailable) return 0;
    
    let totalSize = 0;
    
    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
    } catch (error) {
      console.error('Error calculating storage size:', error);
    }
    
    return totalSize;
  }
  
  /**
   * Clean expired items from localStorage
   */
  cleanExpired(): number {
    if (!this.isStorageAvailable('localStorage')) return 0;
    
    let cleaned = 0;
    const keysToRemove: string[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            try {
              const item: StorageItem = JSON.parse(stored);
              if (item.expiry && Date.now() > item.expiry) {
                keysToRemove.push(key);
              }
            } catch {
              // Invalid JSON, remove it
              keysToRemove.push(key);
            }
          }
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        cleaned++;
      });
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
    
    return cleaned;
  }
}

// Service class is exported, instances created in services/index.ts