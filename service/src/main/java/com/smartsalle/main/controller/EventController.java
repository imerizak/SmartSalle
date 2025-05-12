package com.smartsalle.main.controller;

import com.smartsalle.main.model.Event;
import com.smartsalle.main.model.EventRegistration;
import com.smartsalle.main.service.EventService;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private static final Logger LOGGER = LogManager.getLogger(EventController.class);

    private final EventService eventService;

    @Autowired
    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()") // Tous les utilisateurs authentifiés peuvent voir les événements
    public ResponseEntity<Page<Event>> getAllEvents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Event> events = eventService.findAllEvents(status, type, startDate, endDate, page, size);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins et Trainers peuvent créer des événements
    public ResponseEntity<Event> createEvent(@RequestBody Event event, @RequestParam(required = false) Long instructorId) {
        // Si instructorId n'est pas fourni et que l'utilisateur est un TRAINER, on pourrait l'assigner automatiquement.
        // Pour l'instant, on laisse le service gérer la logique d'assignation de l'instructeur.
        Event createdEvent = eventService.createEvent(event, instructorId);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()") // Tous les utilisateurs authentifiés peuvent voir le détail d'un événement
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventService.findEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins ou Trainers (potentiellement le créateur de l'événement)
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails, @RequestParam(required = false) Long instructorId) {
        // Ajouter une logique dans le service pour vérifier si un TRAINER modifie son propre événement.
        Event updatedEvent = eventService.updateEvent(id, eventDetails, instructorId);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole(\'ADMIN\')") // Seuls les Admins peuvent supprimer des événements
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{eventId}/register")
    @PreAuthorize("hasRole(\'CLIENT\')") // Seuls les Clients peuvent s'inscrire aux événements
    public ResponseEntity<EventRegistration> registerMemberToEvent(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long memberId = getUserIdFromAuthentication(authentication, "CLIENT"); 
        if (memberId == null) {
            // Ce cas devrait être couvert par @PreAuthorize, mais une double vérification est possible
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); 
        }
        EventRegistration registration = eventService.registerMemberToEvent(eventId, memberId);
        return new ResponseEntity<>(registration, HttpStatus.CREATED);
    }

    @DeleteMapping("/{eventId}/unregister")
    @PreAuthorize("hasRole(\'CLIENT\')") // Seuls les Clients peuvent se désinscrire
    public ResponseEntity<Void> unregisterMemberFromEvent(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long memberId = getUserIdFromAuthentication(authentication, "CLIENT");
         if (memberId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        eventService.unregisterMemberFromEvent(eventId, memberId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/{eventId}/registrations")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins et Trainers peuvent voir les inscriptions
    public ResponseEntity<List<EventRegistration>> getEventRegistrations(@PathVariable Long eventId) {
        List<EventRegistration> registrations = eventService.getEventRegistrations(eventId);
        return new ResponseEntity<>(registrations, HttpStatus.OK);
    }

    private Long getUserIdFromAuthentication(Authentication authentication, String expectedRole) {
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getPrincipal();
            // Vérifier si l'utilisateur a le rôle attendu (déjà fait par @PreAuthorize, mais peut être utile pour la logique interne)
            // String userRole = jwt.getClaimAsString("user_role");
            // if (!expectedRole.equalsIgnoreCase(userRole)) {
            //     LOGGER.warn("User {} does not have expected role {}", jwt.getSubject(), expectedRole);
            //     return null;
            // }

            // Essayer de récupérer le claim "userId" qui devrait contenir l'ID Long de notre BDD
            Object userIdClaim = jwt.getClaim("userId"); 
            if (userIdClaim instanceof Number) {
                return ((Number) userIdClaim).longValue();
            }
            LOGGER.warn("User ID claim 'userId' not found or not a number in JWT for subject: {}. Authorities: {}", jwt.getSubject(), authentication.getAuthorities());
            // Si le claim "userId" n'existe pas, il faut une stratégie de fallback ou une erreur claire.
            // Par exemple, si le 'sub' est l'UUID Supabase et qu'on a une table de mapping.
            // Pour l'instant, on retourne null si le claim direct n'est pas là.
            return null; 
        }
        LOGGER.warn("Authentication principal is not a JWT or authentication is null.");
        return null;
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

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        LOGGER.warn(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
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

