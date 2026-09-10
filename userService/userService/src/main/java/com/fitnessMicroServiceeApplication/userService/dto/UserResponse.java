package com.fitnessMicroServiceeApplication.userService.dto;

import com.fitnessMicroServiceeApplication.userService.model.UserRole;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Data
public class UserResponse {
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String keycloakId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
