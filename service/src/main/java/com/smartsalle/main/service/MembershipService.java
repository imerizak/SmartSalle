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
    private final UserRepository userRepository;
    private final GymRepository gymRepository;

    public MembershipService(MembershipRepository membershipRepository, UserRepository userRepository, GymRepository gymRepository){
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
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
        User user = userRepository.findByEmail(membershipRequest.getUserEmail())
                .orElseGet(() ->{
                    User userObj = new User();
                    userObj.setFirstName(membershipRequest.getUserFirstName());
                    userObj.setLastName(membershipRequest.getUserLastName());
                    userObj.setEmail(membershipRequest.getUserEmail());
                    userObj.setPhone(membershipRequest.getUserPhone());
                    return userRepository.save(userObj);
                });
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
