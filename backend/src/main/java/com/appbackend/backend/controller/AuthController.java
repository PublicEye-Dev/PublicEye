package com.appbackend.backend.controller;

import com.appbackend.backend.dto.*;
import com.appbackend.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/administration/login")
    public ResponseEntity<AuthResponse> loginAdministration(@Valid @RequestBody AdministrationLoginRequest request) {
        return ResponseEntity.ok(authService.administrationLogin(request));
    }

    @PostMapping("/user/request-otp")
    public ResponseEntity<Void> requestOtp(@Valid @RequestBody OtpRequest request) {
        authService.requestUserOtp(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyUserOtp(request));
    }
}