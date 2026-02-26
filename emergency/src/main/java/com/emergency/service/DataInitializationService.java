package com.emergency.service;

import com.emergency.entity.Hospital;
import com.emergency.entity.HospitalBeds;
import com.emergency.entity.Emergency;
import com.emergency.repository.HospitalRepository;
import com.emergency.repository.HospitalBedsRepository;
import com.emergency.repository.EmergencyRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class DataInitializationService implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final HospitalBedsRepository hospitalBedsRepository;
    private final EmergencyRepository emergencyRepository;
    private final HospitalAssignmentService hospitalAssignmentService;

    public DataInitializationService(HospitalRepository hospitalRepository, 
                                   HospitalBedsRepository hospitalBedsRepository,
                                   EmergencyRepository emergencyRepository,
                                   HospitalAssignmentService hospitalAssignmentService) {
        this.hospitalRepository = hospitalRepository;
        this.hospitalBedsRepository = hospitalBedsRepository;
        this.emergencyRepository = emergencyRepository;
        this.hospitalAssignmentService = hospitalAssignmentService;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeHospitals();
        assignHospitalsToExistingEmergencies();
    }

    private void initializeHospitals() {
        if (hospitalRepository.count() == 0) {
            log.info("Initializing sample hospitals...");
            
            // Hospital 1
            Hospital hospital1 = new Hospital();
            hospital1.setName("City General Hospital");
            hospital1.setLatitude(18.5204);
            hospital1.setLongitude(73.8567);
            hospital1.setAddress("123 Main Street, Pune");
            hospital1.setContactNumber("020-12345678");
            hospital1.setIsActive(true);
            hospital1 = hospitalRepository.save(hospital1);
            
            HospitalBeds beds1 = new HospitalBeds();
            beds1.setHospital(hospital1);
            beds1.setTotalBeds(100);
            beds1.setAvailableBeds(25);
            hospitalBedsRepository.save(beds1);
            
            // Hospital 2
            Hospital hospital2 = new Hospital();
            hospital2.setName("Metro Medical Center");
            hospital2.setLatitude(18.5314);
            hospital2.setLongitude(73.8446);
            hospital2.setAddress("456 Park Avenue, Pune");
            hospital2.setContactNumber("020-87654321");
            hospital2.setIsActive(true);
            hospital2 = hospitalRepository.save(hospital2);
            
            HospitalBeds beds2 = new HospitalBeds();
            beds2.setHospital(hospital2);
            beds2.setTotalBeds(80);
            beds2.setAvailableBeds(15);
            hospitalBedsRepository.save(beds2);
            
            // Hospital 3
            Hospital hospital3 = new Hospital();
            hospital3.setName("Emergency Care Hospital");
            hospital3.setLatitude(18.5074);
            hospital3.setLongitude(73.8077);
            hospital3.setAddress("789 Emergency Lane, Pune");
            hospital3.setContactNumber("020-11223344");
            hospital3.setIsActive(true);
            hospital3 = hospitalRepository.save(hospital3);
            
            HospitalBeds beds3 = new HospitalBeds();
            beds3.setHospital(hospital3);
            beds3.setTotalBeds(120);
            beds3.setAvailableBeds(30);
            hospitalBedsRepository.save(beds3);
            
            log.info("✅ Sample hospitals initialized successfully!");
        } else {
            log.info("Hospitals already exist in database, skipping initialization");
        }
    }
    
    private void assignHospitalsToExistingEmergencies() {
        List<Emergency> unassignedEmergencies = emergencyRepository.findAll().stream()
            .filter(e -> e.getAssignedHospital() == null && 
                        ("HOSPITAL".equals(e.getTargetDepartment()) || "BOTH".equals(e.getTargetDepartment())))
            .toList();
            
        if (!unassignedEmergencies.isEmpty()) {
            log.info("Assigning hospitals to {} existing emergencies...", unassignedEmergencies.size());
            List<Hospital> hospitals = hospitalRepository.findByIsActiveTrue();
            
            if (!hospitals.isEmpty()) {
                Hospital firstHospital = hospitals.get(0);
                for (Emergency emergency : unassignedEmergencies) {
                    try {
                        // Try assignment service first
                        Hospital assigned = hospitalAssignmentService.assignNearestHospitalWithBeds(emergency);
                        if (assigned == null) {
                            // Force assign to first hospital if assignment service fails
                            emergency.setAssignedHospital(firstHospital);
                            emergencyRepository.save(emergency);
                            log.info("Force assigned emergency {} to hospital {}", emergency.getId(), firstHospital.getName());
                        }
                    } catch (Exception e) {
                        log.warn("Failed to assign hospital to emergency {}: {}", emergency.getId(), e.getMessage());
                        // Force assign to first hospital
                        emergency.setAssignedHospital(firstHospital);
                        emergencyRepository.save(emergency);
                        log.info("Force assigned emergency {} to hospital {} after error", emergency.getId(), firstHospital.getName());
                    }
                }
            }
        }
    }
}