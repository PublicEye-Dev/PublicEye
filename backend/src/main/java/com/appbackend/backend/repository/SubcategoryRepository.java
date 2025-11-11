package com.appbackend.backend.repository;

import com.appbackend.backend.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    Optional<Subcategory> findByNameIgnoreCaseAndCategoryId(String name, Long categoryId);
    boolean existsByNameIgnoreCaseAndCategoryId(String name, Long categoryId);
}
