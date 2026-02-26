package com.emergency.repository;

import com.emergency.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByIsActiveTrue();
}