package com.appbackend.backend.service.petition;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.PetitionResponse;
import com.appbackend.backend.dto.PetitionUpdateRequest;
import com.appbackend.backend.dto.PetitionVoteRequest;
import com.appbackend.backend.entity.Petition;
import com.appbackend.backend.entity.PetitionVote;
import com.appbackend.backend.entity.User;
import com.appbackend.backend.enums.PetitionStatus;
import com.appbackend.backend.repository.PetitionRepository;
import com.appbackend.backend.repository.PetitionVoteRepository;
import com.appbackend.backend.repository.UserRepository;
import com.appbackend.backend.service.complaint.FileUploadService;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetitionServiceImpl implements PetitionService {

    private final PetitionRepository petitionRepository;
    private final UserRepository userRepository;
    private final PetitionVoteRepository petitionVoteRepository;
    private final FileUploadService fileUploadService;

    @Override
    @Transactional
    public PetitionResponse createPetition(
            String title,
            String receiver,
            String problem,
            String solution,
            MultipartFile image,
            Long userId) throws IOException {

        Petition petition = new Petition();
        petition.setTitle(title);
        petition.setReceiver(receiver);
        petition.setProblem(problem);
        petition.setSolution(solution);
        petition.setStatus(PetitionStatus.ACTIVE);

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));
            petition.setUser(user);
        }

        if (image != null && !image.isEmpty()) {
            FileUploadService.UploadedImage uploaded = fileUploadService.uploadImage(image);
            petition.setImageUrl(uploaded.secureUrl());
            petition.setImagePublicId(uploaded.publicId());
        }

        Petition saved = petitionRepository.save(petition);
        return PetitionResponse.from(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetitionResponse> getPetitionsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));

        return petitionRepository.findByUser_Id(user.getId()).stream()
                .map(PetitionResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<PetitionResponse> getPetitionsForAdmin(
            PetitionStatus status,
            LocalDateTime createdAfter,
            LocalDateTime createdBefore,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        int validatedPage = Math.max(page, 0);
        int validatedSize = size <= 0 ? 10 : size;
        String validatedSortBy = (sortBy == null || sortBy.isBlank()) ? "createdAt" : sortBy;
        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortDir);
        } catch (IllegalArgumentException | NullPointerException ex) {
            direction = Sort.Direction.DESC;
        }

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by(direction, validatedSortBy));

        Specification<Petition> spec = PetitionSpecification.withFilters(
                status,
                createdAfter,
                createdBefore
        );

        Page<Petition> result = petitionRepository.findAll(spec, pageable);

        List<PetitionResponse> content = result.getContent().stream()
                .map(PetitionResponse::from)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isFirst(),
                result.isLast()
        );
    }

    @Override
    public Petition getPetition(Long id) {
        return petitionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Petitia nu a fost gasita"));
    }

    @Override
    @Transactional
    public PetitionResponse updatePetition(Long petitionId, PetitionUpdateRequest request) {
        Petition petition = petitionRepository.findById(petitionId)
                .orElseThrow(() -> new EntityNotFoundException("Petitia nu există"));

        petition.setStatus(request.status());
        petition.setOfficialResponse(request.officialResponse());

        Petition updated = petitionRepository.save(petition);
        return PetitionResponse.from(updated);
    }

    @Override
    @Transactional
    public PetitionResponse votePetition(Long petitionId, PetitionVoteRequest request) {
        Petition petition = petitionRepository.findById(petitionId)
                .orElseThrow(() -> new EntityNotFoundException("Petitia nu există"));

        if (petition.refreshStatusIfExpired() == PetitionStatus.CLOSED) {
            petitionRepository.save(petition);
            throw new IllegalStateException("Petitia este închisă și nu mai poate fi semnată");
        }

        User currentUser = getCurrentUser();

        if (petitionVoteRepository.existsByPetition_IdAndUser_Id(petition.getId(), currentUser.getId())) {
            throw new IllegalStateException("Ai semnat deja această petiție");
        }

        PetitionVote vote = new PetitionVote();
        vote.setPetition(petition);
        vote.setUser(currentUser);
        vote.setSignerName(request.signerName());
        petitionVoteRepository.save(vote);

        petition.setVotes(petition.getVotes() + 1);
        Petition updated = petitionRepository.save(petition);
        return PetitionResponse.from(updated);
    }

    @Override
    public void deletePetition(Long petitionId) {
        Petition petition = petitionRepository.findById(petitionId)
                .orElseThrow(() -> new EntityNotFoundException("Petitia nu a fost gasita"));

        if(petition.getStatus().equals(PetitionStatus.CLOSED) || petition.getStatus().equals(PetitionStatus.BANNED)) {
            petitionRepository.delete(petition);
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User authenticatedUser) {
            return userRepository.findById(authenticatedUser.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Utilizatorul nu există"));
        }
        throw new IllegalStateException("Utilizatorul nu este autentificat");
    }
}
