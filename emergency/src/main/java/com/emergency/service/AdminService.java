package com.emergency.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.emergency.dto.RoleUpdateRequest;
import com.emergency.dto.UserResponse;
import com.emergency.dto.UserUpdateRequest;
import com.emergency.entity.Role;
import com.emergency.entity.User;
import com.emergency.repository.UserRepository;

@Service
public class AdminService {

	@Autowired
	private UserRepository userRepo;

	public List<UserResponse> getAllUsers() {
		return userRepo.findAll().stream()
				.map(u -> new UserResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhoneNumber(), u.getRole()))
				.collect(Collectors.toList());
	}

	public UserResponse updateUser(Long id, UserUpdateRequest req) {

		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

		user.setFullName(req.getFullName());
		user.setEmail(req.getEmail());
		user.setPhoneNumber(req.getPhoneNumber());

		User updated = userRepo.save(user);

		return new UserResponse(updated.getId(), updated.getFullName(), updated.getEmail(), updated.getPhoneNumber(),
				updated.getRole());
	}

//	public UserResponse updateUserRole(Long id, RoleUpdateRequest req) {
//
//		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
//
//		Role newRole;
//		try {
//			newRole = Role.valueOf(req.getRoleId().toUpperCase()); // convert string to enum safely
//		} catch (IllegalArgumentException e) {
//			throw new RuntimeException("Invalid role: " + req.getRoleId());
//		}
//
//		user.setRole(newRole);
//
//		User updated = userRepo.save(user);
//
//		return new UserResponse(updated.getId(), updated.getFullName(), updated.getEmail(), updated.getPhoneNumber(),
//				updated.getRole());
//	}

    public UserResponse updateUserRole(Long id, RoleUpdateRequest req) {

        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        Role newRole = Role.valueOf(req.getRoleId().toUpperCase());
        user.setRole(newRole);

        User updated = userRepo.save(user);

        return new UserResponse(updated.getId(), updated.getFullName(), updated.getEmail(), updated.getPhoneNumber(), updated.getRole());
    }

	public String deleteUser(Long id) {

		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

		userRepo.delete(user);
		return "User deleted successfully with ID: " + id;
	}
}
