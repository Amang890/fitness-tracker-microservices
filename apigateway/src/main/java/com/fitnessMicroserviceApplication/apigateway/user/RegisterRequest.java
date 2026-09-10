package com.fitnessMicroserviceApplication.apigateway.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    @NotBlank(message = "Email should not be blank")
    @Email(message = "email should be valid format")
    private String email;
    private String keycloakId;
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must have atleast 6 characters")
    private String password;

}
