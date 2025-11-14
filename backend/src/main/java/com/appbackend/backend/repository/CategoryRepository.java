package com.appbackend.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.appbackend.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Optional<Category> findByName(String name);
    boolean existsByNameIgnoreCaseAndDepartmentId(String name, Long departmentId);

    @Query("SELECT c FROM Category c WHERE c.department.id = :departmentId")
    List<Category> findByDepartment_Id(Long departmentId);
}
