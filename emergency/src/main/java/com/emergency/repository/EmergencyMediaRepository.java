package com.emergency.repository;

import java.util.List;

import com.emergency.entity.EmergencyMediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyMediaRepository extends JpaRepository<EmergencyMediaEntity, Long> {
    List<EmergencyMediaEntity> findByEmergencyId(Long emergencyId);
}
