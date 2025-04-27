package com.smartsalle.main.model;

import java.time.LocalDateTime;

public class PaymentRequest {
    private PaymentMethod paymentMethod;
    private MembershipRequest membershipRequest;
    private Long amount;
    private LocalDateTime paymentDate;

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public MembershipRequest getMembershipRequest() {
        return membershipRequest;
    }

    public Long getAmount() {
        return amount;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }


    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setMembershipRequest(MembershipRequest membershipRequest) {
        this.membershipRequest = membershipRequest;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }


}
