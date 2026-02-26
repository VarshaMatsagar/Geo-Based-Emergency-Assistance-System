package com.emergency.service;

import java.util.List;

import com.emergency.dto.ApiResponse;
import com.emergency.dto.EmergencyImageDTO;
import com.emergency.dto.EmergencyMessageDTO;
import com.emergency.dto.RegisterRequest;
import com.emergency.dto.UpdateProfileDTO;
import com.emergency.entity.Emergency;
import com.emergency.entity.User;


public interface CitizenService {
	ApiResponse<String> registerCitizen(RegisterRequest request);
	
	List<User> getAllCitizens();

	User getProfile(Long citizenId);

	ApiResponse<String> updateProfile(Long citizenId, UpdateProfileDTO dto);

	Emergency createEmergencyMessage(EmergencyMessageDTO dto);

	ApiResponse<String> createEmergencyImage(EmergencyImageDTO dto);

	Emergency createEmergencyAlert(Long citizenId);
	
	Emergency createEmergencyAlert(Long citizenId, String targetDepartment);
	
	Emergency createEmergencyAlert(Long citizenId, String targetDepartment, Double latitude, Double longitude, String address);

	Emergency getEmergency(Long id);
}
