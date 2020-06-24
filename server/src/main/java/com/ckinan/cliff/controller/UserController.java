package com.ckinan.cliff.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @RequestMapping("/me")
    public Map<String,Object> me() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        Map<String,Object> model = new HashMap<>();
        model.put("username", authentication.getName());
        model.put("isAuthenticated", true);
        return model;
    }

}
