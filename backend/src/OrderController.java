import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;

@WebServlet("/api/orders/*")
public class OrderController extends HttpServlet {
    private ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String pathInfo = request.getPathInfo();
        
        if ("/create".equals(pathInfo)) {
            handleCreateOrder(request, response);
        } else if ("/update-status".equals(pathInfo)) {
            handleUpdateOrderStatus(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String pathInfo = request.getPathInfo();
        
        if ("/user".equals(pathInfo)) {
            handleGetUserOrders(request, response);
        } else if (pathInfo != null && pathInfo.startsWith("/")) {
            // Get specific order by ID
            String orderIdStr = pathInfo.substring(1);
            handleGetOrder(request, response, orderIdStr);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
    
    private void handleCreateOrder(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ErrorResponse error = new ErrorResponse(false, "Please log in to place an order");
                response.getWriter().write(objectMapper.writeValueAsString(error));
                return;
            }
            
            int userId = (Integer) session.getAttribute("userId");
            CreateOrderRequest orderReq = objectMapper.readValue(request.getReader(), CreateOrderRequest.class);
            
            // Generate order ID
            int orderId = OrderService.generateOrderId();
            
            // Create order
            OrderService.createOrder(orderId, userId, orderReq.getTotalPrice(), "pending");
            
            // Add order items
            for (OrderItemRequest item : orderReq.getItems()) {
                OrderService.addOrderItem(orderId, item.getMealId(), item.getQuantity());
            }
            
            CreateOrderResponse orderResp = new CreateOrderResponse(true, "Order created successfully", orderId);
            response.setStatus(HttpServletResponse.SC_CREATED);
            response.getWriter().write(objectMapper.writeValueAsString(orderResp));
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Failed to create order");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
    
    private void handleGetUserOrders(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            
            int userId = (Integer) session.getAttribute("userId");
            List<OrderDetails> orders = OrderService.getUserOrders(userId);
            
            response.getWriter().write(objectMapper.writeValueAsString(orders));
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Failed to retrieve orders");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
    
    private void handleGetOrder(HttpServletRequest request, HttpServletResponse response, String orderIdStr) 
            throws IOException {
        try {
            int orderId = Integer.parseInt(orderIdStr);
            OrderDetails order = OrderService.getOrderById(orderId);
            
            if (order != null) {
                response.getWriter().write(objectMapper.writeValueAsString(order));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                ErrorResponse error = new ErrorResponse(false, "Order not found");
                response.getWriter().write(objectMapper.writeValueAsString(error));
            }
            
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            ErrorResponse error = new ErrorResponse(false, "Invalid order ID");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Failed to retrieve order");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
    
    private void handleUpdateOrderStatus(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            UpdateOrderStatusRequest statusReq = objectMapper.readValue(request.getReader(), UpdateOrderStatusRequest.class);
            
            boolean updated = OrderService.updateOrderStatus(statusReq.getOrderId(), statusReq.getStatus());
            
            if (updated) {
                SuccessResponse success = new SuccessResponse(true, "Order status updated successfully");
                response.getWriter().write(objectMapper.writeValueAsString(success));
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                ErrorResponse error = new ErrorResponse(false, "Order not found");
                response.getWriter().write(objectMapper.writeValueAsString(error));
            }
            
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Failed to update order status");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }

    private void handleCreateOrderWithPayment(HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("userId") == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                ErrorResponse error = new ErrorResponse(false, "Please log in to place an order");
                response.getWriter().write(objectMapper.writeValueAsString(error));
                return;
            }
            
            int userId = (Integer) session.getAttribute("userId");
            CreateOrderWithPaymentRequest orderReq = objectMapper.readValue(request.getReader(), CreateOrderWithPaymentRequest.class);
            
            // Generate order ID
            int orderId = OrderService.generateOrderId();
            
            // Create order
            OrderService.createOrder(orderId, userId, orderReq.getTotalPrice(), "pending");
            
            // Add order items
            for (OrderItemRequest item : orderReq.getItems()) {
                OrderService.addOrderItem(orderId, item.getMealId(), item.getQuantity());
            }
            
            // Process payment
            PaymentResponse paymentResponse = PaymentService.processPayment(
                orderReq.getPaymentRequest(), 
                orderReq.getTotalPrice(), 
                orderId
            );
            
            if (paymentResponse.isSuccess()) {
                // Update order status based on payment method
                String orderStatus = "cash".equals(orderReq.getPaymentRequest().getPaymentMethod()) 
                    ? "confirmed" : "paid";
                OrderService.updateOrderStatus(orderId, orderStatus);
                
                CreateOrderResponse orderResp = new CreateOrderResponse(
                    true, 
                    "Order created and payment processed successfully", 
                    orderId,
                    paymentResponse.getPaymentId()
                );
                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().write(objectMapper.writeValueAsString(orderResp));
            } else {
                // Payment failed, cancel order
                OrderService.updateOrderStatus(orderId, "cancelled");
                response.setStatus(HttpServletResponse.SC_PAYMENT_REQUIRED);
                ErrorResponse error = new ErrorResponse(false, paymentResponse.getMessage());
                response.getWriter().write(objectMapper.writeValueAsString(error));
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            ErrorResponse error = new ErrorResponse(false, "Failed to process order and payment");
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String pathInfo = request.getPathInfo();
        
        if ("/create".equals(pathInfo)) {
            handleCreateOrder(request, response);
        } else if ("/create-with-payment".equals(pathInfo)) { // Add this line
            handleCreateOrderWithPayment(request, response);
        } else if ("/update-status".equals(pathInfo)) {
            handleUpdateOrderStatus(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
