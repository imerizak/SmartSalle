package com.smartsalle.main.controller;

import com.smartsalle.main.model.Payment;
import com.smartsalle.main.model.PaymentRequest;
import com.smartsalle.main.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private static final Logger LOGGER = LogManager.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    @PreAuthorize("hasRole(\"ADMIN\") or hasRole(\"CLIENT\")") // Admin peut créer des paiements, Client peut initier son propre paiement
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentRequest paymentRequest) {
        // Ajouter une vérification pour s'assurer qu'un CLIENT ne crée un paiement que pour lui-même si nécessaire
        Payment payment = paymentService.createPayment(paymentRequest);
        return new ResponseEntity<>(payment, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole(\"ADMIN\", \"TRAINER\")") // Admins et Trainers peuvent voir tous les paiements
    public ResponseEntity<Page<Payment>> getAllPayments(
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Payment> payments = paymentService.findAllPayments(memberId, status, startDate, endDate, page, size);
        return new ResponseEntity<>(payments, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole(\"ADMIN\", \"TRAINER\") or (hasRole(\"CLIENT\") and @paymentService.isOwner(authentication, #id))") // Admin/Trainer ou le client propriétaire du paiement
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.findPaymentById(id);
        return new ResponseEntity<>(payment, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole(\"ADMIN\")") // Seul l'Admin peut mettre à jour le statut d'un paiement
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || status.trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Payment updatedPayment = paymentService.updatePaymentStatus(id, status);
        return new ResponseEntity<>(updatedPayment, HttpStatus.OK);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole(\"ADMIN\", \"TRAINER\")") // Admins et Trainers peuvent voir les statistiques de paiement
    public ResponseEntity<Map<String, Object>> getPaymentStats() {
        Map<String, Object> stats = paymentService.getPaymentStats();
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex) {
        LOGGER.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        LOGGER.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        LOGGER.warn("Access denied: {}", ex.getMessage());
        return new ResponseEntity<>("Access Denied: You do not have permission to perform this action.", HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        LOGGER.error("An unexpected error occurred: ", ex);
        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

