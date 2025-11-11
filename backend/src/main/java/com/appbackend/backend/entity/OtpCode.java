package com.appbackend.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "otp_codes")
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String code;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    public OtpCode() {}

    public OtpCode(Long userId, String code, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.userId = userId;
        this.code = code;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

}
