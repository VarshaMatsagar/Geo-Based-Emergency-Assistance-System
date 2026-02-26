package com.emergency.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.emergency.dto.ApiResponse;
import com.emergency.dto.LoginRequest;
import com.emergency.dto.RegisterRequest;
import com.emergency.dto.ResendOtpRequest;
import com.emergency.dto.VerifyOtpRequest;
import com.emergency.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Registration successful", authService.register(req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@Valid @RequestBody VerifyOtpRequest req) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "Email verified successfully", authService.verifyEmailOtp(req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/resend-email-otp")
    public ResponseEntity<?> resendEmailOtp(@Valid @RequestBody ResendOtpRequest req) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(true, "OTP resent successfully", authService.resendEmailOtp(req)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(authService.login(req));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
