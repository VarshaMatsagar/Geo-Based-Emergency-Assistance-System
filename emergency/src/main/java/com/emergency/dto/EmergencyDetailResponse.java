package com.emergency.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.User;

import lombok.Data;

@Data
public class EmergencyDetailResponse {
    private Long id;
    private String description;
    private String emergencyType;
    private String location;
    private EmergencyStatus status;
    private LocalDateTime createdOn;
    private User user;
    private List<EmergencyMediaResponse> media;
}