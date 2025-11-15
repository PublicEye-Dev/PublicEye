package com.appbackend.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;

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

    Optional<User> findByDepartment_IdAndRole(Long departmentId, Role role);

    @Query("""
            SELECT u FROM User u
            WHERE (:name IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:name AS string), '%')))
              AND (:role IS NULL OR u.role = :role)
              AND (:excludeAdmin = false OR u.role <> com.appbackend.backend.enums.Role.ADMIN)
            """)
    Page<User> searchUsers(
            @Param("name") String name,
            @Param("role") Role role,
            @Param("excludeAdmin") boolean excludeAdmin,
            Pageable pageable);

    @Query("""
            SELECT u FROM User u
            LEFT JOIN u.department d
            WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR (d IS NOT NULL AND LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
               OR LOWER(CONCAT('', u.role, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<User> searchUsersByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
