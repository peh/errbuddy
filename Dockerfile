FROM openjdk:8

ENV ERRBUDDY_VERSION=1.0.0
ENV ERRBUDDY_HOME=/opt/errbuddy

RUN mkdir -p "$ERRBUDDY_HOME"

COPY default-config.groovy "$ERRBUDDY_HOME/errbuddy.groovy"
COPY build/libs/errbuddy-$ERRBUDDY_VERSION.war "$ERRBUDDY_HOME/errbuddy.war"
COPY start.sh "$ERRBUDDY_HOME/start.sh"

RUN chmod +x "$ERRBUDDY_HOME/start.sh"

EXPOSE 9000
USER root
CMD ["/opt/errbuddy/start.sh"]
