package com.fitnessMicroserviceApplication.aiservice.service;

import com.fitnessMicroserviceApplication.aiservice.model.Recommendation;

import java.util.List;

public interface RecommendationService {
    public List<Recommendation> getUserRecommendation(String userId);

    public Recommendation getActivityRecommendation(String activityId);
}
