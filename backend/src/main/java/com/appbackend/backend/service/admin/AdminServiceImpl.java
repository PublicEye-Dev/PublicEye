package com.appbackend.backend.service.admin;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentOperatorCreateRequest;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.DepartmentRepository;
import com.appbackend.backend.repository.SubcategoryRepository;
import com.appbackend.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Department createDepartment(DepartmentCreateRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.name())) {
            throw new IllegalArgumentException("Departamentul există deja");
        }

        Department department = new Department();
        department.setName(request.name());
        department.setDescription(request.description());

        List<String> categoryNames = Optional.ofNullable(request.categories()).orElse(List.of());
        department.setCategories(new ArrayList<>());

        for (String name : categoryNames) {
            Category category = categoryRepository.findByName(name)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria '" + name + "' nu există"));

            if (category.getDepartment() != null && !category.getDepartment().equals(department)) {
                throw new IllegalStateException("Categoria '" + name + "' este deja asociată altui departament");
            }

            category.setDepartment(department);
            categoryRepository.save(category);
            department.getCategories().add(category);
        }
        return departmentRepository.save(department);
    }

    @Override
    @Transactional
    public Category createCategory(CategoryCreateRequest request) {
        Department department = null;
        if (request.departmentId() != null) {
            department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost găsit"));
            if (categoryRepository.existsByNameIgnoreCaseAndDepartmentId(request.name(), request.departmentId())) {
                throw new IllegalArgumentException("Categoria există deja pentru departamentul selectat");
            }
        } else {
            if (categoryRepository.findByName(request.name()).isPresent()) {
                throw new IllegalArgumentException("Categoria există deja");
            }
        }

        Category category = new Category();
        category.setName(request.name());
        category.setDepartment(department);

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public Subcategory createSubcategory(SubcategoryCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu există"));

        if (subcategoryRepository.existsByNameIgnoreCaseAndCategoryId(request.name(), request.categoryId())) {
            throw new IllegalArgumentException("Subcategoria există deja în categoria selectată");
        }

        Subcategory subcategory = new Subcategory();
        subcategory.setName(request.name());
        subcategory.setCategory(category);

        category.getSubcategories().add(subcategory); // sau category.addSubcategory(subcategory)

        return subcategoryRepository.save(subcategory);
    }

    @Override
    @Transactional
    public User createDepartmentOperator(DepartmentOperatorCreateRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Adresa de email este deja folosită");
        }

        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost găsit"));

        User operator = new User();
        operator.setFullName(request.fullName());
        operator.setEmail(request.email());
        operator.setPassword(passwordEncoder.encode(request.password()));
        operator.setRole(Role.OPERATOR);
        operator.setDepartment(department);

        return userRepository.save(operator);
    }
}