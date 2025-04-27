package com.smartsalle.main.controller;

import com.smartsalle.main.model.Membership;
import com.smartsalle.main.model.MembershipRequest;
import com.smartsalle.main.model.Payment;
import com.smartsalle.main.model.PaymentRequest;
import com.smartsalle.main.service.MembershipService;
import com.smartsalle.main.service.PaymentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/memberships")
public class PaymentController {

    private final MembershipService membershipService;
    private final PaymentService paymentService;

    public PaymentController(MembershipService membershipService, PaymentService paymentService) {
        this.membershipService = membershipService;
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> postMembershipPayment(@RequestBody PaymentRequest paymentRequest){
        Payment payment = paymentService.payMemberShip(paymentRequest);
        return new ResponseEntity<>(payment, HttpStatus.ACCEPTED);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex){

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex){

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex){

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
