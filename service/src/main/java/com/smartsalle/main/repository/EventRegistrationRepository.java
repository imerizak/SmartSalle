package com.smartsalle.main.repository;

import com.smartsalle.main.model.Event;
import com.smartsalle.main.model.EventRegistration;
import com.smartsalle.main.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    List<EventRegistration> findAllByEvent(Event event);

    List<EventRegistration> findAllByUser(User user);

    Optional<EventRegistration> findByEventAndUser(Event event, User user);

    boolean existsByEventAndUser(Event event, User user);

    long countByEvent(Event event);
}

