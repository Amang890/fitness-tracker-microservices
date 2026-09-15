package com.fitnessMicroserviceApplication.apigateway;

import com.fitnessMicroserviceApplication.apigateway.user.RegisterRequest;
import com.fitnessMicroserviceApplication.apigateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            WebFilterChain chain) {

        String path = exchange.getRequest()
                .getPath()
                .value();

        // Registration is handled by User Service directly.
        // No JWT / user sync required for registration.
        if ("/api/users/register".equals(path)) {
            log.info("Registration request detected. Skipping KeycloakUserSyncFilter.");
            return chain.filter(exchange);
        }

        String token = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        String userId = exchange.getRequest()
                .getHeaders()
                .getFirst("X-User-ID");

        // No token -> nothing to sync
        if (token == null || token.isBlank()) {
            return chain.filter(exchange);
        }

        RegisterRequest registerRequest = getUserDetails(token);

        // Invalid token / unable to extract user details
        if (registerRequest == null) {
            log.warn("Unable to extract user details from JWT. Skipping user sync.");
            return chain.filter(exchange);
        }

        // If X-User-ID is not already present,
        // use Keycloak subject as user ID.
        if (userId == null || userId.isBlank()) {
            userId = registerRequest.getKeycloakId();
        }

        if (userId == null || userId.isBlank()) {
            log.warn("User ID is missing. Skipping user sync.");
            return chain.filter(exchange);
        }

        String finalUserId = userId;

        return userService.validateUser(userId)
                .flatMap(exist -> {

                    if (!exist) {

                        log.info(
                                "User does not exist in User Service. Registering user: {}",
                                finalUserId
                        );

                        return userService
                                .registerUser(registerRequest)
                                .then(Mono.empty());

                    } else {

                        log.info(
                                "User already exists, skipping sync: {}",
                                finalUserId
                        );

                        return Mono.empty();
                    }
                })
                .then(Mono.defer(() -> {

                    ServerHttpRequest mutatedRequest =
                            exchange.getRequest()
                                    .mutate()
                                    .header("X-User-ID", finalUserId)
                                    .build();

                    return chain.filter(
                            exchange.mutate()
                                    .request(mutatedRequest)
                                    .build()
                    );
                }));
    }

    private RegisterRequest getUserDetails(String token) {

        try {

            if (token == null || token.isBlank()) {
                return null;
            }

            String tokenWithoutBearer =
                    token.replaceFirst("(?i)^Bearer\\s+", "").trim();

            if (tokenWithoutBearer.isBlank()) {
                return null;
            }

            SignedJWT signedJWT =
                    SignedJWT.parse(tokenWithoutBearer);

            JWTClaimsSet claims =
                    signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest =
                    new RegisterRequest();

            registerRequest.setEmail(
                    claims.getStringClaim("email")
            );

            registerRequest.setKeycloakId(
                    claims.getStringClaim("sub")
            );

            registerRequest.setPassword(
                    "dummy@123123"
            );

            registerRequest.setFirstName(
                    claims.getStringClaim("given_name")
            );

            registerRequest.setLastName(
                    claims.getStringClaim("family_name")
            );

            return registerRequest;

        } catch (Exception e) {

            log.error(
                    "Failed to extract user details from JWT",
                    e
            );

            return null;
        }
    }
}