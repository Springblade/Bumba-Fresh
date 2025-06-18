import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Plan {
    public static void addPlan(String planName, Date time_Expired, int user_id ) {
        String query = "INSERT INTO PLAN (plan_name, time_expired, user_id) VALUES ('" + planName + "', '" + time_Expired + "', " + user_id + ")";
        try (Connection con = Connect.getConnection();
             Statement stmt = con.createStatement()) {
            stmt.execute(query);
            con.setAutoCommit(false);
            con.commit();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void viewPlans() {
        String query = "SELECT * FROM PLAN";
        try (Connection con = Connect.getConnection();
             Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            while (rs.next()) {
                System.out.println("Plan Name: " + rs.getString("plan_name") +
                                   ", Description: " + rs.getDate("description") +
                                   ", user_id: " + rs.getInt("user_id"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }   
}
