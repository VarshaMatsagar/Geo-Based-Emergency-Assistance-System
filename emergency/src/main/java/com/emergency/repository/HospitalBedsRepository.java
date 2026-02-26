package com.emergency.repository;

import com.emergency.entity.HospitalBeds;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface HospitalBedsRepository extends JpaRepository<HospitalBeds, Long> {
    
    Optional<HospitalBeds> findByHospitalId(Long hospitalId);
    
    @Query("SELECT hb FROM HospitalBeds hb WHERE hb.hospital.id = :hospitalId AND hb.availableBeds > 0")
    Optional<HospitalBeds> findByHospitalIdWithAvailableBeds(@Param("hospitalId") Long hospitalId);
}