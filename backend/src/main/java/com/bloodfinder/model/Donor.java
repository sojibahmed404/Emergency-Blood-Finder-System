package com.bloodfinder.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "donors")
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false)
    private BloodGroup bloodGroup;

    @Column(length = 255)
    private String location;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false)
    private Boolean availability = true;

    @Column(name = "last_donated")
    private LocalDate lastDonated;

    public Donor() {}

    public Donor(Long id, User user, BloodGroup bloodGroup, String location, String phone, Boolean availability, LocalDate lastDonated) {
        this.id = id; this.user = user; this.bloodGroup = bloodGroup;
        this.location = location; this.phone = phone;
        this.availability = availability != null ? availability : true;
        this.lastDonated = lastDonated;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean availability) { this.availability = availability; }
    public LocalDate getLastDonated() { return lastDonated; }
    public void setLastDonated(LocalDate lastDonated) { this.lastDonated = lastDonated; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private BloodGroup bloodGroup;
        private String location, phone;
        private Boolean availability = true;
        private LocalDate lastDonated;

        public Builder id(Long id)                 { this.id = id; return this; }
        public Builder user(User user)             { this.user = user; return this; }
        public Builder bloodGroup(BloodGroup bg)   { this.bloodGroup = bg; return this; }
        public Builder location(String location)   { this.location = location; return this; }
        public Builder phone(String phone)         { this.phone = phone; return this; }
        public Builder availability(Boolean avail) { this.availability = avail; return this; }
        public Builder lastDonated(LocalDate date) { this.lastDonated = date; return this; }
        public Donor build() { return new Donor(id, user, bloodGroup, location, phone, availability, lastDonated); }
    }

    public enum BloodGroup {
        A_POS("A+"), A_NEG("A-"), B_POS("B+"), B_NEG("B-"),
        AB_POS("AB+"), AB_NEG("AB-"), O_POS("O+"), O_NEG("O-");

        private final String label;
        BloodGroup(String label) { this.label = label; }
        public String getLabel() { return label; }

        public static BloodGroup fromLabel(String label) {
            for (BloodGroup bg : values()) {
                if (bg.label.equalsIgnoreCase(label)) return bg;
            }
            throw new IllegalArgumentException("Unknown blood group: " + label);
        }
    }
}
