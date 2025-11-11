package com.appbackend.backend.repository;

import com.appbackend.backend.entity.OtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpCode, Long> {
    Optional<OtpCode> findByUserIdAndCodeAndExpiresAtAfter(Long userId, String code, LocalDateTime now);
    void deleteByUserId(Long userId);
}

