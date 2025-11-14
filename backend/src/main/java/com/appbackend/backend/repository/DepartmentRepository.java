package com.appbackend.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.appbackend.backend.entity.Department;

import jakarta.validation.constraints.NotBlank;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByNameIgnoreCase(@NotBlank(message = "Numele departamentului este obligatoriu") String name);

    Optional<Department> findByName(@NotBlank(message = "Numele departamentului este obligatoriu") String name);

    @Query("""
            SELECT d FROM Department d
            WHERE NOT EXISTS (
                SELECT 1 FROM User u
                WHERE u.department = d AND u.role = com.appbackend.backend.enums.Role.OPERATOR
            )
            """)
    List<Department> findDepartmentsWithoutOperator();
}
