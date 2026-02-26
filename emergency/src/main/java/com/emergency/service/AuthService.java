package com.emergency.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.emergency.dto.LoginRequest;
import com.emergency.dto.RegisterRequest;
import com.emergency.dto.ResendOtpRequest;
import com.emergency.dto.UserResponse;
import com.emergency.dto.VerifyOtpRequest;
import com.emergency.entity.Role;
import com.emergency.entity.User;
import com.emergency.repository.UserRepository;
import com.emergency.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    public Map<String, Object> register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(Role.CITIZEN);
        user.setEmailVerified(false);

        User saved = userRepo.save(user);
        otpService.generateAndSendOtp(saved);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful! OTP sent to your email. Please verify to complete registration.");
        response.put("email", saved.getEmail());
        return response;
    }

    public Map<String, Object> verifyEmailOtp(VerifyOtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified!");
        }

        boolean isValid = otpService.verifyOtp(user, req.getOtp());
        if (!isValid) {
            throw new RuntimeException("Invalid OTP!");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Email verified successfully! You can now login.");
        return response;
    }

    public Map<String, Object> resendEmailOtp(ResendOtpRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified!");
        }

        otpService.generateAndSendOtp(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP resent successfully to your email!");
        return response;
    }

    public Map<String, Object> login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email!"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first before logging in!");
        }

        if (!encoder.matches(req.getPasswordHash(), user.getPassword())) {
            throw new RuntimeException("Invalid Password!");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        ));

        return response;
    }
}
