package com.smartsalle.main.service;

import com.smartsalle.main.model.Membership;
import com.smartsalle.main.model.Payment;
import com.smartsalle.main.model.PaymentRequest;
import com.smartsalle.main.model.User;
import com.smartsalle.main.model.UserRole;
import com.smartsalle.main.repository.MembershipRepository;
import com.smartsalle.main.repository.PaymentRepository;
import com.smartsalle.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository; // Assuming it exists for membership details

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, UserRepository userRepository, MembershipRepository membershipRepository) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
    }

    @Transactional
    public Payment processMembershipPayment(PaymentRequest paymentRequest) {
        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + paymentRequest.getUserId()));

        Membership membership = membershipRepository.findById(paymentRequest.getMembershipId())
                .orElseThrow(() -> new EntityNotFoundException("Membership type not found with id: " + paymentRequest.getMembershipId()));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setMembership(membership);
        payment.setAmount(paymentRequest.getAmount());
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setStatus("PAID"); // Assuming direct payment is successful
        payment.setDueDate(LocalDate.now()); // Or based on membership start date

        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Page<Payment> findAllPayments(Long memberId, String status, LocalDate startDate, LocalDate endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").descending());
        User user = null;
        if (memberId != null) {
            user = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                    .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId));
        }

        if (user != null && status != null && startDate != null && endDate != null) {
            return paymentRepository.findAllByUserAndStatusAndDueDateBetween(user, status, startDate, endDate, pageable);
        } else if (user != null && status != null) {
            return paymentRepository.findAllByUserAndStatus(user, status, pageable);
        } else if (user != null && startDate != null && endDate != null) {
            return paymentRepository.findAllByUserAndDueDateBetween(user, startDate, endDate, pageable);
        } else if (status != null && startDate != null && endDate != null) {
            return paymentRepository.findAllByStatusAndDueDateBetween(status, startDate, endDate, pageable);
        } else if (user != null) {
            return paymentRepository.findAllByUser(user, pageable);
        } else if (status != null) {
            return paymentRepository.findAllByStatus(status, pageable);
        } else if (startDate != null && endDate != null) {
            return paymentRepository.findAllByDueDateBetween(startDate, endDate, pageable);
        }
        return paymentRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Payment findPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with id: " + id));
    }

    @Transactional
    public Payment updatePaymentStatus(Long id, String status) {
        Payment payment = findPaymentById(id);
        // Add validation for allowed status transitions if necessary
        payment.setStatus(status.toUpperCase());
        if ("PAID".equalsIgnoreCase(status) && payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        Double totalAmount = paymentRepository.sumTotalAmount();
        Double paidAmount = paymentRepository.sumTotalAmountByStatus("PAID");
        Double pendingAmount = paymentRepository.sumTotalAmountByStatus("PENDING"); // Assuming PENDING is a status

        stats.put("totalAmount", totalAmount != null ? totalAmount : 0.0);
        stats.put("paidAmount", paidAmount != null ? paidAmount : 0.0);
        stats.put("pendingAmount", pendingAmount != null ? pendingAmount : 0.0);
        // Add more stats as needed, e.g., counts
        stats.put("totalTransactions", paymentRepository.count());
        return stats;
    }
    
    // This method was in the old PaymentController, adapted here.
    // The PaymentRequest object might need to be adjusted if it's different from the one used for membership payment.
    @Transactional
    public Payment createPayment(PaymentRequest paymentRequest) {
        User user = userRepository.findById(paymentRequest.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + paymentRequest.getUserId()));

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(paymentRequest.getAmount());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        payment.setStatus(paymentRequest.getStatus() != null ? paymentRequest.getStatus().toUpperCase() : "PENDING");
        payment.setDueDate(paymentRequest.getDueDate() != null ? paymentRequest.getDueDate() : LocalDate.now().plusMonths(1)); // Example due date
        
        if ("PAID".equalsIgnoreCase(payment.getStatus())) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        // If it's a membership payment, link it.
        if (paymentRequest.getMembershipId() != null) {
            Membership membership = membershipRepository.findById(paymentRequest.getMembershipId())
                .orElseThrow(() -> new EntityNotFoundException("Membership type not found with id: " + paymentRequest.getMembershipId()));
            payment.setMembership(membership);
        }

        return paymentRepository.save(payment);
    }
}

