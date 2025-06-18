import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Order {
    public static void add_Order(String orderId, String userId, Double total_price, String status) {
        Statement stmt = null;
        try {
            Connection con = Connect.getConnection();
            stmt = con.createStatement();
            String sql = "INSERT INTO Orders (order_id, user_id, total_price, status) VALUES ('" + orderId + "', '" + userId + "', '" + total_price + "', '" + status + "')";
            stmt.executeUpdate(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static int retrieve_OrderId(String userId) {
        Statement stmt = null;
        int orderId = 0;
        try {
            Connection con = Connect.getConnection();
            stmt = con.createStatement();
            String sql = "SELECT order_id FROM Orders WHERE user_id = '" + userId + "'";
            ResultSet rs = stmt.executeQuery(sql);
            if (rs.next()) {
                orderId = rs.getInt("order_id");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orderId;
    }
}