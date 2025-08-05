package com.raastabuzz.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raastabuzz.dto.response.MessageResponse;
import com.raastabuzz.model.TrafficReport;
import com.raastabuzz.model.User;
import com.raastabuzz.security.UserPrincipal;
import com.raastabuzz.service.TrafficReportService;
import com.raastabuzz.service.UserService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private TrafficReportService trafficReportService;
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(user -> ResponseEntity.ok().body(user))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/top-contributors")
    public ResponseEntity<List<User>> getTopContributors() {
        List<User> users = userService.getTopContributors();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/me/reports")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<List<TrafficReport>> getUserReports(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<TrafficReport> reports = trafficReportService.getReportsByUser(user);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/me/stats")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> getUserStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long totalReports = trafficReportService.getActiveReportsCountByUser(user);
        Long verifiedReports = trafficReportService.getVerifiedReportsCountByUser(user);
        
        return ResponseEntity.ok(new UserStatsResponse(
            totalReports,
            verifiedReports,
            user.getPoints()
        ));
    }
    
    @PutMapping("/{id}/promote")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> promoteToModerator(@PathVariable Long id) {
        try {
            User user = userService.promoteToModerator(id);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok(new MessageResponse("User deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Inner class for user stats response
    public static class UserStatsResponse {
        private Long totalReports;
        private Long verifiedReports;
        private Integer points;
        
        public UserStatsResponse(Long totalReports, Long verifiedReports, Integer points) {
            this.totalReports = totalReports;
            this.verifiedReports = verifiedReports;
            this.points = points;
        }
        
        public Long getTotalReports() {
            return totalReports;
        }
        
        public void setTotalReports(Long totalReports) {
            this.totalReports = totalReports;
        }
        
        public Long getVerifiedReports() {
            return verifiedReports;
        }
        
        public void setVerifiedReports(Long verifiedReports) {
            this.verifiedReports = verifiedReports;
        }
        
        public Integer getPoints() {
            return points;
        }
        
        public void setPoints(Integer points) {
            this.points = points;
        }
    }
}
