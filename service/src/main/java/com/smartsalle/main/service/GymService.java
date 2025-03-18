package com.smartsalle.main.service;

import com.smartsalle.main.model.Gym;
import com.smartsalle.main.repository.GymRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GymService {

    private static final Logger LOGGER = LogManager.getLogger(GymService.class);

    private final GymRepository gymRepository;

    public GymService(GymRepository gymRepository) {
        this.gymRepository = gymRepository;
    }

    @Transactional(readOnly = true)
    public List<Gym> findAllGym(){
        LOGGER.info("Fetching gyms");
        return gymRepository.findAll();
    }

    @Transactional
    public void removeGym(long gymId){
        if(gymRepository.existsById(gymId))
            throw new EntityNotFoundException("Gym with Id : " + gymId + " not found");
        gymRepository.deleteById(gymId);
    }

    public Gym readGym(long id){
        Optional<Gym> gym = gymRepository.findById(id);
        if(!gymRepository.existsById(id) || gym.isEmpty())
            throw new EntityNotFoundException("Gym not found");
        return gym.get();
    }

    @Transactional
    public Gym updateGym(Gym gym){
        if(gym.getId() == null || !gymRepository.existsById(gym.getId()))
            throw new EntityNotFoundException("Gym with id : " + gym.getId() + " not found");
        return gymRepository.save(gym);
    }

    @Transactional
    public Gym createGym(Gym gym){
        if(gym.getName() == null || gym.getName().isEmpty())
            throw new IllegalArgumentException("Gym name cannot be empty");
        return gymRepository.save(gym);
    }

}
