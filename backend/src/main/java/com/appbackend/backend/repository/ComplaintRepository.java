package com.appbackend.backend.repository;

import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByStatus(Status status);
}