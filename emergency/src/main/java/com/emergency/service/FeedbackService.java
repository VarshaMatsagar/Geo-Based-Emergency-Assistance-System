package com.emergency.service;

import com.emergency.dto.FeedbackRequestDTO;
import com.emergency.entity.Feedback;
import java.util.List;


public interface FeedbackService {

    Feedback addFeedback(Long userId, FeedbackRequestDTO dto);
 
    //Citizen
    List<Feedback> getFeedbackByUser(Long userId);

    //Admin
    List<Feedback> getAllFeedback();

}
