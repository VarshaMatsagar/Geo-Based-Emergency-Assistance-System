package com.emergency.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.emergency.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdOn DESC")
    List<Notification> findByUserIdOrderByCreatedOnDesc(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdOn DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);
}