package com.smartsalle.main.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Gym {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String city;
    private String phone;
    private String email;
    private LocalDateTime created_at;

    @OneToMany(mappedBy = "gym")
    private List<Membership> memberships;

    @OneToMany(mappedBy = "gym")
    private List<Session> sessions;
}