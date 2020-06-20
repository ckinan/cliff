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

    @RequestMapping("/api/me")
    public Map<String,Object> me() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        Map<String,Object> model = new HashMap<>();
        model.put("username", authentication.getName());
        model.put("isAuthenticated", true);
        return model;
    }

    @RequestMapping("/api/tracks")
    public Map<String,Object> tracks(@RequestParam String startDate, @RequestParam String endDate) {
        List<Map<String, Object>> tracks =
                trackRepository.findTracksByCreatedAtDateRange(
                        startDate,
                        endDate);
        Map<String,Object> model = new HashMap<>();
        model.put("tracks", tracks);
        model.put("startDate", startDate);
        model.put("endDate", endDate);
        return model;
    }

    @RequestMapping(value = "/api/track", method = RequestMethod.POST)
    public Map<String,Object> trackPut(@RequestBody Map<String, Object> payload) {
        TrackEntity track = new TrackEntity();
        track.setCounter(Double.parseDouble(payload.get("counter").toString()));
        track.setCreatedAt(new Date());
        trackRepository.save(track);
        Map<String,Object> model = new HashMap<>();
        model.put("status", "OK");
        return model;
    }

}
