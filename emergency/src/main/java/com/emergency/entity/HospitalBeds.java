package com.emergency.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "hospital_beds")
@Data
public class HospitalBeds extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;
    
    @Column(name = "total_beds", nullable = false)
    private Integer totalBeds;
    
    @Column(name = "available_beds", nullable = false)
    private Integer availableBeds;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();
}