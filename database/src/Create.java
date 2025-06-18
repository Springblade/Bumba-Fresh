import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Create {
    private static int id = 0;
    public static boolean createAccount(String username,String password) {
        id++;
        if (unique(username)){
            insert(username, password, id);
            return true;
        }
        else {
            return false;
        }
    }

    public static void insert(String name, String pass, int id) {
        String query = "INSERT INTO ACCOUNT (username, password, user_id) VALUES ('" + name + "', '" + pass + "', " + id + ")";
        try (Connection con = Connect.getConnection();
             Statement stmt = con.createStatement()) {
            stmt.execute(query);
            con.setAutoCommit(false);
            con.commit();
        } catch (SQLException e) {}
    }

    public static boolean unique (String name) {
        String query = "SELECT * FROM ACCOUNT WHERE username = '" + name + "'";
        try (Connection con = Connect.getConnection();
             Statement stmt = con.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
            return !rs.next();
        } catch (SQLException e) {
            return false;
        }
    }
}