package com.fitnessMicroServiceeApplication.userService.service;

import com.fitnessMicroServiceeApplication.userService.dto.UserRequest;
import com.fitnessMicroServiceeApplication.userService.dto.UserResponse;

public interface UserService {

    UserResponse registerUser(UserRequest request);
    UserResponse  getUserFromUserId(String userId);
    public Boolean existByUserId(String userId);
}
