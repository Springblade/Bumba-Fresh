import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderService {
    
    public static int generateOrderId() {
        String query = "SELECT COALESCE(MAX(order_id), 0) + 1 FROM \"order\"";
        try (Connection con = Connect.getConnection();
             Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            
            if (rs.next()) {
                return rs.getInt(1);
            }
            return 1;
        } catch (SQLException e) {
            e.printStackTrace();
            return 1;
        }
    }
    
    public static void createOrder(int orderId, int userId, double totalPrice, String status) {
        String query = "INSERT INTO \"order\" (order_id, user_id, total_price, status) VALUES (?, ?, ?, ?)";
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, orderId);
            pstmt.setInt(2, userId);
            pstmt.setDouble(3, totalPrice);
            pstmt.setString(4, status);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create order", e);
        }
    }
    
    public static void addOrderItem(int orderId, int mealId, int quantity) {
        String query = "INSERT INTO order_meal (order_id, meal_id, quantity) VALUES (?, ?, ?)";
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, orderId);
            pstmt.setInt(2, mealId);
            pstmt.setInt(3, quantity);
            pstmt.executeUpdate();
            
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add order item", e);
        }
    }
    
    public static List<OrderDetails> getUserOrders(int userId) {
        List<OrderDetails> orders = new ArrayList<>();
        String query = """
            SELECT o.order_id, o.total_price, o.status, 
                   COUNT(om.meal_id) as item_count
            FROM "order" o
            LEFT JOIN order_meal om ON o.order_id = om.order_id
            WHERE o.user_id = ?
            GROUP BY o.order_id, o.total_price, o.status
            ORDER BY o.order_id DESC
        """;
        
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                int orderId = rs.getInt("order_id");
                double totalPrice = rs.getDouble("total_price");
                String status = rs.getString("status");
                int itemCount = rs.getInt("item_count");
                
                // Get order items
                List<OrderItem> items = getOrderItems(orderId);
                
                orders.add(new OrderDetails(orderId, userId, totalPrice, status, items, itemCount));
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return orders;
    }
    
    public static OrderDetails getOrderById(int orderId) {
        String query = """
            SELECT o.order_id, o.user_id, o.total_price, o.status
            FROM "order" o
            WHERE o.order_id = ?
        """;
        
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, orderId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                int userId = rs.getInt("user_id");
                double totalPrice = rs.getDouble("total_price");
                String status = rs.getString("status");
                
                List<OrderItem> items = getOrderItems(orderId);
                
                return new OrderDetails(orderId, userId, totalPrice, status, items, items.size());
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return null;
    }
    
    private static List<OrderItem> getOrderItems(int orderId) {
        List<OrderItem> items = new ArrayList<>();
        String query = """
            SELECT om.meal_id, om.quantity, i.meal, i.price
            FROM order_meal om
            JOIN inventory i ON om.meal_id = i.meal_id
            WHERE om.order_id = ?
        """;
        
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setInt(1, orderId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                int mealId = rs.getInt("meal_id");
                int quantity = rs.getInt("quantity");
                String mealName = rs.getString("meal");
                double price = rs.getDouble("price");
                
                items.add(new OrderItem(mealId, mealName, price, quantity));
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return items;
    }
    
    public static boolean updateOrderStatus(int orderId, String status) {
        String query = "UPDATE \"order\" SET status = ? WHERE order_id = ?";
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            
            pstmt.setString(1, status);
            pstmt.setInt(2, orderId);
            
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}