package com.emergency.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;


@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "emergencies")
@Data
public class Emergency extends BaseEntity {

    @Column(nullable = false)
    private String description;

    @Column(name = "emergency_type", nullable = false)
    private String emergencyType;

    private String imageUrl;
    private String location;
    
    // Geolocation fields
    private Double latitude;
    private Double longitude;
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EmergencyStatus status = EmergencyStatus.PENDING;
    
    @Column(name = "target_department")
    private String targetDepartment; // POLICE, HOSPITAL, BOTH

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_police_id")
    private User assignedPolice;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_hospital_id")
    private Hospital assignedHospital;
}