package com.smartsalle.main.repository;

import com.smartsalle.main.model.Membership;
import com.smartsalle.main.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
     List<Membership> findByGymId(Long gymId);
}
