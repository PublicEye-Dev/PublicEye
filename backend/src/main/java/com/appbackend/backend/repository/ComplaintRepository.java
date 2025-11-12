package com.appbackend.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.enums.Status;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findAllByStatus(Status status);

    @Query("SELECT c FROM Complaint c WHERE c.createdAt >= :startDate")
    List<Complaint> findAllFromLastMonth(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT c FROM Complaint c WHERE c.createdAt >= :startDate")
    List<Complaint> findAllFromLastYear(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT c FROM Complaint c WHERE c.status IN :statuses AND c.createdAt >= :startDate")
    List<Complaint> findByStatusesAndCreatedAtAfter(@Param("statuses") List<Status> statuses, 
                                                      @Param("startDate") LocalDateTime startDate);
}