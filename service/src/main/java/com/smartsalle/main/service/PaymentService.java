package com.smartsalle.main.service;

import com.smartsalle.main.model.Membership;
import com.smartsalle.main.model.Payment;
import com.smartsalle.main.model.PaymentRequest;
import com.smartsalle.main.repository.PaymentRepository;

public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MembershipService membershipService;

    public PaymentService(PaymentRepository paymentRepository, MembershipService membershipService) {
        this.paymentRepository = paymentRepository;
        this.membershipService = membershipService;
    }

    public Payment payMemberShip(PaymentRequest paymentRequest){
        Membership membership = membershipService.addMembershipToGym(paymentRequest.getMembershipRequest());
        Payment payment = new Payment();
        payment.setPayment_date(paymentRequest.getPaymentDate());
        payment.setPayment_method(paymentRequest.getPaymentMethod());
        payment.setAmount(paymentRequest.getAmount());
        payment.setUser(membership.getUser());
        payment.setMembership(membership);

        membership.setPayment(payment);

        return paymentRepository.save(payment);
    }
}
