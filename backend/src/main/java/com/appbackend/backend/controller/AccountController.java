package com.appbackend.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.appbackend.backend.dto.PasswordChangeRequest;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.service.user.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final UserService userService;

    @PreAuthorize("hasAnyRole('USER', 'OPERATOR', 'ADMIN')")
    @GetMapping("/info")
    public ResponseEntity<UserDto> getUserInfo(){
        return ResponseEntity.ok(userService.getUserInfo());
    }

    @PreAuthorize("hasAnyRole('USER', 'OPERATOR', 'ADMIN')")
    @PutMapping("/update-info")
    public ResponseEntity<UserDto> updateUserInfo(@RequestBody @Valid UserDto userDto){
        return ResponseEntity.ok(userService.updateUserInfo(userDto));
    }

    @PreAuthorize("hasAnyRole('ADMIN')")
    @GetMapping("/get-user/{id}")
    public ResponseEntity<UserDto> getUser(@PathVariable(name = "id") Long id){
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    @PutMapping("/update-password")
    public ResponseEntity<UserDto> updatePassword(@RequestBody @Valid PasswordChangeRequest request){
        return ResponseEntity.ok(userService.updatePassword(request));
    }

}
