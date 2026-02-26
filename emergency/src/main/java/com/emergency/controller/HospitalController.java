package com.emergency.controller;

import com.emergency.dto.ApiResponse;
import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.EmergencyMediaEntity;
import com.emergency.repository.EmergencyRepository;
import com.emergency.repository.EmergencyMediaRepository;
import com.emergency.service.HospitalService;
import com.emergency.service.NotificationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital")
@Slf4j
public class HospitalController {

    private final HospitalService hospitalService;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyMediaRepository emergencyMediaRepository;
    private final NotificationService notificationService;

    public HospitalController(HospitalService hospitalService, EmergencyRepository emergencyRepository, 
                            EmergencyMediaRepository emergencyMediaRepository, NotificationService notificationService) {
        this.hospitalService = hospitalService;
        this.emergencyRepository = emergencyRepository;
        this.emergencyMediaRepository = emergencyMediaRepository;
        this.notificationService = notificationService;
    }

    @GetMapping("/emergency/all")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<List<Emergency>>> getAllEmergencies() {
        try {
            // Show all hospital-targeted emergencies (since we don't have hospital-user mapping yet)
            List<Emergency> emergencies = emergencyRepository.findByTargetDepartmentInOrderByCreatedOnDesc(
                Arrays.asList("HOSPITAL", "BOTH"));
            
            log.info("Found {} hospital-targeted emergencies", emergencies.size());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Emergencies fetched successfully", emergencies));
        } catch (Exception e) {
            log.error("Error fetching emergencies: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching emergencies: " + e.getMessage(), null));
        }
    }

    @GetMapping("/emergency/{emergencyId}")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<Emergency>> getEmergencyById(@PathVariable Long emergencyId) {
        try {
            Emergency emergency = emergencyRepository.findByIdWithUser(emergencyId)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
            
            // Verify this emergency targets hospitals
            if (!"HOSPITAL".equals(emergency.getTargetDepartment()) && !"BOTH".equals(emergency.getTargetDepartment())) {
                throw new RuntimeException("Emergency not assigned to hospital department");
            }
            
            // Debug logging for hospital assignment
            log.info("🔍 Emergency {} details - Target: {}, Assigned Hospital ID: {}, Hospital Name: {}", 
                emergencyId, 
                emergency.getTargetDepartment(),
                emergency.getAssignedHospital() != null ? emergency.getAssignedHospital().getId() : "NULL",
                emergency.getAssignedHospital() != null ? emergency.getAssignedHospital().getName() : "NULL");
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Emergency details fetched successfully", emergency));
        } catch (Exception e) {
            log.error("Error fetching emergency {}: {}", emergencyId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching emergency: " + e.getMessage(), null));
        }
    }

    @GetMapping("/emergency/active")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<List<Emergency>>> getActiveEmergencies() {
        try {
            List<Emergency> emergencies = hospitalService.getAssignedEmergencies(1L); // Using hospital ID 1 for demo
            return ResponseEntity.ok(new ApiResponse<>(true, "Active emergencies fetched successfully", emergencies));
        } catch (Exception e) {
            log.error("Error fetching active emergencies: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching emergencies: " + e.getMessage(), null));
        }
    }

    @PostMapping("/emergency/{emergencyId}/reject")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<Emergency>> rejectEmergency(
            @PathVariable Long emergencyId,
            @RequestBody Map<String, String> request) {
        try {
            String reason = request.getOrDefault("reason", "No beds available");
            Emergency emergency = hospitalService.rejectEmergency(emergencyId, reason);
            
            String message = emergency.getAssignedHospital() != null 
                ? "Emergency reassigned to " + emergency.getAssignedHospital().getName()
                : "Emergency rejected - no alternative hospital found";
                
            return ResponseEntity.ok(new ApiResponse<>(true, message, emergency));
        } catch (Exception e) {
            log.error("Error rejecting emergency {}: {}", emergencyId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error rejecting emergency: " + e.getMessage(), null));
        }
    }

    @PutMapping("/emergency/{emergencyId}/status")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<Emergency>> updateEmergencyStatus(
            @PathVariable Long emergencyId,
            @RequestBody Map<String, String> request) {
        try {
            EmergencyStatus status = EmergencyStatus.valueOf(request.get("status"));
            
            Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
            EmergencyStatus oldStatus = emergency.getStatus();
            
            Emergency updatedEmergency = hospitalService.updateEmergencyStatus(emergencyId, status);
            
            // Create notification for citizen if status changed
            if (!oldStatus.equals(status) && emergency.getUser() != null) {
                notificationService.createStatusChangeNotification(emergency, status, "HOSPITAL");
            }
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Emergency status updated successfully", updatedEmergency));
        } catch (Exception e) {
            log.error("Error updating emergency status {}: {}", emergencyId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error updating status: " + e.getMessage(), null));
        }
    }

    @GetMapping("/emergency/{emergencyId}/image")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<byte[]> getEmergencyImage(@PathVariable Long emergencyId) {
        try {
            List<EmergencyMediaEntity> mediaList = emergencyMediaRepository.findByEmergencyId(emergencyId);
            
            if (mediaList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EmergencyMediaEntity media = mediaList.get(0);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(media.getMediaType()));
            headers.setContentLength(media.getMediaData().length);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(media.getMediaData());
        } catch (Exception e) {
            log.error("Error fetching emergency image {}: {}", emergencyId, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/emergency/{emergencyId}/media")
    @PreAuthorize("hasAuthority('HOSPITAL')")
    public ResponseEntity<ApiResponse<List<Object>>> getEmergencyMedia(@PathVariable Long emergencyId) {
        try {
            // For now, return empty list - can be implemented later if needed
            return ResponseEntity.ok(new ApiResponse<>(true, "Media fetched successfully", List.of()));
        } catch (Exception e) {
            log.error("Error fetching emergency media {}: {}", emergencyId, e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Error fetching media: " + e.getMessage(), null));
        }
    }
}