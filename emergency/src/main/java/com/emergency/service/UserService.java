package com.emergency.service;

import com.emergency.entity.User;

public interface UserService {

    User getUserById(Long userId);

    User updateUserProfile(Long userId, User user);
    
    User findByEmail(String email);

}
