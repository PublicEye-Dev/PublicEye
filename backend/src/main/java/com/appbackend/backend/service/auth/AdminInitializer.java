package com.appbackend.backend.service.auth;

import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.fullname}")
    private String adminFullName;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByEmail(adminEmail).ifPresentOrElse(
                user -> System.out.println("Admin deja existent: " + adminEmail),
                () -> {
                    User admin = new User(adminFullName, adminEmail,
                            passwordEncoder.encode(adminPassword), Role.ADMIN);
                    userRepository.save(admin);
                    System.out.println("Admin creat: " + adminEmail);
                }
        );
    }
}
