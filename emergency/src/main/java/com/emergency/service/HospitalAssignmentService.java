package com.emergency.service;

import com.emergency.dto.GoogleDistanceMatrixResponse;
import com.emergency.dto.HospitalDistanceDTO;
import com.emergency.entity.Emergency;
import com.emergency.entity.Hospital;
import com.emergency.entity.HospitalBeds;
import com.emergency.repository.EmergencyRepository;
import com.emergency.repository.HospitalBedsRepository;
import com.emergency.repository.HospitalRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class HospitalAssignmentService {

    private final HospitalRepository hospitalRepository;
    private final HospitalBedsRepository hospitalBedsRepository;
    private final EmergencyRepository emergencyRepository;
    private final RestTemplate restTemplate;

    @Value("${google.maps.api.key:}")
    private String googleMapsApiKey;

    private static final String GOOGLE_DISTANCE_MATRIX_URL = 
        "https://maps.googleapis.com/maps/api/distancematrix/json";

    public HospitalAssignmentService(HospitalRepository hospitalRepository,
                                   HospitalBedsRepository hospitalBedsRepository,
                                   EmergencyRepository emergencyRepository,
                                   RestTemplate restTemplate) {
        this.hospitalRepository = hospitalRepository;
        this.hospitalBedsRepository = hospitalBedsRepository;
        this.emergencyRepository = emergencyRepository;
        this.restTemplate = restTemplate;
    }

    @Transactional
    public Hospital assignNearestHospitalWithBeds(Emergency emergency) {
        log.info("Starting hospital assignment for emergency ID: {}, Location: {},{}", 
            emergency.getId(), emergency.getLatitude(), emergency.getLongitude());
        
        // Validate input
        if (emergency.getLatitude() == null || emergency.getLongitude() == null) {
            log.warn("Emergency {} has no location data, assigning first available hospital", emergency.getId());
            return assignFirstAvailableHospital(emergency);
        }
        
        List<Hospital> activeHospitals = hospitalRepository.findByIsActiveTrue();
        log.info("Found {} active hospitals", activeHospitals.size());
        
        if (activeHospitals.isEmpty()) {
            log.warn("No active hospitals found");
            return null;
        }

        List<HospitalDistanceDTO> hospitalDistances = calculateDistancesToHospitals(
            emergency.getLatitude(), emergency.getLongitude(), activeHospitals);
        
        log.info("Calculated distances for {} hospitals", hospitalDistances.size());

        // Sort by distance
        hospitalDistances.sort(Comparator.comparing(HospitalDistanceDTO::getDistanceInKm));

        // Find first hospital with available beds
        for (HospitalDistanceDTO hospitalDistance : hospitalDistances) {
            Hospital hospital = hospitalDistance.getHospital();
            log.info("Checking hospital: {} (Distance: {} km)", hospital.getName(), hospitalDistance.getDistanceInKm());
            
            Optional<HospitalBeds> bedsInfo = hospitalBedsRepository.findByHospitalIdWithAvailableBeds(hospital.getId());
            
            if (bedsInfo.isPresent()) {
                return assignHospitalToEmergency(emergency, hospital, bedsInfo.get().getAvailableBeds());
            } else {
                log.warn("❌ Hospital {} has no available beds, checking next hospital", hospital.getName());
            }
        }

        // If no hospital with beds found, assign to first hospital anyway
        log.warn("❌ No hospitals with available beds found, assigning to first hospital");
        return assignHospitalToEmergency(emergency, activeHospitals.get(0), 0);
    }
    
    private Hospital assignFirstAvailableHospital(Emergency emergency) {
        List<Hospital> activeHospitals = hospitalRepository.findByIsActiveTrue();
        if (!activeHospitals.isEmpty()) {
            return assignHospitalToEmergency(emergency, activeHospitals.get(0), 0);
        }
        return null;
    }
    
    private Hospital assignHospitalToEmergency(Emergency emergency, Hospital hospital, int availableBeds) {
        log.info("✅ Assigning hospital {} to emergency {} (Available beds: {})", 
            hospital.getName(), emergency.getId(), availableBeds);
        
        // Update emergency with assigned hospital
        emergency.setAssignedHospital(hospital);
        Emergency savedEmergency = emergencyRepository.save(emergency);
        
        log.info("✅ Emergency {} successfully assigned to hospital {} (ID: {})", 
            emergency.getId(), hospital.getName(), hospital.getId());
        
        // Verify assignment was saved
        if (savedEmergency.getAssignedHospital() != null) {
            log.info("✅ Assignment verified in database: emergency.assigned_hospital_id = {}", 
                savedEmergency.getAssignedHospital().getId());
        } else {
            log.error("❌ Assignment failed to save to database!");
        }
        
        return hospital;
    }

    private List<HospitalDistanceDTO> calculateDistancesToHospitals(Double emergencyLat, Double emergencyLng, 
                                                                   List<Hospital> hospitals) {
        List<HospitalDistanceDTO> hospitalDistances = new ArrayList<>();

        // Try Google Maps API first
        if (googleMapsApiKey != null && !googleMapsApiKey.isEmpty()) {
            try {
                hospitalDistances = calculateDistancesUsingGoogleMaps(emergencyLat, emergencyLng, hospitals);
                log.info("Successfully calculated distances using Google Maps API");
                return hospitalDistances;
            } catch (Exception e) {
                log.warn("Google Maps API failed, falling back to Haversine distance: {}", e.getMessage());
            }
        }

        // Fallback to Haversine distance
        for (Hospital hospital : hospitals) {
            HospitalDistanceDTO dto = new HospitalDistanceDTO(hospital);
            dto.setDistanceInKm(calculateHaversineDistance(emergencyLat, emergencyLng, 
                hospital.getLatitude(), hospital.getLongitude()));
            hospitalDistances.add(dto);
        }

        return hospitalDistances;
    }

    private List<HospitalDistanceDTO> calculateDistancesUsingGoogleMaps(Double emergencyLat, Double emergencyLng, 
                                                                       List<Hospital> hospitals) {
        String origins = emergencyLat + "," + emergencyLng;
        StringBuilder destinations = new StringBuilder();
        
        for (int i = 0; i < hospitals.size(); i++) {
            Hospital hospital = hospitals.get(i);
            destinations.append(hospital.getLatitude()).append(",").append(hospital.getLongitude());
            if (i < hospitals.size() - 1) {
                destinations.append("|");
            }
        }

        String url = String.format("%s?origins=%s&destinations=%s&mode=driving&key=%s",
            GOOGLE_DISTANCE_MATRIX_URL, origins, destinations.toString(), googleMapsApiKey);

        GoogleDistanceMatrixResponse response = restTemplate.getForObject(url, GoogleDistanceMatrixResponse.class);
        
        List<HospitalDistanceDTO> hospitalDistances = new ArrayList<>();
        
        if (response != null && "OK".equals(response.getStatus()) && !response.getRows().isEmpty()) {
            List<GoogleDistanceMatrixResponse.Element> elements = response.getRows().get(0).getElements();
            
            for (int i = 0; i < hospitals.size() && i < elements.size(); i++) {
                GoogleDistanceMatrixResponse.Element element = elements.get(i);
                HospitalDistanceDTO dto = new HospitalDistanceDTO(hospitals.get(i));
                
                if ("OK".equals(element.getStatus())) {
                    dto.setDistanceInKm(element.getDistance().getValue() / 1000.0); // Convert meters to km
                    dto.setDurationInMinutes(element.getDuration().getValue() / 60); // Convert seconds to minutes
                } else {
                    // Fallback to Haversine for this hospital
                    dto.setDistanceInKm(calculateHaversineDistance(emergencyLat, emergencyLng,
                        hospitals.get(i).getLatitude(), hospitals.get(i).getLongitude()));
                }
                
                hospitalDistances.add(dto);
            }
        }
        
        return hospitalDistances;
    }

    private Double calculateHaversineDistance(Double lat1, Double lng1, Double lat2, Double lng2) {
        final int R = 6371; // Earth's radius in kilometers
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lngDistance = Math.toRadians(lng2 - lng1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }

    public Hospital reassignToNextNearestHospital(Long emergencyId) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
            .orElseThrow(() -> new RuntimeException("Emergency not found"));
        
        List<Hospital> activeHospitals = hospitalRepository.findByIsActiveTrue();
        List<HospitalDistanceDTO> hospitalDistances = calculateDistancesToHospitals(
            emergency.getLatitude(), emergency.getLongitude(), activeHospitals);
        
        hospitalDistances.sort(Comparator.comparing(HospitalDistanceDTO::getDistanceInKm));
        
        // Skip currently assigned hospital and find next available
        Hospital currentHospital = emergency.getAssignedHospital();
        for (HospitalDistanceDTO hospitalDistance : hospitalDistances) {
            Hospital hospital = hospitalDistance.getHospital();
            
            if (currentHospital != null && hospital.getId().equals(currentHospital.getId())) {
                continue; // Skip current hospital
            }
            
            Optional<HospitalBeds> bedsInfo = hospitalBedsRepository.findByHospitalIdWithAvailableBeds(hospital.getId());
            if (bedsInfo.isPresent()) {
                emergency.setAssignedHospital(hospital);
                emergencyRepository.save(emergency);
                
                log.info("Reassigned emergency {} to hospital: {}", emergencyId, hospital.getName());
                return hospital;
            }
        }
        
        return null;
    }
}