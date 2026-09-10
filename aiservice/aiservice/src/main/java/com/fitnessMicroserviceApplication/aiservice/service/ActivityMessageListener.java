package com.fitnessMicroserviceApplication.aiservice.service;

import com.fitnessMicroserviceApplication.aiservice.model.Activity;
import com.fitnessMicroserviceApplication.aiservice.model.Recommendation;
import com.fitnessMicroserviceApplication.aiservice.repo.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.KafkaListeners;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;



    @KafkaListener(topics = "${kafka.topic.name}",groupId = "activity-consumer-group")
    public void processActivity(Activity activity){
      log.info("Recieved Activity for Processing{}",activity.getUserId());
        Recommendation recommendation = aiService.generateRecommendation(activity);
        recommendationRepository.save(recommendation);
    }
}
