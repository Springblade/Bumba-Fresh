import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/api/auth/*")
public class AuthController extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String pathInfo = request.getPathInfo();
        
        if ("/login".equals(pathInfo)) {
            handleLogin(request, response);
        } else if ("/signup".equals(pathInfo)) {
            handleSignup(request, response);
        } else if ("/logout".equals(pathInfo)) {
            handleLogout(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void handleLogin(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            LoginRequest loginReq = objectMapper.readValue(request.getReader(), LoginRequest.class);
            
            if (LogIn.loginAccount(loginReq.getUsername(), loginReq.getPassword())) {
                int userId = LogIn.getUserId(loginReq.getUsername());
                
                HttpSession session = request.getSession(true);
                session.setAttribute("userId", userId);
                session.setAttribute("username", loginReq.getUsername());
                
                LoginResponse loginResp = new LoginResponse(true, "Login successful", userId, loginReq.getUsername());
                response.getWriter().write(objectMapper.writeValueAsString(loginResp));
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ErrorResponse error = new ErrorResponse(false, "Invalid username or password");
                response.getWriter().write(objectMapper.writeValueAsString(error));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Login failed");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
    
    private void handleSignup(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            SignupRequest signupReq = objectMapper.readValue(request.getReader(), SignupRequest.class);
            
            if (Create.createAccount(signupReq.getUsername(), signupReq.getPassword())) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                SuccessResponse success = new SuccessResponse(true, "Account created successfully");
                response.getWriter().write(objectMapper.writeValueAsString(success));
            } else {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                ErrorResponse error = new ErrorResponse(false, "Username already exists");
                response.getWriter().write(objectMapper.writeValueAsString(error));
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Signup failed");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
    
    private void handleLogout(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SuccessResponse success = new SuccessResponse(true, "Logged out successfully");
        response.getWriter().write(objectMapper.writeValueAsString(success));
    }
}
