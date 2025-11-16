package com.appbackend.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.appbackend.backend.entity.Alerta;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    
    @Query("SELECT a FROM Alerta a WHERE a.createdAt >= :since ORDER BY a.createdAt DESC")
    List<Alerta> findRecentAlerts(@Param("since") LocalDateTime since);
    
    List<Alerta> findAllByOrderByCreatedAtDesc();
}

