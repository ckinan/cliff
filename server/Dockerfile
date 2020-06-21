# Download and cache maven dependencies
FROM maven:3.6.3-openjdk-14 AS build
WORKDIR /opt/app
COPY pom.xml .
RUN mvn dependency:go-offline

# Package the server.jar
COPY src /opt/app/src
RUN mvn -f /opt/app/pom.xml package -DskipTests

# Set the actual server
FROM openjdk:14-jdk-alpine
COPY --from=build /opt/app/target/server-*.jar /opt/app/server.jar
ENTRYPOINT ["java","-jar","/opt/app/server.jar"]