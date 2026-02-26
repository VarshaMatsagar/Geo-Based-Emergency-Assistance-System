package com.emergency.dto;

import lombok.Data;

@Data
public class AdminUserRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
    private Long roleId;
    private String passwordHash;
}

