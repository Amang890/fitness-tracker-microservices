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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    @Override
    public UserResponse registerUser(UserRequest request) {

        // Check if user already exists in MySQL
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(
                    "User already exists with email: " + request.getEmail()
            );
        }

        // Create user in Keycloak
        String keycloakId = keycloakService.createUser(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword()
        );

        // Save user profile in MySQL
        User user = new User();
        user.setKeycloakId(keycloakId);
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);

        log.info(
                "User registered successfully. userId={}, keycloakId={}",
                savedUser.getUserId(),
                savedUser.getKeycloakId()
        );

        return mapToResponse(savedUser);
    }

    @Override
    public UserResponse getUserFromUserId(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException("User Not Found")
                );

        return mapToResponse(user);
    }

    @Override
    public Boolean existByUserId(String userId) {

        log.info(
                "Calling User Validation API for userId: {}",
                userId
        );

        return userRepository.existsByKeycloakId(userId);
    }

    private UserResponse mapToResponse(User user) {

        UserResponse response = new UserResponse();

        response.setUserId(user.getUserId());
        response.setKeycloakId(user.getKeycloakId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}