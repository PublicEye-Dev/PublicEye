package com.appbackend.backend.service.notification;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Component;

@Component
public class EmailOtpNotifier implements OtpNotifier {

    private final JavaMailSender mailSender;

    public EmailOtpNotifier(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public boolean supports(String identifier) {
        return identifier.contains("@");
    }

    @Override
    public void sendOtp(String identifier, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(identifier);
        message.setSubject("Cod OTP");
        message.setText("Codul tău este: " + otpCode + ". Valabil 5 minute.");
        mailSender.send(message);
    }
}