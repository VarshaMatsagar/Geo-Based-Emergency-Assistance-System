package com.emergency.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.emergency.entity.Emergency;

import com.emergency.entity.EmergencyStatus;

public interface EmergencyRepository extends JpaRepository<Emergency, Long> {
	List<Emergency> findByUserId(Long userId);

	List<Emergency> findByStatus(EmergencyStatus status);
	
	List<Emergency> findByStatusNot(EmergencyStatus status);
	
	@Query("SELECT e FROM Emergency e LEFT JOIN FETCH e.user LEFT JOIN FETCH e.assignedHospital WHERE e.targetDepartment IN :targetDepartments ORDER BY e.createdOn DESC")
	List<Emergency> findByTargetDepartmentInOrderByCreatedOnDesc(@Param("targetDepartments") List<String> targetDepartments);
	
	// Hospital assignment queries
	List<Emergency> findByAssignedHospitalIdAndStatusNot(Long hospitalId, EmergencyStatus status);
	
	List<Emergency> findByAssignedHospitalIdOrderByCreatedOnDesc(Long hospitalId);
	
	// Custom query to ensure user and hospital data is loaded
	@Query("SELECT e FROM Emergency e LEFT JOIN FETCH e.user LEFT JOIN FETCH e.assignedHospital WHERE e.id = :emergencyId")
	Optional<Emergency> findByIdWithUser(@Param("emergencyId") Long emergencyId);
}
