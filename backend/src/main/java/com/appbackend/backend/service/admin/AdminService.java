package com.appbackend.backend.service.admin;

import com.appbackend.backend.dto.CategoryCreateRequest;
import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentOperatorCreateRequest;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.entity.User;

public interface AdminService {
    User createDepartmentOperator(DepartmentOperatorCreateRequest request);

    Department createDepartment(DepartmentCreateRequest request);

    Category createCategory(CategoryCreateRequest request);

    Subcategory createSubcategory(SubcategoryCreateRequest request);
}
