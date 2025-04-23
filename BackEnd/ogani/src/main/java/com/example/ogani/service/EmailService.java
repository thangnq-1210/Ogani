package com.example.ogani.service;

import org.springframework.stereotype.Service;

public interface EmailService {
    void sendResetPasswordEmail(String title, String toEmail, String resetLink);
}
