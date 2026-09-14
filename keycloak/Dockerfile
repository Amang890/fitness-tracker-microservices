FROM quay.io/keycloak/keycloak:26.7.3

ENV KC_DB=mysql
ENV KC_HOSTNAME_STRICT=false
ENV KC_PROXY_HEADERS=xforwarded
ENV KC_HTTP_ENABLED=true
ENV KC_HTTP_HOST=0.0.0.0
ENV KC_HTTP_PORT=10000
ENV JAVA_OPTS_KC_HEAP="-XX:InitialRAMPercentage=20 -XX:MaxRAMPercentage=45"

RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start", "--optimized"]