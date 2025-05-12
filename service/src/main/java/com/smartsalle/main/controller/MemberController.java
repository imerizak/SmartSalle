package com.smartsalle.main.controller;

import com.smartsalle.main.model.User;
import com.smartsalle.main.service.MemberService;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private static final Logger LOGGER = LogManager.getLogger(MemberController.class);

    private final MemberService memberService;

    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins et Trainers peuvent lister les membres
    public ResponseEntity<Page<User>> getAllMembers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String membershipStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> membersPage = memberService.findAllMembers(name, email, membershipStatus, pageable);
        return new ResponseEntity<>(membersPage, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent créer des membres
    public ResponseEntity<User> createMember(@RequestBody User member) {
        User createdMember = memberService.createMember(member);
        return new ResponseEntity<>(createdMember, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\') or (hasRole(\'CLIENT\') and #id == authentication.principal.claims[\'sub\'])") // Admin/Trainer ou le membre lui-même
    public ResponseEntity<User> getMemberById(@PathVariable Long id) {
        User member = memberService.findMemberById(id);
        return new ResponseEntity<>(member, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole(\'ADMIN\') or (hasRole(\'CLIENT\') and #id == authentication.principal.claims[\'sub\'])") // Admin ou le membre lui-même
    public ResponseEntity<User> updateMember(@PathVariable Long id, @RequestBody User memberDetails) {
        User updatedMember = memberService.updateMember(id, memberDetails);
        return new ResponseEntity<>(updatedMember, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent supprimer des membres
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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

