export const authConfig = {
    clientId: 'fitness-application',

    authorizationEndpoint:
        'https://fitness-keycloak-0zpe.onrender.com/realms/fitness-application/protocol/openid-connect/auth',

    tokenEndpoint:
        'https://fitness-keycloak-0zpe.onrender.com/realms/fitness-application/protocol/openid-connect/token',

    redirectUri: 'https://fitness-frontend-n16o.onrender.com',

    scope: 'openid profile email offline_access',

    onRefreshTokenExpire: (event) => event.logIn(),
};