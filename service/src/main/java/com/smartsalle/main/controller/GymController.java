package com.smartsalle.main.controller;

import com.smartsalle.main.model.Gym;
import com.smartsalle.main.service.GymService;
import jakarta.persistence.EntityNotFoundException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.net.ssl.HttpsURLConnection;
import java.util.List;

@RestController
@RequestMapping("/api/gyms")
public class GymController{

    private static final Logger LOGGER = LogManager.getLogger(GymController.class);

    private final GymService gymService;

    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

    @GetMapping
    public List<Gym> getAllGyms(){
        return gymService.findAllGym();
    }

    @PostMapping
    public ResponseEntity<Gym> postCreateGym(@RequestBody Gym gym){
        Gym createdGym = gymService.createGym(gym);
        return new ResponseEntity<>(createdGym, HttpStatus.CREATED);
    }

    @DeleteMapping("/{gymId}")
    public ResponseEntity<String> deleteGym(@PathVariable long gymId){
        gymService.removeGym(gymId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/${id}")
    public Gym getGym(@PathVariable long id){
        return gymService.readGym(id);
    }

    @PutMapping
    public ResponseEntity<Gym> putGym(@RequestBody Gym gym){
        Gym updatedGym = gymService.updateGym(gym);
        return new ResponseEntity<>(updatedGym, HttpStatus.OK);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException ex){
        LOGGER.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex){
        LOGGER.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex){
        LOGGER.error(ex.getMessage());
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
