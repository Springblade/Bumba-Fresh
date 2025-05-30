public class LoginResponse {
    private boolean success;
    private String message;
    private int userId;
    private String username;
    
    public LoginResponse(boolean success, String message, int userId, String username) {
        this.success = success;
        this.message = message;
        this.userId = userId;
        this.username = username;
    }
    
    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}
