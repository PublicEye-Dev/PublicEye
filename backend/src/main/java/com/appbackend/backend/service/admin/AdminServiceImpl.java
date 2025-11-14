package com.appbackend.backend.service.admin;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentOperatorCreateRequest;
import com.appbackend.backend.dto.DepartmentResponse;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.DepartmentRepository;
import com.appbackend.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
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
    public List<DepartmentResponse> getDepartmentsWithoutOperator() {
        List<Department> departments = departmentRepository.findDepartmentsWithoutOperator();
        return departments.stream()
                .map(DepartmentResponse::from)
                .toList();
    }

    @Override
    public UserDto getDepartmentOperator(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost găsit"));

        User operator = userRepository.findByDepartment_IdAndRole(department.getId(), Role.OPERATOR)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu are un operator desemnat"));

        return UserDto.from(operator);
    }

    @Override
    public void deleteUser(Long id) {
        if(userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
        else throw new EntityNotFoundException("Userul nu a fost gasit");
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