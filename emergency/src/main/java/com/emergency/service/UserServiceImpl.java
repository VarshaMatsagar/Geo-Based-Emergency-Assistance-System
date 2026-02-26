package com.emergency.service;

import org.springframework.stereotype.Service;

import com.emergency.entity.User;
import com.emergency.exception.ResourceNotFoundException;
import com.emergency.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id " + userId));
    }

    @Override
    public User updateUserProfile(Long userId, User user) {

    	User existingUser = getUserById(userId);

        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhoneNumber(user.getPhoneNumber());

        return userRepository.save(existingUser);
    }
    
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
