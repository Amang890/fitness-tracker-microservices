package com.fitnessMicroserviceApplication.activityService.service;

import com.fitnessMicroserviceApplication.activityService.dto.ActivityRequest;
import com.fitnessMicroserviceApplication.activityService.dto.ActivityResponse;

public interface ActivityService{
    public ActivityResponse trackActivity(ActivityRequest request);
}
