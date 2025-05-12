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
public class CoachService {

    private final UserRepository userRepository;

    @Autowired
    public CoachService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<User> findAllCoaches(String name, String email, String specialty, Pageable pageable) {
        // TODO: Implémenter la logique de filtrage plus avancée basée sur name, email, specialty
        // Pour l'instant, retourne tous les utilisateurs avec le rôle TRAINER, paginés
        // La recherche par rôle TRAINER est déjà dans la méthode du repository.
        // Si des filtres (name, email, specialty) sont fournis, il faudra construire une Specification JPA ou utiliser QueryDSL.
        // Exemple simple sans filtres supplémentaires pour l'instant :
        return userRepository.findByRole(UserRole.TRAINER, pageable);
    }

    @Transactional
    public User createCoach(User coach) {
        if (userRepository.existsByEmail(coach.getEmail())) {
            throw new IllegalArgumentException("Email " + coach.getEmail() + " is already in use.");
        }
        coach.setRole(UserRole.TRAINER);
        // TODO: Gérer le hachage du mot de passe si l'utilisateur est créé directement ici
        // et non via un processus d'inscription qui le ferait (ex: Supabase)
        // Pour l'instant, on suppose que le mot de passe est déjà haché ou géré ailleurs.
        // TODO: Gérer les champs spécifiques aux coachs (spécialités, bio, etc.) qui ne sont pas dans le modèle User standard.
        // Ces champs pourraient être dans une entité séparée CoachProfile liée à User, ou en tant que métadonnées JSON dans User.
        return userRepository.save(coach);
    }

    @Transactional(readOnly = true)
    public User findCoachById(Long id) {
        return userRepository.findByIdAndRole(id, UserRole.TRAINER)
                .orElseThrow(() -> new EntityNotFoundException("Coach not found with id: " + id));
    }

    @Transactional
    public User updateCoach(Long id, User coachDetails) {
        User existingCoach = findCoachById(id); // Assure que le coach existe et a le bon rôle

        if (coachDetails.getEmail() != null && !coachDetails.getEmail().equals(existingCoach.getEmail())) {
            if (userRepository.existsByEmail(coachDetails.getEmail())) {
                throw new IllegalArgumentException("Email " + coachDetails.getEmail() + " is already in use by another user.");
            }
            existingCoach.setEmail(coachDetails.getEmail());
        }

        if (coachDetails.getFirstName() != null) {
            existingCoach.setFirstName(coachDetails.getFirstName());
        }
        if (coachDetails.getLastName() != null) {
            existingCoach.setLastName(coachDetails.getLastName());
        }
        if (coachDetails.getPhone() != null) {
            existingCoach.setPhone(coachDetails.getPhone());
        }
        if (coachDetails.getOrganization() != null) {
            existingCoach.setOrganization(coachDetails.getOrganization());
        }
        // TODO: Gérer la mise à jour des champs spécifiques aux coachs.

        return userRepository.save(existingCoach);
    }

    @Transactional
    public void deleteCoach(Long id) {
        User coach = findCoachById(id); // Assure que le coach existe et a le bon rôle
        userRepository.delete(coach);
    }
}

