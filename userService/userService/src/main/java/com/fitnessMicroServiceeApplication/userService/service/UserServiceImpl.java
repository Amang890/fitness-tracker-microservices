package com.fitnessMicroServiceeApplication.userService.service;

import com.fitnessMicroServiceeApplication.userService.dto.UserRequest;
import com.fitnessMicroServiceeApplication.userService.dto.UserResponse;
import com.fitnessMicroServiceeApplication.userService.model.User;
import com.fitnessMicroServiceeApplication.userService.repo.UserRepository;

import lombok.AllArgsConstructor;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    @Override
    public UserResponse registerUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            User existingUser = userRepository.findByEmail(request.getEmail());
            UserResponse userResponse = new UserResponse();
            userResponse.setUserId(existingUser.getUserId());
            userResponse.setKeycloakId(existingUser.getKeycloakId());
            userResponse.setPassword(existingUser.getPassword());
            userResponse.setEmail(existingUser.getEmail());
            userResponse.setFirstName(existingUser.getFirstName());
            userResponse.setLastName(existingUser.getLastName());
            userResponse.setCreatedAt(existingUser.getCreatedAt());
            userResponse.setUpdatedAt(existingUser.getUpdatedAt());
            return userResponse;
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setKeycloakId(request.getKeycloakId());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setUserId(savedUser.getUserId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());

        return userResponse;
    }

    @Override
    public UserResponse getUserFromUserId(String userId) {

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User Not Found"));

            UserResponse userResponse = new UserResponse();
            userResponse.setUserId(user.getUserId());
            userResponse.setPassword(user.getPassword());
            userResponse.setEmail(user.getEmail());
            userResponse.setFirstName(user.getFirstName());
            userResponse.setLastName(user.getLastName());
            userResponse.setCreatedAt(user.getCreatedAt());
            userResponse.setUpdatedAt(user.getUpdatedAt());

            return userResponse;
        }

    public Boolean existByUserId(String userId) {
        log.info("Calling User Validation API for userId: {}", userId);
        return userRepository.existsByKeycloakId(userId);
    }
}
