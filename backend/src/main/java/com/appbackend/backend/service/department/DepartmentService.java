package com.appbackend.backend.service.department;

import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;

import java.util.List;

public interface DepartmentService {
     Department getDepartmentById(Long id);
     List<Department> getAllDepartment();
     void deleteDepartment(Long id);
     Department updateCategories(Long departmentId, Long exCategoryId, Long newCategoryId);
     Department updateDepartment(DepartmentCreateRequest department);
     List<Category> getAllCategoriesOfDepartment(Long departmentId);

}
