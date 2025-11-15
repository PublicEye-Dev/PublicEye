package com.appbackend.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.appbackend.backend.entity.Subcategory;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long>, JpaSpecificationExecutor<Subcategory> {
    Optional<Subcategory> findByNameIgnoreCaseAndCategoryId(String name, Long categoryId);
    boolean existsByNameIgnoreCaseAndCategoryId(String name, Long categoryId);

    @Query("SELECT s FROM Subcategory s WHERE s.category.id = :id")
    List<Subcategory> findAllByCategoryId(Long id);

    Page<Subcategory> findAllByCategory_Id(Long id, Pageable pageable);
}
