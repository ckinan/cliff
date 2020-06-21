# spring-security

## Basic authentication + Users in memory

Run
```bash
./mvnw spring-boot:run
```

Open in a browser http://localhost:8080/resource

Login form:
- user/pass
- admin/pass

Refs
- https://docs.spring.io/spring-security/site/docs/current/reference/html5/#servlet-authentication-authenticationprovider
- https://www.baeldung.com/spring-security-authentication-provider
- https://www.baeldung.com/spring-security-multiple-auth-providers
- https://www.javadevjournal.com/spring-boot/spring-boot-oauth2/
- https://www.logicbig.com/tutorials/spring-framework/spring-security/custom-authentication-provider.html
- https://www.marcobehler.com/guides/spring-security
- https://www.logicbig.com/tutorials/spring-framework/spring-security/user-details-service.html
- https://medium.com/@hantsy/protect-rest-apis-with-spring-security-and-jwt-5fbc90305cc5
- https://www.youtube.com/watch?v=WbnuwpSBXPs
- https://www.youtube.com/watch?v=8rnOsF3RVQc
- https://spring.io/guides/topicals/spring-security-architecture/
- Custom UsernamePasswordAuthenticationFilter (1): https://leaks.wanari.com/2017/11/28/how-to-make-custom-usernamepasswordauthenticationfilter-with-spring-security
- Custom UsernamePasswordAuthenticationFilter (2): https://www.baeldung.com/spring-security-extra-login-fields
- https://www.baeldung.com/spring-security-authentication-with-a-database
- http://whitfin.io/speeding-up-maven-docker-builds/

# Notes

## Optimize build process docker maven

**Before**

```
./Dockerfile
FROM openjdk:14-jdk-alpine
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]

--- Build log ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  05:04 min
[INFO] Finished at: 2020-06-21T14:36:14Z
[INFO] ------------------------------------------------------------------------
```

**After**

```
./Dockerfile
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

--- Build log ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  28.324 s
[INFO] Finished at: 2020-06-21T14:40:49Z
[INFO] ------------------------------------------------------------------------
```

## TODOs:

- (done) Add Spring Data JPA to the project
- (done) Load users from database
- (done) Bcrypt password
- (done) Dockerize the project
- Mimic endpoints from python project
- Connect frontend
- Docker prod
- Remote debug
- Sunset python backend
