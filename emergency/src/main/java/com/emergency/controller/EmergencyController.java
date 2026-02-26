package com.emergency.controller;

import com.emergency.dto.UpdateEmergencyStatusRequest;
import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyMediaEntity;
import com.emergency.service.EmergencyService;
import com.emergency.repository.EmergencyMediaRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyService emergencyService;
    private final EmergencyMediaRepository emergencyMediaRepository;

    public EmergencyController(EmergencyService emergencyService, EmergencyMediaRepository emergencyMediaRepository) {
        this.emergencyService = emergencyService;
        this.emergencyMediaRepository = emergencyMediaRepository;
    }

    // 🚓 / 🏥 View all active emergencies
    @GetMapping("/all")
    public List<Emergency> getAllEmergencies() {
        return emergencyService.getAllActiveEmergencies();
    }

    // 🚓 / 🏥 View emergency by ID
    @GetMapping("/{id}")
    public Emergency getEmergencyById(@PathVariable Long id) {
        return emergencyService.getEmergencyById(id);
    }

    // 📸 Get emergency image
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getEmergencyImage(@PathVariable Long id) {
        List<EmergencyMediaEntity> mediaList = emergencyMediaRepository.findByEmergencyId(id);
        
        if (mediaList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        EmergencyMediaEntity media = mediaList.get(0); // Get first image
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(media.getMediaType()));
        headers.setContentLength(media.getMediaData().length);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(media.getMediaData());
    }

    // 🔄 Update emergency status
    @PutMapping("/status/{id}")
    public Emergency updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateEmergencyStatusRequest request) {

        return emergencyService.updateEmergencyStatus(id, request.getStatus());
    }
}
