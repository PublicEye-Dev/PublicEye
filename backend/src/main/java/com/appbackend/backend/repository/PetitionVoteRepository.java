package com.appbackend.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appbackend.backend.entity.PetitionVote;

public interface PetitionVoteRepository extends JpaRepository<PetitionVote, Long> {
    boolean existsByPetition_IdAndUser_Id(Long petitionId, Long userId);
}

