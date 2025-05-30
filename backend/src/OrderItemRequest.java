public class OrderItemRequest {
    private int mealId;
    private int quantity;
    
    // Constructors
    public OrderItemRequest() {}
    
    public OrderItemRequest(int mealId, int quantity) {
        this.mealId = mealId;
        this.quantity = quantity;
    }
    
    // Getters and setters
    public int getMealId() { return mealId; }
    public void setMealId(int mealId) { this.mealId = mealId; }
    
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}
