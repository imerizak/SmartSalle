package com.smartsalle.main.service;

import com.smartsalle.main.model.Event;
import com.smartsalle.main.model.EventRegistration;
import com.smartsalle.main.model.User;
import com.smartsalle.main.model.UserRole;
import com.smartsalle.main.repository.EventRegistrationRepository;
import com.smartsalle.main.repository.EventRepository;
import com.smartsalle.main.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final UserRepository userRepository;

    @Autowired
    public EventService(EventRepository eventRepository, 
                        EventRegistrationRepository eventRegistrationRepository, 
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Page<Event> findAllEvents(String status, String type, LocalDateTime startDate, LocalDateTime endDate, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateTime").descending());
        
        if (status != null && type != null && startDate != null && endDate != null) {
            return eventRepository.findAllByStatusAndTypeAndDateTimeBetween(status, type, startDate, endDate, pageable);
        } else if (status != null && startDate != null && endDate != null) {
            return eventRepository.findAllByStatusAndDateTimeBetween(status, startDate, endDate, pageable);
        } else if (type != null && startDate != null && endDate != null) {
            return eventRepository.findAllByTypeAndDateTimeBetween(type, startDate, endDate, pageable);
        } else if (status != null && type != null) {
            return eventRepository.findAllByStatusAndType(status, type, pageable);
        } else if (status != null) {
            return eventRepository.findAllByStatus(status, pageable);
        } else if (type != null) {
            return eventRepository.findAllByType(type, pageable);
        } else if (startDate != null && endDate != null) {
            return eventRepository.findAllByDateTimeBetween(startDate, endDate, pageable);
        }
        return eventRepository.findAll(pageable);
    }

    @Transactional
    public Event createEvent(Event event, Long instructorId) {
        if (instructorId != null) {
            User instructor = userRepository.findByIdAndRole(instructorId, UserRole.TRAINER)
                    .orElseThrow(() -> new EntityNotFoundException("Instructor (TRAINER) not found with id: " + instructorId));
            event.setInstructor(instructor);
        }
        if (event.getDateTime().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Event date time must be in the future.");
        }
        // Default status if not provided
        if (event.getStatus() == null) {
            event.setStatus("upcoming");
        }
        return eventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public Event findEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event updateEvent(Long id, Event eventDetails, Long instructorId) {
        Event existingEvent = findEventById(id);

        if (eventDetails.getTitle() != null) existingEvent.setTitle(eventDetails.getTitle());
        if (eventDetails.getDescription() != null) existingEvent.setDescription(eventDetails.getDescription());
        if (eventDetails.getDateTime() != null) {
             if (eventDetails.getDateTime().isBefore(LocalDateTime.now())){
                throw new IllegalArgumentException("Event date time must be in the future.");
            }
            existingEvent.setDateTime(eventDetails.getDateTime());
        }
        if (eventDetails.getDurationInMinutes() != null) existingEvent.setDurationInMinutes(eventDetails.getDurationInMinutes());
        if (eventDetails.getCapacity() != null) existingEvent.setCapacity(eventDetails.getCapacity());
        if (eventDetails.getLocation() != null) existingEvent.setLocation(eventDetails.getLocation());
        if (eventDetails.getType() != null) existingEvent.setType(eventDetails.getType());
        if (eventDetails.getStatus() != null) existingEvent.setStatus(eventDetails.getStatus());

        if (instructorId != null) {
            User instructor = userRepository.findByIdAndRole(instructorId, UserRole.TRAINER)
                    .orElseThrow(() -> new EntityNotFoundException("Instructor (TRAINER) not found with id: " + instructorId));
            existingEvent.setInstructor(instructor);
        } else if (eventDetails.getInstructor() == null) { // Allow unsetting instructor
            existingEvent.setInstructor(null);
        }

        return eventRepository.save(existingEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = findEventById(id);
        // Consider logical delete (e.g., set status to "cancelled") instead of physical delete
        // For now, physical delete for simplicity, including registrations due to CascadeType.ALL
        eventRepository.delete(event);
    }

    @Transactional
    public EventRegistration registerMemberToEvent(Long eventId, Long memberId) {
        Event event = findEventById(eventId);
        User member = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                .orElseThrow(() -> new EntityNotFoundException("Member (CLIENT) not found with id: " + memberId));

        if (!"upcoming".equalsIgnoreCase(event.getStatus())) {
            throw new IllegalStateException("Cannot register for an event that is not upcoming. Current status: " + event.getStatus());
        }

        if (eventRegistrationRepository.existsByEventAndUser(event, member)) {
            throw new IllegalStateException("Member is already registered for this event.");
        }

        if (eventRegistrationRepository.countByEvent(event) >= event.getCapacity()) {
            throw new IllegalStateException("Event has reached its maximum capacity.");
        }

        EventRegistration registration = new EventRegistration(event, member);
        return eventRegistrationRepository.save(registration);
    }

    @Transactional
    public void unregisterMemberFromEvent(Long eventId, Long memberId) {
        Event event = findEventById(eventId);
        User member = userRepository.findByIdAndRole(memberId, UserRole.CLIENT)
                .orElseThrow(() -> new EntityNotFoundException("Member (CLIENT) not found with id: " + memberId));

        EventRegistration registration = eventRegistrationRepository.findByEventAndUser(event, member)
                .orElseThrow(() -> new EntityNotFoundException("Member is not registered for this event."));
        
        if (!"upcoming".equalsIgnoreCase(event.getStatus())) {
            throw new IllegalStateException("Cannot unregister from an event that is not upcoming. Current status: " + event.getStatus());
        }

        eventRegistrationRepository.delete(registration);
    }

    @Transactional(readOnly = true)
    public List<EventRegistration> getEventRegistrations(Long eventId) {
        Event event = findEventById(eventId);
        return eventRegistrationRepository.findAllByEvent(event);
    }
}

