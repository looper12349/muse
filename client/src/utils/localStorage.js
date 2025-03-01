// utils/localStorage.js

/**
 * Saves data to localStorage with the specified key
 * @param {string} key - The localStorage key
 * @param {any} data - The data to save (will be JSON stringified)
 */
export const saveToLocalStorage = (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };
  
  /**
   * Retrieves data from localStorage for the specified key
   * @param {string} key - The localStorage key
   * @param {any} defaultValue - The default value to return if key doesn't exist
   * @returns {any} The parsed data or defaultValue if key doesn't exist
   */
  export const getFromLocalStorage = (key, defaultValue = null) => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return defaultValue;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return defaultValue;
    }
  };
  
  /**
   * Removes the specified key from localStorage
   * @param {string} key - The localStorage key to remove
   */
  export const removeFromLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  };
  
  /**
   * Clears all application-related data from localStorage
   * @param {Array<string>} keysToPreserve - Array of keys to keep
   */
  export const clearAppData = (keysToPreserve = []) => {
    try {
      // Store values for keys to preserve
      const preservedData = {};
      keysToPreserve.forEach(key => {
        preservedData[key] = localStorage.getItem(key);
      });
      
      // Clear localStorage
      localStorage.clear();
      
      // Restore preserved keys
      Object.entries(preservedData).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error clearing app data from localStorage:', error);
      return false;
    }
  };
  
  /**
   * Checks if localStorage is available in the browser
   * @returns {boolean} True if localStorage is available
   */
  export const isLocalStorageAvailable = () => {
    try {
      const testKey = '__test_storage__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };