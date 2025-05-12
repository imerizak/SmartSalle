package com.smartsalle.main.repository;

import com.smartsalle.main.model.Payment;
import com.smartsalle.main.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Page<Payment> findAllByUser(User user, Pageable pageable);

    Page<Payment> findAllByStatus(String status, Pageable pageable);

    Page<Payment> findAllByDueDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Find by user and status
    Page<Payment> findAllByUserAndStatus(User user, String status, Pageable pageable);
    
    // Find by user and due date range
    Page<Payment> findAllByUserAndDueDateBetween(User user, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Find by status and due date range
    Page<Payment> findAllByStatusAndDueDateBetween(String status, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // Find by user, status, and due date range
    Page<Payment> findAllByUserAndStatusAndDueDateBetween(User user, String status, LocalDate startDate, LocalDate endDate, Pageable pageable);

    // For statistics
    @Query("SELECT SUM(p.amount) FROM Payment p")
    Double sumTotalAmount();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    Double sumTotalAmountByStatus(@Param("status") String status);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user")
    Double sumTotalAmountByUser(@Param("user") User user);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.user = :user AND p.status = :status")
    Double sumTotalAmountByUserAndStatus(@Param("user") User user, @Param("status") String status);

}

