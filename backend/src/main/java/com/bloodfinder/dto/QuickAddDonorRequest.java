package com.bloodfinder.dto;

import jakarta.validation.constraints.NotBlank;

public class QuickAddDonorRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String bloodGroup;
    @NotBlank
    private String location;
    @NotBlank
    private String phone;
    
    private String email;

    public QuickAddDonorRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bg) { this.bloodGroup = bg; }
    public String getLocation() { return location; }
    public void setLocation(String loc) { this.location = loc; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
