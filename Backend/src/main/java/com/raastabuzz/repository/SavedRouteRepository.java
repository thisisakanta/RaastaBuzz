package com.raastabuzz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.raastabuzz.model.SavedRoute;
import com.raastabuzz.model.User;

@Repository
public interface SavedRouteRepository extends JpaRepository<SavedRoute, Long> {
    
    List<SavedRoute> findByUser(User user);
    
    List<SavedRoute> findByUserAndAlertsEnabledTrue(User user);
    
    List<SavedRoute> findByAlertsEnabledTrue();
}
