package com.smartsalle.main.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private Integer durationInMinutes;

    @Column(nullable = false)
    private Integer capacity;

    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id") // Assuming User with TRAINER role
    private User instructor;

    @Column(nullable = false)
    private String type; // e.g., "workshop", "class"

    @Column(nullable = false)
    private String status; // e.g., "upcoming", "ongoing", "completed", "cancelled"

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventRegistration> registrations = new ArrayList<>();

    // Convenience method to get number of registered users
    public Integer getRegisteredCount() {
        return registrations.size();
    }
}

