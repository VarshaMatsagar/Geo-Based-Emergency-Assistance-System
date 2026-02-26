package com.emergency.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.emergency.dto.ApiResponse;
import com.emergency.dto.EmergencyImageDTO;
import com.emergency.dto.EmergencyMessageDTO;
import com.emergency.dto.RegisterRequest;
import com.emergency.dto.UpdateProfileDTO;
import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyMediaEntity;
import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.Role;
import com.emergency.entity.User;
import com.emergency.repository.EmergencyMediaRepository;
import com.emergency.repository.EmergencyRepository;
import com.emergency.repository.UserRepository;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Setter
@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenServiceImpl implements CitizenService {

    private final UserRepository userRepository;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyMediaRepository emergencyMediaRepository;
    private final HospitalAssignmentService hospitalAssignmentService;
    private final PasswordEncoder passwordEncoder;

    // ================= REGISTER =================
    @Override
    public ApiResponse<String> registerCitizen(RegisterRequest request) {

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // 🔐 FIX: ALWAYS HASH PASSWORD
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(Role.CITIZEN);

        userRepository.save(user);

        return new ApiResponse<>("Citizen registered successfully", "SUCCESS");
    }

    // ================= GET ALL =================
    @Override
    public List<User> getAllCitizens() {
        return userRepository.findByRole(Role.CITIZEN);
    }

    // ================= PROFILE =================
    @Override
    public User getProfile(Long citizenId) {
        return userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));
    }

    // ================= UPDATE PROFILE =================
    @Override
    public ApiResponse<String> updateProfile(Long citizenId, UpdateProfileDTO dto) {

        User user = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(dto.getFullName());
        user.setPhoneNumber(dto.getPhoneNumber());

        // 🔐 FIX: hash password ONLY if provided
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        userRepository.save(user);

        return new ApiResponse<>(true, "Profile updated successfully");
    }

    // ================= EMERGENCY MESSAGE =================
    @Override
    public Emergency createEmergencyMessage(EmergencyMessageDTO dto) {

        Emergency emergency = new Emergency();

        if (dto.getCitizenId() != null) {
            User citizen = userRepository.findById(dto.getCitizenId()).orElseThrow();
            emergency.setUser(citizen);
        }

        emergency.setDescription(dto.getDescription());
        emergency.setEmergencyType("Message");
        emergency.setStatus(EmergencyStatus.PENDING);
        emergency.setTargetDepartment(dto.getTargetDepartment());
        emergency.setLatitude(dto.getLatitude());
        emergency.setLongitude(dto.getLongitude());
        emergency.setAddress(dto.getAddress());

        Emergency saved = emergencyRepository.save(emergency);

        if (dto.getLatitude() != null && dto.getLongitude() != null &&
            ("HOSPITAL".equals(dto.getTargetDepartment()) || "BOTH".equals(dto.getTargetDepartment()))) {

            hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
        }

        return saved;
    }

    // ================= EMERGENCY IMAGE =================
    @Override
    public ApiResponse<String> createEmergencyImage(EmergencyImageDTO dto) {

        try {
            Emergency emergency = new Emergency();

            if (dto.getCitizenId() != null) {
                User citizen = userRepository.findById(dto.getCitizenId()).orElseThrow();
                emergency.setUser(citizen);
            }

            emergency.setDescription(dto.getDescription());
            emergency.setEmergencyType("Image");
            emergency.setStatus(EmergencyStatus.PENDING);
            emergency.setTargetDepartment(dto.getTargetDepartment());
            emergency.setLatitude(dto.getLatitude());
            emergency.setLongitude(dto.getLongitude());
            emergency.setAddress(dto.getAddress());

            Emergency saved = emergencyRepository.save(emergency);

            EmergencyMediaEntity media = new EmergencyMediaEntity();
            media.setEmergency(saved);
            media.setMediaType(dto.getImage().getContentType());
            media.setMediaData(dto.getImage().getBytes());

            emergencyMediaRepository.save(media);

            // Auto-assign hospital if target includes HOSPITAL and location is available
            if (dto.getLatitude() != null && dto.getLongitude() != null &&
                ("HOSPITAL".equals(dto.getTargetDepartment()) || "BOTH".equals(dto.getTargetDepartment()))) {
                hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
            }

            return new ApiResponse<>("Image emergency created successfully", "SUCCESS");

        } catch (Exception e) {
            log.error("Error creating emergency image", e);
            return new ApiResponse<>("Error creating emergency", "ERROR");
        }
    }

    // ================= PANIC ALERT =================
    @Override
    public Emergency createEmergencyAlert(Long citizenId) {
        return createEmergencyAlert(citizenId, "BOTH", null, null, null);
    }

    @Override
    public Emergency createEmergencyAlert(
            Long citizenId,
            String targetDepartment,
            Double latitude,
            Double longitude,
            String address) {

        Emergency emergency = new Emergency();

        if (citizenId != null) {
            User citizen = userRepository.findById(citizenId).orElseThrow();
            emergency.setUser(citizen);
        }

        emergency.setDescription("Emergency alert triggered by citizen");
        emergency.setEmergencyType("EmergencyButton");
        emergency.setStatus(EmergencyStatus.PENDING);
        emergency.setTargetDepartment(targetDepartment);
        emergency.setLatitude(latitude);
        emergency.setLongitude(longitude);
        emergency.setAddress(address);

        Emergency saved = emergencyRepository.save(emergency);

        // Auto-assign hospital for panic button (always goes to BOTH departments)
        if (latitude != null && longitude != null &&
            ("HOSPITAL".equals(targetDepartment) || "BOTH".equals(targetDepartment))) {
            hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
        }

        return saved;
    }

    // ================= GET EMERGENCY =================
    @Override
    public Emergency getEmergency(Long id) {
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency not found"));
    }

	@Override
	public Emergency createEmergencyAlert(Long citizenId, String targetDepartment) {
		// TODO Auto-generated method stub
		return null;
	}
}



//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class CitizenServiceImpl implements CitizenService {
//    private final UserRepository userRepository;
//    private final EmergencyRepository emergencyRepository;
//    private final EmergencyMediaRepository emergencyMediaRepository;
//    private final HospitalAssignmentService hospitalAssignmentService;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public ApiResponse<String> registerCitizen(RegisterRequest request) {
//        User user = new User();
//        user.setFullName(request.getFullName());
//        user.setEmail(request.getEmail());
//        user.setPassword(request.getPasswordHash());
//        user.setPhoneNumber(request.getPhoneNumber());
//        user.setRole(Role.CITIZEN);
//        userRepository.save(user);
//        return new ApiResponse<>("Citizen registered successfully", "SUCCESS");
//    }
//
//    @Override
//    public List<User> getAllCitizens() {
//        return userRepository.findByRole(Role.CITIZEN);
//    }
//
//    @Override
//    public User getProfile(Long citizenId) {
//        return userRepository.findById(citizenId).orElseThrow();
//    }
//
//    public ApiResponse updateProfile(Long citizenId, UpdateProfileDTO dto) {
//
//        User user = userRepository.findById(citizenId)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        user.setFullName(dto.getFullName());
//        user.setEmail(dto.getEmail());
//        user.setPhoneNumber(dto.getPhoneNumber());
//        user.setAddress(dto.getAddress());
//
//        // 🔥 IMPORTANT: hash password ONLY if provided
//        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
//            user.setPassword(passwordEncoder.encode(dto.getPassword()));
//        }
//
//        userRepository.save(user);
//
//        return new ApiResponse(true, "Profile updated successfully");
//    }
//
////    @Override
////    public ApiResponse<String> updateProfile(Long citizenId, UpdateProfileDTO dto) {
////        User user = userRepository.findById(citizenId).orElseThrow();
////        user.setFullName(dto.getFullName());
////        user.setPhoneNumber(dto.getPhoneNumber());
////        
////        if (dto.getNewPassword() != null && !dto.getNewPassword().trim().isEmpty()) {
////            user.setPassword(dto.getNewPassword());
////        }
////        
////        userRepository.save(user);
////        return new ApiResponse<>("Profile updated successfully", "SUCCESS");
////    }
//
//    @Override
//    public Emergency createEmergencyMessage(EmergencyMessageDTO dto) {
//        Emergency emergency = new Emergency();
//        
//        if (dto.getCitizenId() != null) {
//            User citizen = userRepository.findById(dto.getCitizenId()).orElseThrow();
//            emergency.setUser(citizen);
//        }
//        
//        emergency.setDescription(dto.getDescription());
//        emergency.setEmergencyType("Message");
//        emergency.setStatus(EmergencyStatus.PENDING);
//        emergency.setTargetDepartment(dto.getTargetDepartment());
//        emergency.setLatitude(dto.getLatitude());
//        emergency.setLongitude(dto.getLongitude());
//        emergency.setAddress(dto.getAddress());
//        
//        Emergency saved = emergencyRepository.save(emergency);
//        
//        // Auto-assign hospital if target includes HOSPITAL and location is available
//        if (dto.getLatitude() != null && dto.getLongitude() != null && 
//            ("HOSPITAL".equals(dto.getTargetDepartment()) || "BOTH".equals(dto.getTargetDepartment()))) {
//            log.info("🏥 Triggering hospital assignment for emergency {} with location {},{}", 
//                saved.getId(), dto.getLatitude(), dto.getLongitude());
//            Hospital assignedHospital = hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
//            if (assignedHospital != null) {
//                log.info("✅ Emergency {} assigned to hospital: {}", saved.getId(), assignedHospital.getName());
//            } else {
//                log.warn("❌ Failed to assign hospital to emergency {}", saved.getId());
//            }
//        } else {
//            log.info("⏭️ Skipping hospital assignment for emergency {} - Target: {}, Location: {},{}", 
//                saved.getId(), dto.getTargetDepartment(), dto.getLatitude(), dto.getLongitude());
//        }
//        
//        return saved;
//    }
//
//    @Override
//    public ApiResponse<String> createEmergencyImage(EmergencyImageDTO dto) {
//        try {
//            Emergency emergency = new Emergency();
//            
//            if (dto.getCitizenId() != null) {
//                User citizen = userRepository.findById(dto.getCitizenId()).orElseThrow();
//                emergency.setUser(citizen);
//            }
//            
//            emergency.setDescription(dto.getDescription());
//            emergency.setEmergencyType("Image");
//            emergency.setStatus(EmergencyStatus.PENDING);
//            emergency.setTargetDepartment(dto.getTargetDepartment());
//            emergency.setLatitude(dto.getLatitude());
//            emergency.setLongitude(dto.getLongitude());
//            emergency.setAddress(dto.getAddress());
//            Emergency saved = emergencyRepository.save(emergency);
//
//            EmergencyMediaEntity media = new EmergencyMediaEntity();
//            media.setEmergency(saved);
//            media.setMediaType(dto.getImage().getContentType());
//            media.setMediaData(dto.getImage().getBytes());
//            emergencyMediaRepository.save(media);
//            
//            // Auto-assign hospital if target includes HOSPITAL and location is available
//            if (dto.getLatitude() != null && dto.getLongitude() != null && 
//                ("HOSPITAL".equals(dto.getTargetDepartment()) || "BOTH".equals(dto.getTargetDepartment()))) {
//                hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
//            }
//
//            return new ApiResponse<>("Image emergency created successfully", "SUCCESS");
//        } catch (Exception e) {
//            return new ApiResponse<>("Error creating emergency", "ERROR");
//        }
//    }
//
//    @Override
//    public Emergency createEmergencyAlert(Long citizenId) {
//        return createEmergencyAlert(citizenId, "BOTH", null, null, null);
//    }
//    
//    @Override
//    public Emergency createEmergencyAlert(Long citizenId, String targetDepartment) {
//        return createEmergencyAlert(citizenId, targetDepartment, null, null, null);
//    }
//    
//    @Override
//    public Emergency createEmergencyAlert(Long citizenId, String targetDepartment, Double latitude, Double longitude, String address) {
//        log.info("🚨 PANIC ALERT: Creating emergency alert - CitizenId: {}, Target: {}, Location: {},{}", 
//            citizenId, targetDepartment, latitude, longitude);
//        
//        try {
//            Emergency emergency = new Emergency();
//            if (citizenId != null) {
//                User citizen = userRepository.findById(citizenId).orElseThrow();
//                emergency.setUser(citizen);
//                log.info("🚨 PANIC ALERT: User found: {}", citizen.getFullName());
//            } else {
//                log.info("🚨 PANIC ALERT: Anonymous user (no citizenId provided)");
//            }
//            
//            emergency.setDescription("Emergency alert triggered by citizen");
//            emergency.setEmergencyType("EmergencyButton");
//            emergency.setStatus(EmergencyStatus.PENDING);
//            emergency.setTargetDepartment(targetDepartment);
//            emergency.setLatitude(latitude);
//            emergency.setLongitude(longitude);
//            emergency.setAddress(address);
//            
//            log.info("🚨 PANIC ALERT: Saving emergency to database...");
//            Emergency saved = emergencyRepository.save(emergency);
//            log.info("🚨 PANIC ALERT: Emergency saved successfully with ID: {}", saved.getId());
//            
//            // Auto-assign hospital for panic button (always goes to BOTH departments)
//            if (latitude != null && longitude != null) {
//                log.info("🚨 PANIC ALERT: Triggering hospital assignment...");
//                try {
//                    Hospital assignedHospital = hospitalAssignmentService.assignNearestHospitalWithBeds(saved);
//                    if (assignedHospital != null) {
//                        log.info("🚨 PANIC ALERT: Hospital assigned: {}", assignedHospital.getName());
//                    } else {
//                        log.warn("🚨 PANIC ALERT: No hospital assigned (no beds available)");
//                    }
//                } catch (Exception e) {
//                    log.error("🚨 PANIC ALERT: Hospital assignment failed but emergency still saved: {}", e.getMessage());
//                }
//            } else {
//                log.info("🚨 PANIC ALERT: No location provided, skipping hospital assignment");
//            }
//            
//            return saved;
//        } catch (Exception e) {
//            log.error("🚨 PANIC ALERT ERROR: Failed to create emergency alert", e);
//            throw new RuntimeException("Failed to create emergency alert: " + e.getMessage(), e);
//        }
//    }
//
//    @Override
//    public Emergency getEmergency(Long id) {
//        return emergencyRepository.findById(id).orElseThrow();
//    }
//}