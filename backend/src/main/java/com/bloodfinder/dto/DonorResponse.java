package com.bloodfinder.dto;

public class DonorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bloodGroup;
    private String location;
    private String phone;
    private Boolean availability;
    private String lastDonated;
    private String status;

    public DonorResponse() {}
    public DonorResponse(Long id, Long userId, String name, String email, String bloodGroup,
                         String location, String phone, Boolean availability, String lastDonated, String status) {
        this.id = id; this.userId = userId; this.name = name; this.email = email;
        this.bloodGroup = bloodGroup; this.location = location; this.phone = phone;
        this.availability = availability; this.lastDonated = lastDonated; this.status = status;
    }

    public Long getId()          { return id; }
    public void setId(Long id)   { this.id = id; }
    public Long getUserId()      { return userId; }
    public void setUserId(Long u){ this.userId = u; }
    public String getName()      { return name; }
    public void setName(String n){ this.name = n; }
    public String getEmail()     { return email; }
    public void setEmail(String e){ this.email = e; }
    public String getBloodGroup(){ return bloodGroup; }
    public void setBloodGroup(String bg){ this.bloodGroup = bg; }
    public String getLocation()  { return location; }
    public void setLocation(String l){ this.location = l; }
    public String getPhone()     { return phone; }
    public void setPhone(String p){ this.phone = p; }
    public Boolean getAvailability() { return availability; }
    public void setAvailability(Boolean a){ this.availability = a; }
    public String getLastDonated(){ return lastDonated; }
    public void setLastDonated(String d){ this.lastDonated = d; }
    public String getStatus()    { return status; }
    public void setStatus(String s){ this.status = s; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private Long id, userId;
        private String name, email, bloodGroup, location, phone, lastDonated, status;
        private Boolean availability;
        public Builder id(Long v)            { this.id = v; return this; }
        public Builder userId(Long v)        { this.userId = v; return this; }
        public Builder name(String v)        { this.name = v; return this; }
        public Builder email(String v)       { this.email = v; return this; }
        public Builder bloodGroup(String v)  { this.bloodGroup = v; return this; }
        public Builder location(String v)    { this.location = v; return this; }
        public Builder phone(String v)       { this.phone = v; return this; }
        public Builder availability(Boolean v){ this.availability = v; return this; }
        public Builder lastDonated(String v) { this.lastDonated = v; return this; }
        public Builder status(String v)      { this.status = v; return this; }
        public DonorResponse build() {
            return new DonorResponse(id, userId, name, email, bloodGroup, location, phone, availability, lastDonated, status);
        }
    }
}
