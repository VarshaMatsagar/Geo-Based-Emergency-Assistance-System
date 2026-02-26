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
@Table(name = "notifications")
@Data
public class Notification extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Citizen who will receive notification
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emergency_id")
    private Emergency emergency;
    
    @Column(nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "emergency_status")
    private EmergencyStatus emergencyStatus;
    
    @Column(name = "updated_by_role")
    private String updatedByRole; // POLICE or HOSPITAL
    
    @Column(name = "is_read")
    private Boolean isRead = false;
}