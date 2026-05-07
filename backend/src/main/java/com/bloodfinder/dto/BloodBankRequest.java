package com.bloodfinder.dto;

import jakarta.validation.constraints.NotBlank;

public class BloodBankRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @NotBlank
    private String contact;

    private String description;

    public BloodBankRequest() {}

    public String getName()        { return name; }
    public void setName(String n)  { this.name = n; }

    public String getLocation()       { return location; }
    public void setLocation(String l) { this.location = l; }

    public String getContact()        { return contact; }
    public void setContact(String c)  { this.contact = c; }

    public String getDescription()    { return description; }
    public void setDescription(String d) { this.description = d; }
}
