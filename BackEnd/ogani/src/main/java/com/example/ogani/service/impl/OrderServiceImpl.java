package com.example.ogani.service.impl;

import java.util.List;

import com.example.ogani.entity.Product;
import com.example.ogani.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.ogani.entity.Order;
import com.example.ogani.entity.OrderDetail;
import com.example.ogani.entity.User;
import com.example.ogani.exception.NotFoundException;
import com.example.ogani.model.request.CreateOrderDetailRequest;
import com.example.ogani.model.request.CreateOrderRequest;
import com.example.ogani.repository.OrderDetailRepository;
import com.example.ogani.repository.OrderRepository;
import com.example.ogani.repository.UserRepository;
import com.example.ogani.service.OrderService;

import javax.transaction.Transactional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    @Override
    public Order placeOrder(CreateOrderRequest request) {
        // TODO Auto-generated method stub
        Order order = new Order();
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + request.getUsername()));
        order.setFirstname(request.getFirstname());
        order.setLastname(request.getLastname());
        order.setCountry(request.getCountry());
        order.setAddress(request.getAddress());
        order.setTown(request.getTown());
        order.setState(request.getState());
        order.setPostCode(request.getPostCode());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote());
//        order.setStatus("PENDING");
        String paymentMethod = request.getPaymentMethod();
        if ("COD".equalsIgnoreCase(paymentMethod)) {
            order.setStatus("COD");
        } else {
            order.setStatus("PENDING");
        }
        orderRepository.save(order);
        long totalPrice = 0;
        for(CreateOrderDetailRequest rq: request.getOrderDetails()){
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setName(rq.getName());
            orderDetail.setPrice(rq.getPrice());
            orderDetail.setQuantity(rq.getQuantity());
            orderDetail.setSubTotal(rq.getPrice()* rq.getQuantity());
            orderDetail.setOrder(order);
            Product product = productRepository.findById(rq.getProductId())
                    .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại"));

            orderDetail.setProduct(product);
            totalPrice += orderDetail.getSubTotal();
            orderDetailRepository.save(orderDetail);
            if ("COD".equals(order.getStatus())) {
                int remaining = product.getQuantity() - rq.getQuantity();
                if (remaining < 0) {
                    throw new IllegalStateException("Sản phẩm " + product.getName() + " không đủ số lượng trong kho.");
                }
                product.setQuantity(remaining);
                productRepository.save(product);
            }
        }
        order.setTotalPrice(totalPrice);
        order.setUser(user);
        orderRepository.save(order);
        return order;
    }

    @Override
    public List<Order> getList() {
        return orderRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public List<Order> getOrderByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User With Username:" + username));

        List<Order> orders = orderRepository.getOrderByUser(user.getId());
        return orders;
    }

    @Override
    public void updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng với ID: " + orderId));
        if (!order.getStatus().equals("PAID")) {
            order.setStatus(status);
            orderRepository.save(order);
        }
        if ("PAID".equals(status)) {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(order.getId());
            for (OrderDetail detail : details) {
                Product product = productRepository.findById(detail.getProduct().getId())
                        .orElseThrow(() -> new NotFoundException("Not found product!"));
                product.setQuantity(product.getQuantity() - detail.getQuantity());
                productRepository.save(product);
            }
        }
    }

    @Override
    public List<OrderDetail> getRevenueByProduct() {
        return orderDetailRepository.findAll(Sort.by("id").descending());
    }


}