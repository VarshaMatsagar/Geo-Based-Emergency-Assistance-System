package com.emergency.dto;

import lombok.Data;

@Data
public class RoleUpdateRequest {
    private String roleId; // Example: "CITIZEN" / "POLICE" / "HOSPITAL" / "ADMIN"
}
