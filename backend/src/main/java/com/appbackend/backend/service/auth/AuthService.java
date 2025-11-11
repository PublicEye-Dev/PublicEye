package com.appbackend.backend.service.auth;

import com.appbackend.backend.dto.*;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.repository.UserRepository;
import com.appbackend.backend.security.JwtService;
import com.appbackend.backend.service.notification.OtpNotificationService;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.EnumSet;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final OtpNotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       OtpService otpService,
                       OtpNotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.notificationService = notificationService;
    }

    @Transactional
    public void requestUserOtp(OtpRequest request) {
        User user = userRepository.findByEmailOrPhoneNumber(request.identifier(), request.identifier())
                .orElseGet(() -> createUserForOtp(request.identifier()));

        String otp = otpService.generateOtp(user.getId());
        String identifier = user.getEmail() != null ? user.getEmail() : user.getPhoneNumber();
        notificationService.dispatchOtp(identifier, otp);
    }

    @Transactional
    public AuthResponse verifyUserOtp(OtpVerifyRequest request) {
        User user = userRepository.findByEmailOrPhoneNumber(request.identifier(), request.identifier())
                .orElseThrow(() -> new IllegalArgumentException("Utilizatorul nu există"));

        if (!otpService.validateOtp(user.getId(), request.otp())) {
            throw new IllegalArgumentException("Cod OTP invalid sau expirat");
        }

        return new AuthResponse(jwtService.generateToken(user), user.getRole());
    }

    @Transactional
    public AuthResponse administrationLogin(AdministrationLoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Utilizatorul nu există"));

        if(EnumSet.of(Role.ADMIN, Role.OPERATOR).contains(user.getRole())) {
            validatePasswordLogin(user, user.getRole(), request.password());
            return new AuthResponse(jwtService.generateToken(user), user.getRole());
        }
        else throw new IllegalArgumentException("Credentiale invalide");
    }


    private void validatePasswordLogin(User user, Role requiredRole, String rawPassword) {

        if (user.getRole() != requiredRole) {
            throw new IllegalArgumentException("Rol invalid pentru acest tip de autentificare");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Credențiale invalide");
        }
    }

    private User createUserForOtp(String identifier) {
        User user = new User();
        if (identifier.contains("@")) {
            user.setEmail(identifier);
        } else {
            user.setPhoneNumber(identifier);
        }
        user.setRole(Role.USER);
        return userRepository.save(user);
    }
}