package com.fitnessMicroServiceeApplication.userService.service;


import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.ws.rs.core.Response;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;

    @Value("${KEYCLOAK_REALM}")
    private String realm;

    public String createUser(
            String firstName,
            String lastName,
            String email,
            String password) {

        UserRepresentation user = new UserRepresentation();

        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(false);

        CredentialRepresentation credential =
                new CredentialRepresentation();

        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        user.setCredentials(
                Collections.singletonList(credential)
        );

        Response response = keycloak
                .realm(realm)
                .users()
                .create(user);

        try {
            if (response.getStatus() != 201) {

                if (response.getStatus() == 409) {
                    throw new RuntimeException(
                            "User already exists in Keycloak"
                    );
                }

                throw new RuntimeException(
                        "Failed to create user in Keycloak. Status: "
                                + response.getStatus()
                );
            }

            String location = response.getHeaderString("Location");

            if (location == null || location.isBlank()) {
                throw new RuntimeException(
                        "Keycloak user created but user ID was not returned"
                );
            }

            return location.substring(
                    location.lastIndexOf("/") + 1
            );

        } finally {
            response.close();
        }
    }
}