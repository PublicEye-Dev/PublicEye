package com.appbackend.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.appbackend.backend.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phone);
    Optional<User> findByEmailOrPhoneNumber(String email, String phone);
    boolean existsByEmailIgnoreCase(@NotBlank(message = "Email-ul este obligatoriu") @Email(message = "Email invalid") String email);

    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId")
    Optional<User> findByDepartment_Id(@Param("departmentId") Long id);
    
    @Query("SELECT u FROM User u WHERE u.department.id = :departmentId")
    List<User> findAllByDepartmentId(@Param("departmentId") Long departmentId);
}
