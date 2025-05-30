import java.sql.*;
import java.util.regex.Pattern;

public class PaymentService {
    
    public static PaymentResponse processPayment(PaymentRequest paymentRequest, double amount, int orderId) {
        try {
            if ("cash".equals(paymentRequest.getPaymentMethod())) {
                return processCashPayment(orderId, amount);
            } else if ("card".equals(paymentRequest.getPaymentMethod())) {
                return processCardPayment(paymentRequest, orderId, amount);
            } else {
                return new PaymentResponse(false, "Invalid payment method", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new PaymentResponse(false, "Payment processing failed", null);
        }
    }
    
    private static PaymentResponse processCashPayment(int orderId, double amount) {
        try {
            // Store payment record
            String paymentId = generatePaymentId();
            storePaymentRecord(paymentId, orderId, "cash", amount, "pending");
            
            return new PaymentResponse(true, "Cash on delivery order confirmed", paymentId);
        } catch (Exception e) {
            e.printStackTrace();
            return new PaymentResponse(false, "Failed to process cash payment", null);
        }
    }
    
    private static PaymentResponse processCardPayment(PaymentRequest paymentRequest, int orderId, double amount) {
        // Validate card details
        if (!validateCard(paymentRequest)) {
            return new PaymentResponse(false, "Invalid card details", null);
        }
        
        try {
            // For now, we'll simulate the payment processing
            boolean paymentSuccessful = simulateCardPayment(paymentRequest, amount);
            
            if (paymentSuccessful) {
                String paymentId = generatePaymentId();
                storePaymentRecord(paymentId, orderId, "card", amount, "completed");
                return new PaymentResponse(true, "Payment successful", paymentId);
            } else {
                return new PaymentResponse(false, "Payment declined", null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new PaymentResponse(false, "Payment processing failed", null);
        }
    }
    
    private static boolean validateCard(PaymentRequest paymentRequest) {
        // Basic card validation
        String cardNumber = paymentRequest.getCardNumber().replaceAll("\\s+", "");
        
        // Check card number length and format
        if (!Pattern.matches("^[0-9]{13,19}$", cardNumber)) {
            return false;
        }
        
        // Check if it's VISA (starts with 4) or Mastercard (starts with 5)
        if (!cardNumber.startsWith("4") && !cardNumber.startsWith("5")) {
            return false;
        }
        
        // Validate expiry date format (MM/YY)
        if (!Pattern.matches("^(0[1-9]|1[0-2])/[0-9]{2}$", paymentRequest.getExpiryDate())) {
            return false;
        }
        
        // Validate CVV (3 digits)
        if (!Pattern.matches("^[0-9]{3}$", paymentRequest.getCvv())) {
            return false;
        }
        
        return true;
    }
    
    private static boolean simulateCardPayment(PaymentRequest paymentRequest, double amount) {
        // Simulate payment processing - in reality this would call a payment gateway
        String cardNumber = paymentRequest.getCardNumber().replaceAll("\\s+", "");
        
        // Simulate some cards being declined for testing
        if (cardNumber.endsWith("0000")) {
            return false; // Simulate declined payment
        }
        
        // Simulate processing delay
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        return true; // Simulate successful payment
    }
    
    private static String generatePaymentId() {
        return "PAY_" + System.currentTimeMillis() + "_" + Math.random();
    }
    
    private static void storePaymentRecord(String paymentId, int orderId, String paymentMethod, double amount, String status) {
        String query = """
            INSERT INTO payments (payment_id, order_id, payment_method, amount, status, created_at) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """;
        
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setString(1, paymentId);
            pstmt.setInt(2, orderId);
            pstmt.setString(3, paymentMethod);
            pstmt.setDouble(4, amount);
            pstmt.setString(5, status);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to store payment record", e);
        }
    }
    
    public static PaymentDetails getPaymentByOrderId(int orderId) {
        String query = "SELECT * FROM payments WHERE order_id = ?";
        
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, orderId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return new PaymentDetails(
                    rs.getString("payment_id"),
                    rs.getInt("order_id"),
                    rs.getString("payment_method"),
                    rs.getDouble("amount"),
                    rs.getString("status"),
                    rs.getTimestamp("created_at")
                );
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return null;
    }
}