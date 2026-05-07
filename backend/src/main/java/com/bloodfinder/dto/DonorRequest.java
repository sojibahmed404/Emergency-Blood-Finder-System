package com.bloodfinder.dto;

import jakarta.validation.constraints.NotBlank;

public class DonorRequest {

    @NotBlank
    private String bloodGroup;
    private String location;
    private String phone;
    private Boolean availability;
    private String lastDonated;

    public DonorRequest() {}

    public String getBloodGroup()  { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getLocation()    { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getPhone()       { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }

    public String getLastDonated() { return lastDonated; }
    public void setLastDonated(String lastDonated) { this.lastDonated = lastDonated; }
}
