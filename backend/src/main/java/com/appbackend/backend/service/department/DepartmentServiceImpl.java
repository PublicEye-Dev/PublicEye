package com.appbackend.backend.service.department;

import java.util.List;

import com.appbackend.backend.dto.DepartmentCreateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.DepartmentRepository;
import com.appbackend.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));
        
        // Decuplăm toate categoriile asociate departamentului
        if (department.getCategories() != null && !department.getCategories().isEmpty()) {
            List<Category> categories = department.getCategories();
            for (Category category : categories) {
                category.setDepartment(null);
                categoryRepository.save(category);
            }
        }
        
        // Decuplăm toți utilizatorii asociați departamentului
        List<User> users = userRepository.findAllByDepartmentId(department.getId());
        if (users != null && !users.isEmpty()) {
            for (User user : users) {
                user.setDepartment(null);
                userRepository.save(user);
            }
        }
        
        // Ștergem departamentul
        departmentRepository.delete(department);
    }

    @Override
    @Transactional
    public Department updateCategories(Long departmentId, Long exCategoryId, Long newCategoryId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));

        // EROARE CORECTATĂ: folosim exCategoryId pentru categoria veche
        Category exCategory = categoryRepository.findById(exCategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria veche nu a fost gasita"));

        Category newCategory = categoryRepository.findById(newCategoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria noua nu a fost gasita"));

        if (exCategory.equals(newCategory)) {
            throw new IllegalArgumentException("Categoriile trebuie sa difere!");
        }

        // Verificăm dacă categoria veche aparține departamentului
        if (!department.getCategories().contains(exCategory)) {
            throw new IllegalArgumentException("Categoria veche nu aparține acestui departament!");
        }

        // Verificăm dacă categoria nouă nu aparține deja altui departament
        if (newCategory.getDepartment() != null && !newCategory.getDepartment().equals(department)) {
            throw new IllegalStateException("Categoria nouă aparține deja altui departament!");
        }

        // Actualizăm relația bidirecțională
        department.getCategories().remove(exCategory);
        department.getCategories().add(newCategory);
        
        // Actualizăm referința department pe categorii
        exCategory.setDepartment(null);
        newCategory.setDepartment(department);
        
        // Salvăm categoriile pentru a actualiza relația în DB
        categoryRepository.save(exCategory);
        categoryRepository.save(newCategory);
        
        return departmentRepository.save(department);
    }

    @Override
    public Department updateDepartment(DepartmentCreateRequest departmentDto) {
        Department department = departmentRepository.findByName(departmentDto.name())
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));
        if(departmentDto.name() != null && !departmentDto.name().equals(department.getName())) {
            department.setName(departmentDto.name());
        }
        if(departmentDto.description() != null && !departmentDto.description().equals(department.getDescription())) {
            department.setDescription(departmentDto.description());
        }
        return departmentRepository.save(department);
    }

    @Override
    public List<Category> getAllCategoriesOfDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new EntityNotFoundException("Departamentul nu a fost gasit"));
        return department.getCategories();
    }
}
