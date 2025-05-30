public class PaymentResponse {
    private boolean success;
    private String message;
    private String paymentId;
    
    // Constructors
    public PaymentResponse() {}
    
    public PaymentResponse(boolean success, String message, String paymentId) {
        this.success = success;
        this.message = message;
        this.paymentId = paymentId;
    }
    
    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
