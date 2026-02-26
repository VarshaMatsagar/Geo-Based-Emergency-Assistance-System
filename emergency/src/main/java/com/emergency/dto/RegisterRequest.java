package com.emergency.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
	
	@NotBlank(message = "Full name is required")
	@Pattern(regexp = "^[A-Za-z\\s]{3,}$", message = "Full name must contain only letters and spaces (minimum 3 characters)")
	private String fullName;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Please enter a valid email address")
	@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", message = "Please enter a valid email address")
	private String email;
	
	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be 10 digits starting with 6, 7, 8, or 9")
	private String phoneNumber;
	
	@NotBlank(message = "Password is required")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", 
	         message = "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character")
    private String password;

}
