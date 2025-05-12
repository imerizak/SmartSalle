package com.smartsalle.main.service;

import com.smartsalle.main.model.User;
import com.smartsalle.main.model.UserRole;
import com.smartsalle.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest; // Plus nécessaire ici si Pageable est passé directement
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// import java.util.List; // Remplacé par Page<User>

@Service
public class MemberService {

    private final UserRepository userRepository;

    @Autowired
    public MemberService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<User> findAllMembers(String name, String email, String membershipStatus, Pageable pageable) {
        // TODO: Implémenter la logique de filtrage plus avancée basée sur name, email, membershipStatus
        // Pour l'instant, retourne tous les utilisateurs avec le rôle CLIENT, paginés
        // La recherche par rôle CLIENT est déjà dans la méthode du repository, donc pas besoin de filtrer ici explicitement pour ça.
        // Si des filtres (name, email, membershipStatus) sont fournis, il faudra construire une Specification JPA ou utiliser QueryDSL.
        // Exemple simple sans filtres supplémentaires pour l'instant :
        return userRepository.findByRole(UserRole.CLIENT, pageable);
    }

    @Transactional
    public User createMember(User member) {
        if (userRepository.existsByEmail(member.getEmail())) {
            throw new IllegalArgumentException("Email " + member.getEmail() + " is already in use.");
        }
        member.setRole(UserRole.CLIENT);
        // TODO: Gérer le hachage du mot de passe si l'utilisateur est créé directement ici
        // et non via un processus d'inscription qui le ferait (ex: Supabase)
        // Pour l'instant, on suppose que le mot de passe est déjà haché ou géré ailleurs.
        return userRepository.save(member);
    }

    @Transactional(readOnly = true)
    public User findMemberById(Long id) {
        return userRepository.findByIdAndRole(id, UserRole.CLIENT)
                .orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
    }

    @Transactional
    public User updateMember(Long id, User memberDetails) {
        User existingMember = findMemberById(id); // Assure que le membre existe et a le bon rôle

        if (memberDetails.getEmail() != null && !memberDetails.getEmail().equals(existingMember.getEmail())) {
            if (userRepository.existsByEmail(memberDetails.getEmail())) {
                throw new IllegalArgumentException("Email " + memberDetails.getEmail() + " is already in use by another user.");
            }
            existingMember.setEmail(memberDetails.getEmail());
        }

        if (memberDetails.getFirstName() != null) {
            existingMember.setFirstName(memberDetails.getFirstName());
        }
        if (memberDetails.getLastName() != null) {
            existingMember.setLastName(memberDetails.getLastName());
        }
        if (memberDetails.getPhone() != null) {
            existingMember.setPhone(memberDetails.getPhone());
        }
        if (memberDetails.getOrganization() != null) {
            existingMember.setOrganization(memberDetails.getOrganization());
        }
        // Ne pas mettre à jour le rôle ou le mot de passe ici, cela devrait être géré par des processus spécifiques.

        return userRepository.save(existingMember);
    }

    @Transactional
    public void deleteMember(Long id) {
        User member = findMemberById(id); // Assure que le membre existe et a le bon rôle
        // TODO: Décider s'il faut une suppression physique ou logique (marquer comme inactif)
        // Pour l'instant, suppression physique.
        userRepository.delete(member);
    }
}

