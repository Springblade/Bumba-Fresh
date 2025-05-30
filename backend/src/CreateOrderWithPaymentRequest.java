import java.util.List;

public class CreateOrderWithPaymentRequest {
    private List<OrderItemRequest> items;
    private double totalPrice;
    private String shippingAddress;
    private PaymentRequest paymentRequest;
    
    // Constructors
    public CreateOrderWithPaymentRequest() {}
    
    public CreateOrderWithPaymentRequest(List<OrderItemRequest> items, double totalPrice, 
                                       String shippingAddress, PaymentRequest paymentRequest) {
        this.items = items;
        this.totalPrice = totalPrice;
        this.shippingAddress = shippingAddress;
        this.paymentRequest = paymentRequest;
    }
    
    // Getters and setters
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public PaymentRequest getPaymentRequest() { return paymentRequest; }
    public void setPaymentRequest(PaymentRequest paymentRequest) { this.paymentRequest = paymentRequest; }
}
