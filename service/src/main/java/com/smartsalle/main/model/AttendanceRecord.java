package com.smartsalle.main.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance_records")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    private String type; // e.g., "Gym Session", "Yoga Class"

    private Integer durationInMinutes; // Calculated, can be null if not checked out

    public AttendanceRecord(User user, LocalDateTime checkInTime, String type) {
        this.user = user;
        this.checkInTime = checkInTime;
        this.type = type;
    }
}

