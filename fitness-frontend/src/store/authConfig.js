export const authConfig = {
    clientId: 'fitness-application',

    authorizationEndpoint:
        'http://localhost:8080/realms/fitness-application/protocol/openid-connect/auth',

    tokenEndpoint:
        'http://localhost:8080/realms/fitness-application/protocol/openid-connect/token',

    redirectUri: 'http://localhost:5173',

    scope: 'openid profile email offline_access',

    onRefreshTokenExpire: (event) => event.logIn(),
};