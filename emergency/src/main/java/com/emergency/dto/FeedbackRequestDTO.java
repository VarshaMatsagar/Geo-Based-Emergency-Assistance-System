package com.emergency.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class FeedbackRequestDTO {
  
	 private int rating;
	 private String comments;

}
