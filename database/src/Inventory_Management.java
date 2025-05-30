import java.sql.*;

public class Inventory_Management {
    public static void add_mealkit(String meal, int quantity, double price, int meal_id) {
        String query = "INSERT INTO MEALKIT (meal, quantity, price, meal_id) VALUES (?, ?, ?, ?)";
        try (Connection con = Connect.getConnection();
             PreparedStatement pstmt = con.prepareStatement(query)) {
            pstmt.setString(1, meal);
            pstmt.setInt(2, quantity);
            pstmt.setDouble(3, price);
            pstmt.setInt(4, meal_id);
            pstmt.executeUpdate();
            con.setAutoCommit(false);
            con.commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}