FROM java:8-jdk-alpine
LABEL maintainer="Bektur Mambetov"
WORKDIR /usr/app
COPY ./target/*.jar /usr/app/cloud.jar
COPY ./src/main/resources/application-docker.properties /usr/app/application.properties
CMD ["/bin/sh", "-c", "java -jar /usr/app/cloud.jar -Djava.security.egd=file:/dev/./urandom -Dspring.config.location = /usr/app/application.properties"]

