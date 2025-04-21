package com.example.ogani.service;

import java.util.Map;

public interface VNPayService {
    String createPaymentUrl(Long amount, String orderId);
    boolean verifyPaymentCallback(Map<String, String> params, String secureHashSecret, String secureHash);
}
