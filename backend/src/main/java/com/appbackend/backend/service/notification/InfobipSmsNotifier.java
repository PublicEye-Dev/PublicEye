package com.appbackend.backend.service.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class InfobipSmsNotifier implements OtpNotifier {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String apiKey;
    private final String sender;

    public InfobipSmsNotifier(
            RestTemplateBuilder builder,
            @Value("${infobip.api.base-url}") String baseUrl,
            @Value("${infobip.api.key}") String apiKey,
            @Value("${infobip.sms.sender}") String sender) {
        this.restTemplate = builder
                .defaultHeader(HttpHeaders.AUTHORIZATION, apiKey)
                .build();
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.sender = sender;
    }

    @Override
    public boolean supports(String identifier) {
        return identifier.matches("\\+?\\d{9,15}");
    }

    @Override
    public void sendOtp(String identifier, String otpCode) {
        Map<String, Object> payload = Map.of(
                "messages", List.of(Map.of(
                        "from", sender,
                        "destinations", List.of(Map.of("to", identifier)),
                        "text", "Cod OTP: " + otpCode + ". Valabil 5 minute."
                ))
        );

        restTemplate.postForEntity(
                baseUrl + "/sms/2/text/advanced",
                new HttpEntity<>(payload),
                Void.class
        );
    }
}