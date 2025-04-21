package com.example.ogani.service.impl;

import com.example.ogani.service.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Autowired
    private final JavaMailSender mailSender;

    @Override
    public void sendResetPasswordEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu");
        message.setText("Nhấn vào liên kết sau để đặt lại mật khẩu: \n" + resetLink);
        mailSender.send(message);
    }
}
