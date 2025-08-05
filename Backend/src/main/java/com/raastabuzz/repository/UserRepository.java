package com.raastabuzz.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.raastabuzz.model.Role;
import com.raastabuzz.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByIsActiveTrue();
    
    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.points DESC")
    List<User> findTopContributorsByPoints();
    
    @Query("SELECT u FROM User u WHERE u.points >= :minPoints")
    List<User> findUsersByMinPoints(@Param("minPoints") Integer minPoints);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    Long countActiveUsersByRole(@Param("role") Role role);
}
