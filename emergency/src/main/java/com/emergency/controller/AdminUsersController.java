package com.emergency.controller;

import com.emergency.dto.AdminUserRequest;
import com.emergency.dto.AdminUserResponse;
import com.emergency.entity.Role;
import com.emergency.entity.User;
import com.emergency.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/AdminUsers")
@CrossOrigin("*")
public class AdminUsersController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUsersController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<AdminUserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AdminUserResponse getById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return toResponse(user);
    }

    @PostMapping
    public AdminUserResponse create(@RequestBody AdminUserRequest req) {
        // Security check: prevent assigning ADMIN role
        Role newRole = mapRole(req.getRoleId());
        if (newRole == Role.ADMIN) {
            throw new RuntimeException("ADMIN role cannot be assigned via this interface");
        }
        
        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setRole(newRole);

        if (req.getPasswordHash() != null && !req.getPasswordHash().isBlank()) {
            user.setPassword(passwordEncoder.encode(req.getPasswordHash()));
        }

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @PutMapping("/{id}")
    public AdminUserResponse update(@PathVariable Long id, @RequestBody AdminUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        // Security check: prevent ADMIN role modification
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("ADMIN role cannot be modified for security reasons");
        }
        
        // Security check: prevent assigning ADMIN role
        Role newRole = mapRole(req.getRoleId());
        if (newRole == Role.ADMIN) {
            throw new RuntimeException("ADMIN role cannot be assigned via this interface");
        }

        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setRole(newRole);

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        
        // Security check: prevent ADMIN deletion
        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("ADMIN users cannot be deleted for security reasons");
        }
        
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    private AdminUserResponse toResponse(User u) {
        String roleName = u.getRole() != null ? u.getRole().name() : "CITIZEN";
        return new AdminUserResponse(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhoneNumber(),
                new AdminUserResponse.RoleDetails(roleName)
        );
    }

    private Role mapRole(Long roleId) {
        if (roleId == null) {
            return Role.CITIZEN;
        }
        switch (roleId.intValue()) {
            case 1:
                return Role.ADMIN;
            case 2:
                return Role.CITIZEN;
            case 3:
                return Role.POLICE;
            case 4:
                return Role.HOSPITAL;
            default:
                return Role.CITIZEN;
        }
    }
}

