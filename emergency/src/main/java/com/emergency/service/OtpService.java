package com.emergency.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emergency.entity.User;
import com.emergency.repository.UserRepository;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_OTP_ATTEMPTS = 5;

    public void generateAndSendOtp(User user) {
        String otp = generateOtp();
        user.setEmailOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        user.setOtpAttempts(0);
        userRepository.save(user);
        
        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public boolean verifyOtp(User user, String inputOtp) {
        if (user.getEmailOtp() == null || user.getOtpExpiryTime() == null) {
            return false;
        }

        if (user.getOtpAttempts() >= MAX_OTP_ATTEMPTS) {
            clearOtp(user);
            throw new RuntimeException("Maximum OTP attempts exceeded. Please request a new OTP.");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiryTime())) {
            clearOtp(user);
            throw new RuntimeException("OTP has expired. Please request a new OTP.");
        }

        user.setOtpAttempts(user.getOtpAttempts() + 1);
        userRepository.save(user);

        if (user.getEmailOtp().equals(inputOtp)) {
            user.setEmailVerified(true);
            clearOtp(user);
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public void clearOtp(User user) {
        user.setEmailOtp(null);
        user.setOtpExpiryTime(null);
        user.setOtpAttempts(0);
        userRepository.save(user);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }
}