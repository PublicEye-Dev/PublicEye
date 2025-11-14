package com.appbackend.backend.service.admin;

import java.util.List;

import com.appbackend.backend.dto.DepartmentCreateRequest;
import com.appbackend.backend.dto.DepartmentOperatorCreateRequest;
import com.appbackend.backend.dto.DepartmentResponse;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.User;

public interface AdminService {
    User createDepartmentOperator(DepartmentOperatorCreateRequest request);
    Department createDepartment(DepartmentCreateRequest request);
    List<DepartmentResponse> getDepartmentsWithoutOperator();
    UserDto getDepartmentOperator(Long departmentId);
    void deleteUser(Long id);
}
