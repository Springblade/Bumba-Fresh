import java.sql.*;

public class Meal_Order {
    public static void add_Meal_Quantity(int order_id, int meal_id, int quantity) {
        String query = "INSERT INTO Meal_Order (order_id, meal_id, quantity) VALUES (?, ?, ?)";
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            pstmt.setInt(1, order_id);
            pstmt.setInt(2, meal_id);
            pstmt.setInt(3, quantity);
            pstmt.executeUpdate();
            con.setAutoCommit(false);
            con.commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
