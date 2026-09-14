package com.fitnessMicroServiceeApplication.userService.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String keycloakId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}