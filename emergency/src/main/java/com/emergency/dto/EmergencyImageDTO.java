// EmergencyImageDTO.java
package com.emergency.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyImageDTO {
    private Long citizenId;
    @NotBlank
    private String description;
    private MultipartFile image;
    private String targetDepartment = "BOTH";
    private Double latitude;
    private Double longitude;
    private String address;
}
