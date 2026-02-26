package com.emergency.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminUserResponse {
    private Long userId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private RoleDetails role;

    @Data
    @AllArgsConstructor
    public static class RoleDetails {
        private String roleName;
    }
}

