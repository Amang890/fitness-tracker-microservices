package com.fitnessMicroserviceApplication.activityService.dto;

import com.fitnessMicroserviceApplication.activityService.model.ActivityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityRequest {

    private String userId;

    @NotNull(message = "Activity type is required")
    private ActivityType type;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be greater than 0")
    private Integer duration;

    @NotNull(message = "Calories burned is required")
    @Min(value = 0, message = "Calories burned cannot be negative")
    private Integer caloriesBurned;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    private Map<String, Object> additionalMetrics;
}