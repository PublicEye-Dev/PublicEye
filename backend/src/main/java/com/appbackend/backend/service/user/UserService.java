package com.appbackend.backend.service.user;

import java.util.List;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.PasswordChangeRequest;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.enums.Role;

public interface UserService {
    UserDto getUserInfo();
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
    UserDto updateUserInfo(UserDto user);
    UserDto updatePassword(PasswordChangeRequest request);
    PagedResponse<UserDto> getUsersForManagement(String name, Role role, int page, int size, String sortDir);
    PagedResponse<UserDto> searchUsers(String keyword, int page, int size, String sortDir);
}
