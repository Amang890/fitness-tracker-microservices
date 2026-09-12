FROM quay.io/keycloak/keycloak:26.7.3

ENV KC_HTTP_ENABLED=true
ENV KC_PROXY_HEADERS=xforwarded

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start"]