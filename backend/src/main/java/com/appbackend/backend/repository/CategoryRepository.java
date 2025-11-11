package com.appbackend.backend.repository;

import com.appbackend.backend.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCaseAndDepartmentId(@NotBlank(message = "Numele categoriei este obligatoriu") String name, @NotNull(message = "ID-ul departamentului este obligatoriu") Long aLong);

    Optional<Category> findByName(String name);

    boolean existsByNameIgnoreCase(@NotBlank(message = "Numele categoriei este obligatoriu") String name);
}
