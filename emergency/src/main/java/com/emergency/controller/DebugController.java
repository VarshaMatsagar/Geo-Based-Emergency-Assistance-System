package com.emergency.controller;

import com.emergency.entity.Emergency;
import com.emergency.entity.Hospital;
import com.emergency.repository.EmergencyRepository;
import com.emergency.service.HospitalAssignmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@Slf4j
public class DebugController {

    private final HospitalAssignmentService hospitalAssignmentService;
    private final EmergencyRepository emergencyRepository;

    public DebugController(HospitalAssignmentService hospitalAssignmentService, 
                          EmergencyRepository emergencyRepository) {
        this.hospitalAssignmentService = hospitalAssignmentService;
        this.emergencyRepository = emergencyRepository;
    }

    @PostMapping("/assign-hospital/{emergencyId}")
    public ResponseEntity<Map<String, Object>> debugHospitalAssignment(@PathVariable Long emergencyId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
            
            log.info("🔍 DEBUG: Manual hospital assignment for emergency {}", emergencyId);
            
            Hospital assignedHospital = hospitalAssignmentService.assignNearestHospitalWithBeds(emergency);
            
            // Refresh emergency from database
            Emergency updatedEmergency = emergencyRepository.findById(emergencyId).orElse(null);
            
            response.put("success", true);
            response.put("emergencyId", emergencyId);
            response.put("assignedHospital", assignedHospital != null ? assignedHospital.getName() : null);
            response.put("assignedHospitalId", assignedHospital != null ? assignedHospital.getId() : null);
            response.put("databaseAssignedHospitalId", 
                updatedEmergency != null && updatedEmergency.getAssignedHospital() != null ? 
                updatedEmergency.getAssignedHospital().getId() : null);
            response.put("location", emergency.getLatitude() + "," + emergency.getLongitude());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ DEBUG: Error in hospital assignment", e);
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}