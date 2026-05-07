package com.bloodfinder.dto;

public class BloodBankResponse {
    private Long id;
    private String name;
    private String location;
    private String contact;
    private String description;
    private String createdAt;

    public BloodBankResponse() {}
    public BloodBankResponse(Long id, String name, String location, String contact, String description, String createdAt) {
        this.id = id; this.name = name; this.location = location;
        this.contact = contact; this.description = description; this.createdAt = createdAt;
    }

    public Long getId()          { return id; }
    public void setId(Long id)   { this.id = id; }
    public String getName()      { return name; }
    public void setName(String n){ this.name = n; }
    public String getLocation()  { return location; }
    public void setLocation(String l){ this.location = l; }
    public String getContact()   { return contact; }
    public void setContact(String c){ this.contact = c; }
    public String getDescription(){ return description; }
    public void setDescription(String d){ this.description = d; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String t){ this.createdAt = t; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id;
        private String name, location, contact, description, createdAt;
        public Builder id(Long v)           { this.id = v; return this; }
        public Builder name(String v)       { this.name = v; return this; }
        public Builder location(String v)   { this.location = v; return this; }
        public Builder contact(String v)    { this.contact = v; return this; }
        public Builder description(String v){ this.description = v; return this; }
        public Builder createdAt(String v)  { this.createdAt = v; return this; }
        public BloodBankResponse build() {
            return new BloodBankResponse(id, name, location, contact, description, createdAt);
        }
    }
}
