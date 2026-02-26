package com.emergency.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileDTO {
    private Long userId;
    private String fullName;
    private String phoneNumber;
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String newPassword;

	


}
