package com.ckinan.cliff;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        response.addHeader("content-type", "application/json");
        response.setStatus(HttpStatus.OK.value());
        Map<String, Object> data = new HashMap<>();
        data.put("isAuthenticated", true);
        data.put("username", authentication.getName());

        response.getOutputStream().println(objectMapper.writeValueAsString(data));
    }
}
