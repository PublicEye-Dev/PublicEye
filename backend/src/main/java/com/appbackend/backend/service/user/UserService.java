package com.appbackend.backend.service.user;

import java.util.List;

import com.appbackend.backend.dto.PasswordChangeRequest;
import com.appbackend.backend.dto.UserDto;

public interface UserService {
    UserDto getUserInfo();
    UserDto getUserById(Long id);
    List<UserDto> getAllUsers();
    UserDto updateUserInfo(UserDto user);
    UserDto updatePassword(PasswordChangeRequest request);
}
