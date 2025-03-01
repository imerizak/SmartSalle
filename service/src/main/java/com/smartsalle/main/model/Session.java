package com.smartsalle.main.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "sessions")
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private User trainer;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxParticipants;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();
}
