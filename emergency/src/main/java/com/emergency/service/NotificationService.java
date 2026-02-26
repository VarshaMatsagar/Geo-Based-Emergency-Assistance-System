package com.emergency.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.emergency.entity.Emergency;
import com.emergency.entity.EmergencyStatus;
import com.emergency.entity.Notification;
import com.emergency.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    public void createStatusChangeNotification(Emergency emergency, EmergencyStatus newStatus, String updatedByRole) {
        try {
            if (emergency.getUser() == null) {
                log.warn("Cannot create notification - emergency {} has no associated user", emergency.getId());
                return;
            }
            
            Notification notification = new Notification();
            notification.setUser(emergency.getUser());
            notification.setEmergency(emergency);
            notification.setEmergencyStatus(newStatus);
            notification.setUpdatedByRole(updatedByRole);
            notification.setMessage(generateStatusMessage(newStatus, updatedByRole));
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
            log.info("📢 Notification created for user {} - Emergency {} status changed to {} by {}", 
                emergency.getUser().getId(), emergency.getId(), newStatus, updatedByRole);
                
        } catch (Exception e) {
            log.error("Failed to create notification for emergency {}: {}", emergency.getId(), e.getMessage());
        }
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedOnDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findUnreadByUserId(userId);
    }
    
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }
    
    private String generateStatusMessage(EmergencyStatus status, String updatedByRole) {
        String department = "POLICE".equals(updatedByRole) ? "Police" : "Hospital";
        
        switch (status) {
            case ACCEPTED:
                return department + " have accepted your emergency request and are responding";
            case IN_PROGRESS:
                return department + " are currently handling your emergency";
            case RESOLVED:
                return "Your emergency has been resolved by " + department;
            case REJECTED:
                return department + " could not respond to your emergency at this time";
            default:
                return "Your emergency status has been updated to " + status + " by " + department;
        }
    }
}