package com.appbackend.backend.service;

import com.appbackend.backend.entity.OtpCode;
import com.appbackend.backend.repository.OtpRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;

    public OtpService(OtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    public String generateOtp(Long userId) {
        otpRepository.deleteByUserId(userId);

        String code = String.format("%06d", new Random().nextInt(1_000_000));
        otpRepository.save(new OtpCode(userId, code, LocalDateTime.now(), LocalDateTime.now().plusMinutes(5)));
        return code;
    }

    public boolean validateOtp(Long userId, String code) {
        Optional<OtpCode> otp = otpRepository.findByUserIdAndCodeAndExpiresAtAfter(userId, code, LocalDateTime.now());
        return otp.isPresent();
    }
}

