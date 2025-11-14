package com.appbackend.backend.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.appbackend.backend.dto.PagedResponse;
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
    public PagedResponse<UserDto> getUsersForManagement(String name, Role role, int page, int size, String sortDir) {
        int validatedPage = Math.max(page, 0);
        int validatedSize = size <= 0 ? 10 : size;

        String normalizedName = (name != null && !name.isBlank()) ? name.trim() : null;
        Sort.Direction direction = resolveDirection(sortDir);

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by(direction, "fullName"));
        boolean excludeAdmin = normalizedName == null && role == null;

        Page<User> result = userRepository.searchUsers(normalizedName, role, excludeAdmin, pageable);

        List<UserDto> content = result.getContent().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());

        return mapToPagedResponse(result, content);
    }

    @Override
    public PagedResponse<UserDto> searchUsers(String keyword, int page, int size, String sortDir) {
        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("Keyword-ul pentru căutare nu poate fi gol");
        }

        int validatedPage = Math.max(page, 0);
        int validatedSize = size <= 0 ? 10 : size;
        Sort.Direction direction = resolveDirection(sortDir);

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by(direction, "fullName"));
        String normalizedKeyword = keyword.trim();

        Page<User> result = userRepository.searchUsersByKeyword(normalizedKeyword, pageable);
        List<UserDto> content = result.getContent().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());

        return mapToPagedResponse(result, content);
    }

    private Sort.Direction resolveDirection(String sortDir) {
        try {
            return Sort.Direction.fromString(sortDir);
        } catch (IllegalArgumentException | NullPointerException ex) {
            return Sort.Direction.ASC;
        }
    }

    private PagedResponse<UserDto> mapToPagedResponse(Page<User> page, List<UserDto> content) {
        return new PagedResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
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