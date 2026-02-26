package com.emergency.dto;

import com.emergency.entity.Hospital;
import lombok.Data;

@Data
public class HospitalDistanceDTO {
    private Hospital hospital;
    private Double distanceInKm;
    private Integer durationInMinutes;
    private Integer availableBeds;
    private Boolean hasAvailableBeds;
    
    public HospitalDistanceDTO(Hospital hospital) {
        this.hospital = hospital;
        this.hasAvailableBeds = false;
        this.availableBeds = 0;
    }
}