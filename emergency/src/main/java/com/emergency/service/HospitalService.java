package com.emergency.service;

import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.Hospital;
import com.emergency.repository.EmergencyRepository;
import com.emergency.repository.HospitalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class HospitalService {

    private final EmergencyRepository emergencyRepository;
    private final HospitalRepository hospitalRepository;
    private final HospitalAssignmentService hospitalAssignmentService;

    public HospitalService(EmergencyRepository emergencyRepository,
                          HospitalRepository hospitalRepository,
                          HospitalAssignmentService hospitalAssignmentService) {
        this.emergencyRepository = emergencyRepository;
        this.hospitalRepository = hospitalRepository;
        this.hospitalAssignmentService = hospitalAssignmentService;
    }

    public List<Emergency> getAssignedEmergencies(Long hospitalId) {
        return emergencyRepository.findByAssignedHospitalIdAndStatusNot(hospitalId, EmergencyStatus.RESOLVED);
    }

    public List<Emergency> getAllAssignedEmergencies(Long hospitalId) {
        return emergencyRepository.findByAssignedHospitalIdOrderByCreatedOnDesc(hospitalId);
    }

    @Transactional
    public Emergency rejectEmergency(Long emergencyId, String reason) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
            .orElseThrow(() -> new RuntimeException("Emergency not found"));

        log.info("Hospital {} rejecting emergency {}: {}", 
            emergency.getAssignedHospital().getName(), emergencyId, reason);

        // Try to reassign to next nearest hospital
        Hospital newHospital = hospitalAssignmentService.reassignToNextNearestHospital(emergencyId);
        
        if (newHospital != null) {
            emergency.setStatus(EmergencyStatus.PENDING); // Reset status for new hospital
            log.info("Emergency {} reassigned to hospital: {}", emergencyId, newHospital.getName());
        } else {
            emergency.setStatus(EmergencyStatus.REJECTED);
            log.warn("No alternative hospital found for emergency {}", emergencyId);
        }

        return emergencyRepository.save(emergency);
    }

    public Emergency updateEmergencyStatus(Long emergencyId, EmergencyStatus status) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
            .orElseThrow(() -> new RuntimeException("Emergency not found"));
        
        emergency.setStatus(status);
        return emergencyRepository.save(emergency);
    }

    public Hospital getHospitalById(Long hospitalId) {
        return hospitalRepository.findById(hospitalId)
            .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }
}