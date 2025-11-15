package com.appbackend.backend.dto;

import com.appbackend.backend.entity.Petition;

public record PetitionResponse(
        Long id,
        String title,
        String receiver,
        String imageUrl,
        String imagePublicId,
        String problem,
        String solution,
        String officialResponse,
        int votes,
        Long userId,
        String userFullName,
        String userContact
) {
    public static PetitionResponse from(Petition petition) {
        String userFullName = null;
        String userContact = null;
        Long userId = null;

        if (petition.getUser() != null) {
            userId = petition.getUser().getId();
            userFullName = petition.getUser().getFullName();
            if (petition.getUser().getPhoneNumber() != null && !petition.getUser().getPhoneNumber().isBlank()) {
                userContact = petition.getUser().getPhoneNumber();
            } else if (petition.getUser().getEmail() != null && !petition.getUser().getEmail().isBlank()) {
                userContact = petition.getUser().getEmail();
            }
        }

        return new PetitionResponse(
                petition.getId(),
                petition.getTitle(),
                petition.getReceiver(),
                petition.getImageUrl(),
                petition.getImagePublicId(),
                petition.getProblem(),
                petition.getSolution(),
                petition.getOfficialResponse(),
                petition.getVotes(),
                userId,
                userFullName,
                userContact
        );
    }
}

