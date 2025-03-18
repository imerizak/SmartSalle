package com.smartsalle.main.model;

import java.time.LocalDate;

public class MembershipRequest {
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String userPhone;
    private Long gymId;
    private LocalDate startDate;
    private LocalDate endDate;

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public void setGymId(Long gymId) {
        this.gymId = gymId;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }


    public LocalDate getEndDate() {
        return endDate;
    }

    public Long getGymId() {
        return gymId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public String getUserFirstName() {
        return userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }
}

