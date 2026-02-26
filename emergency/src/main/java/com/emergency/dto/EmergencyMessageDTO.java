package com.emergency.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyMessageDTO {
    private Long citizenId;
    @NotBlank
    private String description;
    private String targetDepartment = "BOTH";
    private Double latitude;
    private Double longitude;
    private String address;
}
