package com.example.ogani.service;

import java.util.List;

import com.example.ogani.entity.Order;
import com.example.ogani.model.request.CreateOrderRequest;

public interface OrderService {
    
    Order placeOrder(CreateOrderRequest request);

    List<Order> getList();
    
    List<Order> getOrderByUser(String username);

    void updateOrderStatus(String orderId, String status);
}
