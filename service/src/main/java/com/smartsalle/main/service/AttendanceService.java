package com.smartsalle.main.service;

import com.smartsalle.main.model.AttendanceRecord;
import com.smartsalle.main.model.User;
import com.smartsalle.main.model.UserRole;
import com.smartsalle.main.repository.AttendanceRepository;
import com.smartsalle.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<AttendanceRecord> findAllAttendanceRecords(Long memberId, LocalDateTime startDate, LocalDateTime endDate, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("checkInTime").descending());
        User member = null;
        if (memberId != null) {
            member = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                    .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId));
        }

        if (member != null && type != null && startDate != null && endDate != null) {
            return attendanceRepository.findByUserAndTypeAndCheckInTimeBetween(member, type, startDate, endDate, pageable);
        } else if (member != null && startDate != null && endDate != null) {
            return attendanceRepository.findByUserAndCheckInTimeBetween(member, startDate, endDate, pageable);
        } else if (type != null && startDate != null && endDate != null) {
            return attendanceRepository.findByTypeAndCheckInTimeBetween(type, startDate, endDate, pageable);
        } else if (member != null) {
            return attendanceRepository.findAllByUser(member, pageable);
        } else if (startDate != null && endDate != null) {
            return attendanceRepository.findAllByCheckInTimeBetween(startDate, endDate, pageable);
        }
        return attendanceRepository.findAll(pageable);
    }

    @Transactional
    public AttendanceRecord checkIn(Long memberId, String type) {
        User member = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId));

        // Vérifier si un check-in actif existe déjà pour ce membre
        attendanceRepository.findLastActiveCheckInByUser(member).ifPresent(activeRecord -> {
            throw new IllegalStateException("Member " + member.getFirstName() + " " + member.getLastName() + " is already checked in.");
        });

        AttendanceRecord attendanceRecord = new AttendanceRecord(member, LocalDateTime.now(), type);
        return attendanceRepository.save(attendanceRecord);
    }

    @Transactional
    public AttendanceRecord checkOut(Long memberId) {
        User member = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + memberId));

        AttendanceRecord attendanceRecord = attendanceRepository.findLastActiveCheckInByUser(member)
                .orElseThrow(() -> new EntityNotFoundException("No active check-in found for member id: " + memberId));

        attendanceRecord.setCheckOutTime(LocalDateTime.now());
        if (attendanceRecord.getCheckInTime() != null) {
            long duration = Duration.between(attendanceRecord.getCheckInTime(), attendanceRecord.getCheckOutTime()).toMinutes();
            attendanceRecord.setDurationInMinutes((int) duration);
        }
        return attendanceRepository.save(attendanceRecord);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAttendanceStats(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null) startDate = LocalDateTime.now().minusYears(1); // Default to last year if not provided
        if (endDate == null) endDate = LocalDateTime.now();

        long totalVisits = attendanceRepository.findAllByCheckInTimeBetween(startDate, endDate, PageRequest.of(0,1)).getTotalElements();
        long uniqueVisitors = attendanceRepository.countDistinctUsersByCheckInTimeBetween(startDate, endDate);
        Double averageDuration = attendanceRepository.getAverageDurationInMinutesByCheckInTimeBetween(startDate, endDate);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVisits", totalVisits);
        stats.put("uniqueVisitors", uniqueVisitors);
        stats.put("averageVisitDurationMinutes", averageDuration != null ? Math.round(averageDuration) : 0);

        return stats;
    }
}

