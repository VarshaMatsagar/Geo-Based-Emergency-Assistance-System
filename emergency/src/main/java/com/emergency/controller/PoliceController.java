package com.emergency.controller;

import java.util.List;
import java.util.Arrays;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.emergency.dto.ApiResponse;
import com.emergency.dto.UpdateEmergencyStatusRequest;
import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.EmergencyMediaEntity;
import com.emergency.service.EmergencyService;
import com.emergency.service.NotificationService;
import com.emergency.repository.EmergencyMediaRepository;

@RestController
@RequestMapping("/api/police")
@CrossOrigin("*")
@PreAuthorize("hasAuthority('POLICE')")
public class PoliceController {

    @Autowired
    private EmergencyService emergencyService;
    
    @Autowired
    private EmergencyMediaRepository emergencyMediaRepository;
    
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/emergency/all")
    public ResponseEntity<?> getAllEmergenciesForPolice() {
        try {
            List<Emergency> emergencies = emergencyService.getEmergenciesByTargetDepartment(
                Arrays.asList("POLICE", "BOTH"));
            
            // Fallback: if no targeted emergencies, show all emergencies for debugging
            if (emergencies.isEmpty()) {
                System.out.println("No targeted emergencies found, showing all emergencies for debugging");
                emergencies = emergencyService.getAllEmergencies();
            }
            
            return ResponseEntity.ok(emergencies);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/emergency/{id}")
    public ResponseEntity<?> getEmergencyByIdForPolice(@PathVariable Long id) {
        try {
            Emergency emergency = emergencyService.getEmergencyById(id);
            return ResponseEntity.ok(emergency);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/emergency/{id}/image")
    public ResponseEntity<byte[]> getEmergencyImage(@PathVariable Long id) {
        try {
            List<EmergencyMediaEntity> mediaList = emergencyMediaRepository.findByEmergencyId(id);
            
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
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/emergency/status/{id}")
    public ResponseEntity<?> updateEmergencyStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String statusStr = request.get("status");
            System.out.println("🔄 POLICE STATUS UPDATE: Emergency ID=" + id + ", Status=" + statusStr + ", Length=" + (statusStr != null ? statusStr.length() : "null"));
            
            EmergencyStatus status = EmergencyStatus.valueOf(statusStr);
            
            Emergency emergency = emergencyService.getEmergencyById(id);
            EmergencyStatus oldStatus = emergency.getStatus();
            
            Emergency updatedEmergency = emergencyService.updateEmergencyStatus(id, status);
            
            // Create notification for citizen if status changed
            if (!oldStatus.equals(status) && emergency.getUser() != null) {
                notificationService.createStatusChangeNotification(emergency, status, "POLICE");
            }
            
            System.out.println("✅ POLICE STATUS UPDATE SUCCESS: Emergency " + id + " updated to " + status);
            return ResponseEntity.ok(updatedEmergency);
        } catch (Exception e) {
            System.err.println("❌ POLICE STATUS UPDATE ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }
}