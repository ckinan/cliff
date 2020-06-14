package com.ckinan.cliff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class Controller {

    @Autowired
    TrackRepository trackRepository;

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

    @RequestMapping("/api/tracks")
    public Map<String,Object> tracks() {
        List<TrackEntity> tracks = (List<TrackEntity>) trackRepository.findAll();
        Map<String,Object> model = new HashMap<>();
        model.put("tracks", tracks);
        return model;
    }

    @RequestMapping(value = "/api/track", method = RequestMethod.POST)
    public Map<String,Object> trackPut(@RequestBody Map<String, Object> payload) {
        TrackEntity track = new TrackEntity();
        track.setCounter(Double.parseDouble(payload.get("counter").toString()));
        track.setCreatedAt(new Date());
        track = trackRepository.save(track);
        Map<String,Object> model = new HashMap<>();
        model.put("newTrack", track);
        return model;
    }

}
