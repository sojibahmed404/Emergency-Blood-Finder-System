package com.bloodfinder.dto;

public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String name;
    private String email;
    private String role;

    public AuthResponse() {}
    public AuthResponse(String token, String type, Long id, String name, String email, String role) {
        this.token = token; this.type = type; this.id = id;
        this.name = name; this.email = email; this.role = role;
    }

    public String getToken()  { return token; }
    public void setToken(String token)  { this.token = token; }
    public String getType()   { return type; }
    public void setType(String type)    { this.type = type; }
    public Long getId()       { return id; }
    public void setId(Long id)          { this.id = id; }
    public String getName()   { return name; }
    public void setName(String name)    { this.name = name; }
    public String getEmail()  { return email; }
    public void setEmail(String email)  { this.email = email; }
    public String getRole()   { return role; }
    public void setRole(String role)    { this.role = role; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private String token, type, name, email, role;
        private Long id;
        public Builder token(String t)  { this.token = t; return this; }
        public Builder type(String t)   { this.type = t; return this; }
        public Builder id(Long i)       { this.id = i; return this; }
        public Builder name(String n)   { this.name = n; return this; }
        public Builder email(String e)  { this.email = e; return this; }
        public Builder role(String r)   { this.role = r; return this; }
        public AuthResponse build() { return new AuthResponse(token, type, id, name, email, role); }
    }
}
