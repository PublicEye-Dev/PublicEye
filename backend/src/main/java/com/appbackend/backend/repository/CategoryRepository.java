package com.appbackend.backend.repository;

import com.appbackend.backend.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    boolean existsByNameIgnoreCaseAndDepartmentId(String name, Long departmentId);
}
