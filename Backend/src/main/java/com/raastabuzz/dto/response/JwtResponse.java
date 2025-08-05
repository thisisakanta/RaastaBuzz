package com.raastabuzz.dto.response;

public class JwtResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;
    private Integer points;
    
    public JwtResponse(String accessToken, Long id, String name, String email, String role, Integer points) {
        this.token = accessToken;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.points = points;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public Integer getPoints() {
        return points;
    }
    
    public void setPoints(Integer points) {
        this.points = points;
    }
}
