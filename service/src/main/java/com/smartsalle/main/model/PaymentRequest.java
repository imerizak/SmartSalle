package com.smartsalle.main.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PaymentRequest {
    private Long userId;
    private Long membershipId;
    private Double amount;
    private PaymentMethod paymentMethod;
    private String status;
    private LocalDate dueDate;
    private LocalDateTime paymentDate; // This was already here, for actual payment time

    // Getters
    public Long getUserId() {
        return userId;
    }

    public Long getMembershipId() {
        return membershipId;
    }

    public Double getAmount() {
        return amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    // Setters
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}

