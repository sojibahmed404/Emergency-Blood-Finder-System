package com.bloodfinder.dto;

import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    private String role;

    private String bloodGroup;
    private String location;
    private String phone;

    public RegisterRequest() {}

    public String getName()     { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail()    { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole()     { return role; }
    public void setRole(String role) { this.role = role; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bg) { this.bloodGroup = bg; }

    public String getLocation() { return location; }
    public void setLocation(String loc) { this.location = loc; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
