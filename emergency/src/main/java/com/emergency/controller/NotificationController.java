package com.emergency.controller;

import com.emergency.dto.ApiResponse;
import com.emergency.entity.Notification;
import com.emergency.service.NotificationService;
import com.emergency.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final JwtUtil jwtUtil;

    public NotificationController(NotificationService notificationService, JwtUtil jwtUtil) {
        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/citizen")
    @PreAuthorize("hasAuthority('CITIZEN')")
    public ResponseEntity<ApiResponse<List<Notification>>> getCitizenNotifications(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            List<Notification> notifications = notificationService.getUserNotifications(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching notifications: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching notifications: " + e.getMessage(), null));
        }
    }

    @GetMapping("/citizen/unread")
    @PreAuthorize("hasAuthority('CITIZEN')")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(HttpServletRequest request) {
        try {
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            List<Notification> notifications = notificationService.getUnreadNotifications(userId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Unread notifications fetched successfully", notifications));
        } catch (Exception e) {
            log.error("Error fetching unread notifications: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching unread notifications: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAuthority('CITIZEN')")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notification marked as read", null));
        } catch (Exception e) {
            log.error("Error marking notification as read: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error marking notification as read: " + e.getMessage(), null));
        }
    }
}