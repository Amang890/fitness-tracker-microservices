package com.fitnessMicroserviceApplication.activityService.controller;

import com.fitnessMicroserviceApplication.activityService.dto.ActivityRequest;
import com.fitnessMicroserviceApplication.activityService.dto.ActivityResponse;
import com.fitnessMicroserviceApplication.activityService.service.ActivityServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@AllArgsConstructor
public class ActivityController {

    private ActivityServiceImpl activityService;

    @PostMapping("/trackActivity")
    public ResponseEntity<ActivityResponse> trackActivity(
            @Valid @RequestBody ActivityRequest request,
            @RequestHeader("X-User-ID") String userId) {

        request.setUserId(userId);
        

        return ResponseEntity.ok(
                activityService.trackActivity(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivities(
            @RequestHeader("X-User-ID") String userId) {

        return ResponseEntity.ok(
                activityService.getUserActivities(userId)
        );
    }
}