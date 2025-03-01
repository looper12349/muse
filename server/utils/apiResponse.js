/**
 * Standard API Response format
 */
class ApiResponse {
    constructor(success, data, message) {
      this.success = success;
      this.data = data;
      this.message = message;
      this.timestamp = new Date();
    }
  }
  
  module.exports = ApiResponse;