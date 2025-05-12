package com.smartsalle.main.controller;

import com.smartsalle.main.model.AttendanceRecord;
import com.smartsalle.main.service.AttendanceService;
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

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private static final Logger LOGGER = LogManager.getLogger(AttendanceController.class);

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins et Trainers peuvent voir tous les enregistrements de présence
    public ResponseEntity<Page<AttendanceRecord>> getAllAttendanceRecords(
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AttendanceRecord> records = attendanceService.findAllAttendanceRecords(memberId, startDate, endDate, type, page, size);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\', \'CLIENT\')") // Admin, Trainer ou Client (pour lui-même, à vérifier dans le service)
    public ResponseEntity<AttendanceRecord> checkIn(@RequestParam Long memberId, @RequestParam String type) {
        // Idéalement, le service devrait vérifier si un CLIENT fait un check-in pour lui-même
        // ou si un ADMIN/TRAINER le fait pour un membre.
        try {
            AttendanceRecord record = attendanceService.checkIn(memberId, type);
            return new ResponseEntity<>(record, HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            LOGGER.warn(e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.CONFLICT); 
        }
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\', \'CLIENT\')") // Admin, Trainer ou Client (pour lui-même, à vérifier dans le service)
    public ResponseEntity<AttendanceRecord> checkOut(@RequestParam Long memberId) {
         // Idéalement, le service devrait vérifier si un CLIENT fait un check-out pour lui-même
        AttendanceRecord record = attendanceService.checkOut(memberId);
        return new ResponseEntity<>(record, HttpStatus.OK);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole(\'ADMIN\', \'TRAINER\')") // Admins et Trainers peuvent voir les statistiques de présence
    public ResponseEntity<Map<String, Object>> getAttendanceStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> stats = attendanceService.getAttendanceStats(startDate, endDate);
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

