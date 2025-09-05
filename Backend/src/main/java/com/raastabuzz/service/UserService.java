package com.raastabuzz.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raastabuzz.dto.request.RegisterRequest;
import com.raastabuzz.model.Role;
import com.raastabuzz.model.User;
import com.raastabuzz.repository.UserRepository;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public User createUser(RegisterRequest registerRequest) {
        if (existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        System.out.println("i am int");
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(Role.CONTRIBUTOR);
        user.setPoints(0);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    
    public User updateUserPoints(User user, int pointsToAdd) {
        user.setPoints(user.getPoints() + pointsToAdd);
        return userRepository.save(user);
    }
    
    public List<User> getTopContributors() {
        return userRepository.findTopContributorsByPoints();
    }
    
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> getActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }
    
    public Long getActiveUsersCountByRole(Role role) {
        return userRepository.countActiveUsersByRole(role);
    }
    
    public User promoteToModerator(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setRole(Role.MODERATOR);
        return userRepository.save(user);
    }
    
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setIsActive(false);
        userRepository.save(user);
    }
}
