package com.appbackend.backend.service.petition;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.PetitionResponse;
import com.appbackend.backend.dto.PetitionUpdateRequest;
import com.appbackend.backend.dto.PetitionVoteRequest;
import com.appbackend.backend.enums.PetitionStatus;

public interface PetitionService {
    PetitionResponse createPetition(
            String title,
            String receiver,
            String problem,
            String solution,
            MultipartFile image,
            Long userId) throws IOException;

    List<PetitionResponse> getPetitionsByUser(Long userId);

    PagedResponse<PetitionResponse> getPetitionsForAdmin(
            PetitionStatus status,
            LocalDateTime createdAfter,
            LocalDateTime createdBefore,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    PetitionResponse updatePetition(Long petitionId, PetitionUpdateRequest request);

    PetitionResponse votePetition(Long petitionId, PetitionVoteRequest request);
}
