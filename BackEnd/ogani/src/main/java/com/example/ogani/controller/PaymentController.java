package com.example.ogani.controller;

import com.example.ogani.entity.Order;
import com.example.ogani.model.request.CreateOrderRequest;
import com.example.ogani.service.OrderService;
import com.example.ogani.service.VNPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class PaymentController {
    private final VNPayService vnPayService;
    private final OrderService orderService;

    @Value("${vnpay.secret-key}")
    private String vnpaySecretKey;

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createPayment(@RequestParam Long amount, @RequestParam String orderId) throws Exception {

        String url = vnPayService.createPaymentUrl(amount, orderId);
        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", url);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vn-pay-callback")
//    public ResponseEntity<String> handleVnPayCallback(@RequestParam Map<String, String> allParams, HttpServletResponse response) {
    public void handleVnPayCallback(@RequestParam Map<String, String> allParams, HttpServletResponse response) {
        try {
            String secureHash = allParams.get("vnp_SecureHash");

            boolean isValid = vnPayService.verifyPaymentCallback(allParams, vnpaySecretKey, secureHash);
            if (!isValid) {
//                return ResponseEntity.status(400).body("Chữ ký không hợp lệ.");
                ResponseEntity.status(400).body("Chữ ký không hợp lệ.");
            }

            String responseCode = allParams.get("vnp_ResponseCode");
            String orderId = allParams.get("vnp_TxnRef");

            if ("00".equals(responseCode)) {
                orderService.updateOrderStatus(orderId, "PAID");
//                return ResponseEntity.ok("Thanh toán thành công!");
                response.sendRedirect("http://localhost:4200/checkout?status=success");
            } else {
                orderService.updateOrderStatus(orderId, "FAILED");
//                return ResponseEntity.ok("Thanh toán thất bại!");
                response.sendRedirect("http://localhost:4200/checkout?status=fail");
            }

        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Có lỗi xảy ra: " + e.getMessage());
            ResponseEntity.status(400).body("Chữ ký không hợp lệ.");
        }
    }




}
