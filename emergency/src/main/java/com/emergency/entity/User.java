package com.emergency.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "users")
@Data
public class User extends BaseEntity {
	private String fullName;
	private String email;
	private String password;
	private String phoneNumber;
	private String address;

	@Enumerated(EnumType.STRING)
	private Role role;

	private boolean emailVerified = false;
	private String emailOtp;
	private LocalDateTime otpExpiryTime;
	private int otpAttempts = 0;
}
