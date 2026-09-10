package com.fitnessMicroServiceeApplication.userService.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
@Data
public class User {
@Id
@GeneratedValue(strategy  =GenerationType.UUID)
    private String userId;
private String keycloakId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private UserRole role= UserRole.USER;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
