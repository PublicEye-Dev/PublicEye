package com.appbackend.backend.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.PasswordChangeRequest;
import com.appbackend.backend.dto.UserDto;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.Role;
import com.appbackend.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto getUserInfo() {
        User currentUser = getCurrentUser();
        return UserDto.from(currentUser);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilizatorul cu ID-ul " + id + " nu există"));
        return UserDto.from(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(user -> user.getRole().equals(Role.USER) || user.getRole().equals(Role.OPERATOR))
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto updateUserInfo(UserDto userDto) {
        User currentUser = getCurrentUser();

        if (userDto.fullName() != null) {
            currentUser.setFullName(userDto.fullName());
        }

        if (userDto.email() != null && !userDto.email().equals(currentUser.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(userDto.email())) {
                throw new IllegalArgumentException("Email-ul este deja folosit");
            }
            currentUser.setEmail(userDto.email());
        }

        if(userDto.phoneNumber() != null && !userDto.phoneNumber().equals(currentUser.getPhoneNumber())) {
            currentUser.setPhoneNumber(userDto.phoneNumber());
        }

        User updatedUser = userRepository.save(currentUser);
        return UserDto.from(updatedUser);
    }

    @Override
    @Transactional
    public UserDto updatePassword(PasswordChangeRequest request) {
        User currentUser = getCurrentUser();
        
        // Verifică dacă parola veche este corectă
        if (!passwordEncoder.matches(request.oldPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Parola veche este incorectă");
        }
        
        // Verifică dacă parola nouă este diferită de cea veche
        if (passwordEncoder.matches(request.newPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Parola nouă trebuie să fie diferită de parola veche");
        }
        
        // Hash-uiește și salvează parola nouă
        String encodedPassword = passwordEncoder.encode(request.newPassword());
        currentUser.setPassword(encodedPassword);
        
        User updatedUser = userRepository.save(currentUser);
        return UserDto.from(updatedUser);
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            // Reîncărcăm utilizatorul din baza de date pentru a avea datele actualizate
            User user = (User) principal;
            return userRepository.findById(user.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu a fost găsit"));
        }
        throw new IllegalStateException("Utilizatorul nu este autentificat");
    }
}