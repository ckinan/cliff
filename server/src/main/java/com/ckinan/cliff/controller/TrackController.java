package com.ckinan.cliff.controller;

import com.ckinan.cliff.model.TrackEntity;
import com.ckinan.cliff.model.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TrackController {

    @Autowired
    TrackRepository trackRepository;

    @RequestMapping("/tracks")
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

    @RequestMapping(value = "/track", method = RequestMethod.POST)
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
