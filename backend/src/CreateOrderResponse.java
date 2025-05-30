public class CreateOrderResponse {
    private boolean success;
    private String message;
    private int orderId;
    private String paymentId;
    
    // Constructors
    public CreateOrderResponse() {}
    
    public CreateOrderResponse(boolean success, String message, int orderId) {
        this.success = success;
        this.message = message;
        this.orderId = orderId;
    }
    
    public CreateOrderResponse(boolean success, String message, int orderId, String paymentId) {
        this.success = success;
        this.message = message;
        this.orderId = orderId;
        this.paymentId = paymentId;
    }
    
    // Getters and setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public int getOrderId() { return orderId; }
    public void setOrderId(int orderId) { this.orderId = orderId; }
    
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
}
