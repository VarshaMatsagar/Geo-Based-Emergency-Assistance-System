package com.emergency.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
}
