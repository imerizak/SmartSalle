package com.smartsalle.main.repository;

import com.smartsalle.main.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Long> {
}
