package com.appbackend.backend.repository;

import com.appbackend.backend.entity.Department;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    boolean existsByNameIgnoreCase(@NotBlank(message = "Numele departamentului este obligatoriu") String name);

    Optional<Department> findByName(@NotBlank(message = "Numele departamentului este obligatoriu") String name);
}
