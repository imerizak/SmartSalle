package com.smartsalle.main.repository;

import com.smartsalle.main.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findAllByStatus(String status, Pageable pageable);

    Page<Event> findAllByType(String type, Pageable pageable);

    Page<Event> findAllByDateTimeBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.type = :type")
    Page<Event> findAllByStatusAndType(@Param("status") String status, @Param("type") String type, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.dateTime BETWEEN :start AND :end")
    Page<Event> findAllByStatusAndDateTimeBetween(@Param("status") String status, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.type = :type AND e.dateTime BETWEEN :start AND :end")
    Page<Event> findAllByTypeAndDateTimeBetween(@Param("type") String type, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.type = :type AND e.dateTime BETWEEN :start AND :end")
    Page<Event> findAllByStatusAndTypeAndDateTimeBetween(@Param("status") String status, @Param("type") String type, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, Pageable pageable);

}

