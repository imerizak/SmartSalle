package com.smartsalle.main.controller;

import com.smartsalle.main.model.User;
import com.smartsalle.main.service.CoachService;
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

import java.util.List; // Remplacé par Page<User> pour la méthode getAllCoaches

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    private static final Logger LOGGER = LogManager.getLogger(CoachController.class);

    private final CoachService coachService;

    @Autowired
    public CoachController(CoachService coachService) {
        this.coachService = coachService;
    }

    @GetMapping
    // Tous les utilisateurs authentifiés peuvent voir la liste des coachs
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<Page<User>> getAllCoaches(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String specialty,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> coachesPage = coachService.findAllCoaches(name, email, specialty, pageable);
        return new ResponseEntity<>(coachesPage, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent créer des coachs
    public ResponseEntity<User> createCoach(@RequestBody User coach) {
        User createdCoach = coachService.createCoach(coach);
        return new ResponseEntity<>(createdCoach, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    // Tous les utilisateurs authentifiés peuvent voir le détail d'un coach
    @PreAuthorize("isAuthenticated()") 
    public ResponseEntity<User> getCoachById(@PathVariable Long id) {
        User coach = coachService.findCoachById(id);
        return new ResponseEntity<>(coach, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent modifier les coachs
    public ResponseEntity<User> updateCoach(@PathVariable Long id, @RequestBody User coachDetails) {
        User updatedCoach = coachService.updateCoach(id, coachDetails);
        return new ResponseEntity<>(updatedCoach, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent supprimer les coachs
    public ResponseEntity<Void> deleteCoach(@PathVariable Long id) {
        coachService.deleteCoach(id);
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

