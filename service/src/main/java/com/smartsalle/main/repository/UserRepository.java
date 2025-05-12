package com.smartsalle.main.repository;

import com.smartsalle.main.model.User;
import com.smartsalle.main.model.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(UserRole role, Pageable pageable);

    Optional<User> findByIdAndRole(Long id, UserRole role);
}

