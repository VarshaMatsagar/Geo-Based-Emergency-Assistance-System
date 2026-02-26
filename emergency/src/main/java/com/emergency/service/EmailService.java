package com.emergency.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Email Verification - Geo Emergency System");
        message.setText(
            "Dear User,\n\n" +
            "Your email verification OTP is: " + otp + "\n\n" +
            "This OTP will expire in 5 minutes.\n\n" +
            "If you didn't request this, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Geo Emergency System Team"
        );
        mailSender.send(message);
    }
}