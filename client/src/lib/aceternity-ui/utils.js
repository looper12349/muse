// lib/aceternity-ui/utils.js

/**
 * Combines multiple class names, filtering out falsy values
 * This is a simplified version of the classnames or clsx package
 * @param {string[]} classes - Array of class names
 * @returns {string} Combined class names
 */
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  
  /**
   * Debounces a function to avoid excessive calls
   * @param {Function} func - The function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  export const debounce = (func, wait) => {
    let timeout;
    
    return function(...args) {
      const context = this;
      
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  /**
   * Throttles a function to limit call frequency
   * @param {Function} func - The function to throttle
   * @param {number} limit - Limit in milliseconds
   * @returns {Function} Throttled function
   */
  export const throttle = (func, limit) => {
    let inThrottle;
    
    return function(...args) {
      const context = this;
      
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  /**
   * Creates a unique ID string
   * @returns {string} Unique ID
   */
  export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
  
  /**
   * Checks if a value is an object
   * @param {any} value - The value to check
   * @returns {boolean} True if the value is an object
   */
  export const isObject = (value) => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  };
  
  /**
   * Deep merges two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  export const mergeDeep = (target, source) => {
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          result[key] = source[key];
        } else {
          result[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        result[key] = source[key];
      }
    });
    
    return result;
  };