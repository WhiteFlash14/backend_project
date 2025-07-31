class ApiResponse {
    constructor(statusCode, message = "Success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400; // Assuming status codes < 400 are success
    }

    
}

export default ApiResponse;