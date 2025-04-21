package com.example.ogani.service;

import org.springframework.stereotype.Service;

public interface EmailService {
    void sendResetPasswordEmail(String toEmail, String resetLink);
}
