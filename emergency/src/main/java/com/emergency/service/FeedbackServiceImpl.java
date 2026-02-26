package com.emergency.service;

import com.emergency.dto.FeedbackRequestDTO;
import com.emergency.entity.Feedback;
import com.emergency.repository.FeedbackRepository;

import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.Setter;

import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @Override
    public Feedback addFeedback(Long userId, FeedbackRequestDTO dto) {

        Feedback feedback = new Feedback();
        feedback.setUserId(userId);
        feedback.setRating(dto.getRating());
        feedback.setComments(dto.getComments());

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }
    
    @Override
    @Nullable
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
