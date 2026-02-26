package com.emergency.service;

import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyStatus;
import com.emergency.repository.EmergencyRepository;
import com.emergency.repository.EmergencyMediaRepository;
import com.emergency.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Arrays;

@Service
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;
    private final UserRepository userRepository;
    private final EmergencyMediaRepository emergencyMediaRepository;
    private final NotificationService notificationService;

    public EmergencyService(EmergencyRepository emergencyRepository, UserRepository userRepository, 
                          EmergencyMediaRepository emergencyMediaRepository, NotificationService notificationService) {
        this.emergencyRepository = emergencyRepository;
        this.userRepository = userRepository;
        this.emergencyMediaRepository = emergencyMediaRepository;
        this.notificationService = notificationService;
    }

    // 1️⃣ View all emergencies
    public List<Emergency> getAllEmergencies() {
        return emergencyRepository.findAll();
    }
    
    // Get emergencies by target department
    public List<Emergency> getEmergenciesByTargetDepartment(List<String> targetDepartments) {
        System.out.println("Fetching emergencies for departments: " + targetDepartments);
        try {
            List<Emergency> emergencies = emergencyRepository.findByTargetDepartmentInOrderByCreatedOnDesc(targetDepartments);
            System.out.println("Found " + emergencies.size() + " emergencies");
            for (Emergency e : emergencies) {
                System.out.println("Emergency ID: " + e.getId() + ", Target: " + e.getTargetDepartment() + ", Type: " + e.getEmergencyType());
            }
            return emergencies;
        } catch (Exception e) {
            System.out.println("Error in targetDepartment query: " + e.getMessage());
            // Fallback to all emergencies if targetDepartment column doesn't exist
            return getAllEmergencies();
        }
    }

    // 2️⃣ View all active emergencies
    public List<Emergency> getAllActiveEmergencies() {
        return emergencyRepository.findByStatusNot(EmergencyStatus.RESOLVED);
    }

    // 2️⃣ View emergency details
    public Emergency getEmergencyById(Long id) {
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
    }

    // 3️⃣ Update emergency status
    public Emergency updateEmergencyStatus(Long id, EmergencyStatus status) {
        Emergency emergency = getEmergencyById(id);
        EmergencyStatus oldStatus = emergency.getStatus();
        emergency.setStatus(status);
        Emergency saved = emergencyRepository.save(emergency);
        
        // Create notification for citizen if status actually changed
        if (!oldStatus.equals(status) && emergency.getUser() != null) {
            notificationService.createStatusChangeNotification(emergency, status, "SYSTEM");
        }
        
        return saved;
    }

    // 3️⃣ Update emergency status with DTO and validation
    public Emergency updateEmergencyStatus(Long id, com.emergency.dto.UpdateEmergencyStatusRequest request) {
        Emergency emergency = getEmergencyById(id);
        
        // Validate status transition
        if (!isValidStatusTransition(emergency.getStatus(), request.getStatus())) {
            throw new RuntimeException("Invalid status transition from " + emergency.getStatus() + " to " + request.getStatus());
        }
        
        emergency.setStatus(request.getStatus());
        
        // Assign police officer if provided
        if (request.getPoliceOfficerId() != null) {
            com.emergency.entity.User policeOfficer = userRepository.findById(request.getPoliceOfficerId())
                .orElseThrow(() -> new RuntimeException("Police officer not found"));
            emergency.setAssignedPolice(policeOfficer);
        }
        
        return emergencyRepository.save(emergency);
    }
    
    // Validate status transitions
    private boolean isValidStatusTransition(EmergencyStatus currentStatus, EmergencyStatus newStatus) {
        if (currentStatus == newStatus) return true;
        
        return switch (currentStatus) {
            case PENDING -> Arrays.asList(EmergencyStatus.ACCEPTED, EmergencyStatus.REJECTED).contains(newStatus);
            case ACCEPTED -> Arrays.asList(EmergencyStatus.IN_PROGRESS).contains(newStatus);
            case IN_PROGRESS -> Arrays.asList(EmergencyStatus.RESOLVED).contains(newStatus);
            case RESOLVED, REJECTED -> false; // Cannot change from resolved or rejected
        };
    }

    // 4️⃣ Get emergency media
    public List<com.emergency.entity.EmergencyMediaEntity> getEmergencyMedia(Long emergencyId) {
        return emergencyMediaRepository.findByEmergencyId(emergencyId);
    }

    // 5️⃣ Get emergency history by user
    public List<Emergency> getEmergenciesByUser(Long userId) {
        // check user existence (good practice)
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id " + userId);
        }
        return emergencyRepository.findByUserId(userId);
    }

}