package com.emergency.dto;

import com.emergency.entity.EmergencyStatus;

public class UpdateEmergencyStatusRequest {

    private EmergencyStatus status;
    private Long policeOfficerId;

    public EmergencyStatus getStatus() {
        return status;
    }

    public void setStatus(EmergencyStatus status) {
        this.status = status;
    }
    
    public Long getPoliceOfficerId() {
        return policeOfficerId;
    }
    
    public void setPoliceOfficerId(Long policeOfficerId) {
        this.policeOfficerId = policeOfficerId;
    }
}
