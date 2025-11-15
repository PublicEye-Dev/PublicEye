package com.appbackend.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.appbackend.backend.entity.ComplaintVote;

public interface ComplaintVoteRepository extends JpaRepository<ComplaintVote, Long> {

    boolean existsByComplaint_IdAndUser_Id(Long complaintId, Long userId);

    Optional<ComplaintVote> findByComplaint_IdAndUser_Id(Long complaintId, Long userId);
}

