package com.ckinan.cliff;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class Controller {

    @RequestMapping("/resource")
    public Map<String,Object> resource() {
        Map<String,Object> model = new HashMap<>();
        model.put("id", UUID.randomUUID().toString());
        model.put("content", "Hello World, I'm a protected resource");
        return model;
    }

    @RequestMapping("/me")
    public Map<String,Object> me() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        Map<String,Object> model = new HashMap<>();
        model.put("username", authentication.getName());
        model.put("principal", authentication.getPrincipal());
        model.put("authorities", authentication.getAuthorities());
        return model;
    }

}
