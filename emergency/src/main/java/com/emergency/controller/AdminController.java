package com.emergency.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.emergency.dto.RoleUpdateRequest;
import com.emergency.dto.UserUpdateRequest;
import com.emergency.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // GET /api/admin/test - Simple connection test endpoint
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("Backend connection successful");
    }

    // POST /api/admin/test - Handle POST requests to test endpoint
    @PostMapping("/test")
    public ResponseEntity<String> testConnectionPost() {
        return ResponseEntity.ok("Backend connection successful via POST");
    }

    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // PUT /api/admin/users/{id}
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest req) {
        return ResponseEntity.ok(adminService.updateUser(id, req));
    }

//    // PUT /api/admin/users/{id}/role
//    @PutMapping("/users/{id}/role")
//    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest req) {
//        try {
//            return ResponseEntity.ok(adminService.updateUserRole(id, req));
//        } catch (RuntimeException e) {
//            // Return 400 for expected errors (invalid role, user not found)
//            return ResponseEntity.status(400).body(e.getMessage());
//        } catch (Exception e) {
//            // Unexpected errors
//            return ResponseEntity.status(500).body("Something went wrong");
//        }
//    }

    // PUT /api/admin/users/{id}/role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleUpdateRequest req) {
        return ResponseEntity.ok(adminService.updateUserRole(id, req));
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }
}
