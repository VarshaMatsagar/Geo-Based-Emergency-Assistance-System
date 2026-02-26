package com.emergency.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emergency.dto.ApiResponse;
import com.emergency.dto.EmergencyImageDTO;
import com.emergency.dto.EmergencyMessageDTO;
import com.emergency.dto.RegisterRequest;
import com.emergency.dto.UpdateProfileDTO;
import com.emergency.entity.Emergency;
import com.emergency.entity.User;

import com.emergency.repository.EmergencyRepository;
import com.emergency.service.CitizenService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/citizen")
@CrossOrigin(origins = "*")
public class CitizenController {
	private final CitizenService citizenService;
	private final EmergencyRepository emergencyRepository;

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<String>> registerCitizen(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.ok(citizenService.registerCitizen(request));
	}

	@GetMapping("/all")
	public ResponseEntity<List<User>> getAllCitizens() {
		return ResponseEntity.ok(citizenService.getAllCitizens());
	}

	@GetMapping("/profile/{citizenId}")
	public ResponseEntity<User> getProfile(@PathVariable Long citizenId) {
		return ResponseEntity.ok(citizenService.getProfile(citizenId));
	}

	@PutMapping("/profile/{citizenId}")
	public ResponseEntity<ApiResponse<String>> updateProfile(@PathVariable Long citizenId,
			@Valid @RequestBody UpdateProfileDTO dto) {
		return ResponseEntity.ok(citizenService.updateProfile(citizenId, dto));
	}

	@PostMapping("/emergency/message")
	public ResponseEntity<Emergency> createEmergencyMessage(@Valid @RequestBody EmergencyMessageDTO dto) {
		return ResponseEntity.ok(citizenService.createEmergencyMessage(dto));
	}

	@PostMapping(value = "/emergency/image", consumes = "multipart/form-data")
	public ResponseEntity<ApiResponse> createEmergencyImage(@ModelAttribute EmergencyImageDTO dto) {
		return ResponseEntity.ok(citizenService.createEmergencyImage(dto));
	}

    @PostMapping("/emergency/alert/{citizenId}")
    public ResponseEntity<Emergency> createEmergencyAlert(@PathVariable Long citizenId) {
        return ResponseEntity.ok(citizenService.createEmergencyAlert(citizenId));
    }

    // Overload used by current frontend: POST /api/citizen/emergency/alert (no citizenId path param)
    @PostMapping("/emergency/alert")
    public ResponseEntity<Emergency> createEmergencyAlertAnonymous(@RequestBody(required = false) java.util.Map<String, Object> request) {
        System.out.println("🚨 PANIC BUTTON: Request received at /api/citizen/emergency/alert");
        System.out.println("🚨 PANIC BUTTON: Request payload: " + request);
        
        try {
            String targetDepartment = "BOTH";
            Double latitude = null;
            Double longitude = null;
            String address = null;
            
            if (request != null) {
                if (request.containsKey("targetDepartment")) {
                    targetDepartment = (String) request.get("targetDepartment");
                }
                if (request.containsKey("latitude")) {
                    latitude = Double.valueOf(request.get("latitude").toString());
                }
                if (request.containsKey("longitude")) {
                    longitude = Double.valueOf(request.get("longitude").toString());
                }
                if (request.containsKey("address")) {
                    address = (String) request.get("address");
                }
            }
            
            System.out.println("🚨 PANIC BUTTON: Parsed - Target: " + targetDepartment + ", Location: " + latitude + "," + longitude);
            
            Emergency result = citizenService.createEmergencyAlert(null, targetDepartment, latitude, longitude, address);
            System.out.println("🚨 PANIC BUTTON: Emergency created successfully with ID: " + result.getId());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("🚨 PANIC BUTTON ERROR: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

	@GetMapping("/emergency/{id}")
	public ResponseEntity<Emergency> getEmergency(@PathVariable Long id) {
		return ResponseEntity.ok(citizenService.getEmergency(id));
	}
	
	// Debug endpoint to check all emergencies
	@GetMapping("/emergency/debug/all")
	public ResponseEntity<List<Emergency>> getAllEmergenciesDebug() {
		return ResponseEntity.ok(emergencyRepository.findAll());
	}
	
	// Test endpoint to verify authentication
	@GetMapping("/test-auth")
	public ResponseEntity<String> testAuth() {
		System.out.println("🔑 AUTH TEST: Citizen endpoint accessed successfully");
		return ResponseEntity.ok("Authentication working for CITIZEN role");
	}
}
