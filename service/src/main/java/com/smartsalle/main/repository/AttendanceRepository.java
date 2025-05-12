package com.smartsalle.main.repository;

import com.smartsalle.main.model.AttendanceRecord;
import com.smartsalle.main.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    Page<AttendanceRecord> findAllByUser(User user, Pageable pageable);

    Page<AttendanceRecord> findAllByCheckInTimeBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT ar FROM AttendanceRecord ar WHERE ar.user = :user AND ar.checkOutTime IS NULL ORDER BY ar.checkInTime DESC")
    Optional<AttendanceRecord> findLastActiveCheckInByUser(@Param("user") User user);

    // Méthode pour filtrer par utilisateur et période
    Page<AttendanceRecord> findByUserAndCheckInTimeBetween(User user, LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Méthode pour filtrer par type et période
    Page<AttendanceRecord> findByTypeAndCheckInTimeBetween(String type, LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Méthode pour filtrer par utilisateur, type et période
    Page<AttendanceRecord> findByUserAndTypeAndCheckInTimeBetween(User user, String type, LocalDateTime start, LocalDateTime end, Pageable pageable);

    // Pour les statistiques
    @Query("SELECT COUNT(DISTINCT ar.user) FROM AttendanceRecord ar WHERE ar.checkInTime >= :start AND ar.checkInTime < :end")
    long countDistinctUsersByCheckInTimeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT AVG(ar.durationInMinutes) FROM AttendanceRecord ar WHERE ar.durationInMinutes IS NOT NULL AND ar.checkInTime >= :start AND ar.checkInTime < :end")
    Double getAverageDurationInMinutesByCheckInTimeBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}

