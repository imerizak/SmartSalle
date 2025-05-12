package com.smartsalle.main.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membership_id") // A payment might not always be for a membership
    private Membership membership;

    @Column(nullable = false)
    private Double amount;

    private LocalDate dueDate; // Added for pending payments, as seen in frontend mock

    private LocalDateTime paymentDate; // Date when payment was made (paidAt in frontend)

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod; // Enum: CREDIT_CARD, DEBIT_CARD, BANK_TRANSFER

    @Column(nullable = false)
    private String status; // e.g., "PENDING", "PAID", "FAILED" - align with frontend needs
}

