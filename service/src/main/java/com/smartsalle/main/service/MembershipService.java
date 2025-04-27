package com.smartsalle.main.service;

import com.smartsalle.main.model.Gym;
import com.smartsalle.main.model.Membership;
import com.smartsalle.main.model.MembershipRequest;
import com.smartsalle.main.model.User;
import com.smartsalle.main.repository.GymRepository;
import com.smartsalle.main.repository.MembershipRepository;
import com.smartsalle.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final UserService userService;
    private final GymRepository gymRepository;

    public MembershipService(MembershipRepository membershipRepository, UserService userService, GymRepository gymRepository){
        this.membershipRepository = membershipRepository;
        this.userService = userService;
        this.gymRepository = gymRepository;
    }

    public List<User> findGymMembers(Long gymId){
        List<Membership> memberships = membershipRepository.findByGymId(gymId);
        return memberships.stream()
                .map(Membership::getUser)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public Membership addMembershipToGym(MembershipRequest membershipRequest){
        User user = userService.getOrCreateUser(membershipRequest.getUserEmail(),membershipRequest.getUserFirstName(), membershipRequest.getUserLastName(),membershipRequest.getUserPhone());
        Gym gym = gymRepository.findById(membershipRequest.getGymId())
                .orElseThrow(EntityNotFoundException::new);

        Membership membership = new Membership();
        membership.setGym(gym);
        membership.setUser(user);
        membership.setStartDate(membershipRequest.getStartDate());
        membership.setEndDate(membershipRequest.getEndDate());

        return membershipRepository.save(membership);
    }
}
