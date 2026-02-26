package com.emergency.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {
	
	@NotBlank(message = "Email is required")
	@Email(message = "Please enter a valid email address")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Please enter a valid email address")
	private String email;
	
	@NotBlank(message = "Password is required")
    private String passwordHash;
}
