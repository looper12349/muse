/**
 * Validate if a URL is a valid LeetCode problem URL
 */
const isValidLeetCodeUrl = (url) => {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      return (
        (urlObj.hostname === 'leetcode.com' || urlObj.hostname === 'www.leetcode.com') &&
        urlObj.pathname.includes('/problems/')
      );
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Validate email format
   */
  const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  module.exports = {
    isValidLeetCodeUrl,
    isValidEmail
  };