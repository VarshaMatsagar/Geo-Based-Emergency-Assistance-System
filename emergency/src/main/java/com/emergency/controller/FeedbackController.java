package com.emergency.controller;

import com.emergency.dto.FeedbackRequestDTO;
import com.emergency.entity.Feedback;
import com.emergency.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(
            @RequestBody FeedbackRequestDTO dto,
            Authentication authentication) {

        Long userId = (Long) authentication.getPrincipal(); 

        return ResponseEntity.ok(feedbackService.addFeedback(userId, dto));
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getFeedback(Authentication authentication) {

    	Long userId = Long.parseLong(authentication.getPrincipal().toString());

//        Long userId = (Long) authentication.getPrincipal();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        if (isAdmin) {
            return ResponseEntity.ok(feedbackService.getAllFeedback());
        } else {
            return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
        }
    }
}
