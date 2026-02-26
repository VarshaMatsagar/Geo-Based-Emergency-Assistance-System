package com.emergency.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emergency.entity.Emergency;
import com.emergency.entity.User;
import com.emergency.service.EmergencyService;
import com.emergency.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final EmergencyService emergencyService;

    public UserController(UserService userService,
                          EmergencyService emergencyService) {
        this.userService = userService;
        this.emergencyService = emergencyService;
    }

    @GetMapping("/profile/{userId}")
    public User getUserProfile(@PathVariable Long userId) {
        return userService.getUserById(userId);
    }

    @PutMapping("/profile/{userId}")
    public User updateUserProfile(@PathVariable Long userId,
                                        @RequestBody User user) {
        return userService.updateUserProfile(userId, user);
    }

    @GetMapping("/emergencies/{userId}")
    public ResponseEntity<List<Emergency>> getEmergencyHistory(@PathVariable Long userId) {
        try {
            List<Emergency> emergencies = emergencyService.getEmergenciesByUser(userId);
            return ResponseEntity.ok(emergencies);
        } catch (RuntimeException ex) {
            // service throws a RuntimeException when the user is not found
            return ResponseEntity.notFound().build();
        }
    }
}