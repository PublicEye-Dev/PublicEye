package com.appbackend.backend.repository;

import com.appbackend.backend.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phone);
    Optional<User> findByEmailOrPhoneNumber(String email, String phone);
    boolean existsByEmailIgnoreCase(@NotBlank(message = "Email-ul este obligatoriu") @Email(message = "Email invalid") String email);
}
