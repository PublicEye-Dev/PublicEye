package com.appbackend.backend.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import com.appbackend.backend.entity.Petition;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.PetitionResponse;
import com.appbackend.backend.dto.PetitionUpdateRequest;
import com.appbackend.backend.dto.PetitionVoteRequest;
import com.appbackend.backend.enums.PetitionStatus;
import com.appbackend.backend.service.petition.PetitionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/petitions")
@RequiredArgsConstructor

public class PetitionController {

    private final PetitionService petitionService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<PetitionResponse> createPetition(
            @RequestParam("title") String title,
            @RequestParam("receiver") String receiver,
            @RequestParam("problem") String problem,
            @RequestParam("solution") String solution,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        PetitionResponse response = petitionService.createPetition(
                title,
                receiver,
                problem,
                solution,
                image,
                userId
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PetitionResponse> getPetition(@PathVariable Long id) {
        Petition petition = petitionService.getPetition(id);
        return ResponseEntity.ok(PetitionResponse.from(petition));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PetitionResponse>> getPetitionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(petitionService.getPetitionsByUser(userId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'OPERATOR')")
    @GetMapping("/get-petitions-paginated")
    public ResponseEntity<PagedResponse<PetitionResponse>> getPetitions(
            @RequestParam(name = "status", required = false) PetitionStatus status,
            @RequestParam(name = "createdAfter", required = false) LocalDateTime createdAfter,
            @RequestParam(name = "createdBefore", required = false) LocalDateTime createdBefore,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "sortDir", defaultValue = "DESC") String sortDir) {

        PagedResponse<PetitionResponse> response = petitionService.getPetitionsForAdmin(
                status,
                createdAfter,
                createdBefore,
                page,
                size,
                sortBy,
                sortDir
        );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{petitionId}/status")
    public ResponseEntity<PetitionResponse> updatePetition(
            @PathVariable Long petitionId,
            @RequestBody @Valid PetitionUpdateRequest request) {
        return ResponseEntity.ok(petitionService.updatePetition(petitionId, request));
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{petitionId}/vote")
    public ResponseEntity<PetitionResponse> votePetition(
            @PathVariable Long petitionId,
            @RequestBody @Valid PetitionVoteRequest request) {
        return ResponseEntity.ok(petitionService.votePetition(petitionId, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePetition(@PathVariable(name = "id") Long id) {
        petitionService.deletePetition(id);
        return ResponseEntity.noContent().build();
    }
}
