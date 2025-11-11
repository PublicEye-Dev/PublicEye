package com.appbackend.backend.service.notification;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OtpNotificationService {

    private final List<OtpNotifier> notifiers;

    public OtpNotificationService(List<OtpNotifier> notifiers) {
        this.notifiers = notifiers;
    }

    public void dispatchOtp(String identifier, String otpCode) {
        OtpNotifier notifier = notifiers.stream()
                .filter(n -> n.supports(identifier))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Canal OTP necunoscut"));
        notifier.sendOtp(identifier, otpCode);
    }
}