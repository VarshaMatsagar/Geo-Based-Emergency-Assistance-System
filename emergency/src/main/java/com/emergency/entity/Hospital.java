package com.emergency.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "hospital")
@Data
public class Hospital extends BaseEntity {
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    private String address;
    private String contactNumber;
}