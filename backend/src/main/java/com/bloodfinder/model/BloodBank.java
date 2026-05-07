package com.bloodfinder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_banks")
public class BloodBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(nullable = false, length = 50)
    private String contact;

    @Column(length = 500)
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public BloodBank() {}

    public BloodBank(Long id, String name, String location, String contact, String description, LocalDateTime createdAt) {
        this.id = id; this.name = name; this.location = location;
        this.contact = contact; this.description = description; this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name, location, contact, description;
        public Builder id(Long id)               { this.id = id; return this; }
        public Builder name(String name)         { this.name = name; return this; }
        public Builder location(String location) { this.location = location; return this; }
        public Builder contact(String contact)   { this.contact = contact; return this; }
        public Builder description(String desc)  { this.description = desc; return this; }
        public BloodBank build() { return new BloodBank(id, name, location, contact, description, null); }
    }
}
