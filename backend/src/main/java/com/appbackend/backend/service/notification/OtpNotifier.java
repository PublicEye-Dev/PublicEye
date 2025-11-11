package com.appbackend.backend.service.notification;

public interface OtpNotifier {
    boolean supports(String identifier);
    void sendOtp(String identifier, String otpCode);
}