package com.raastabuzz.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.raastabuzz.model.ForumPost;
import com.raastabuzz.model.PostCategory;
import com.raastabuzz.model.Role;
import com.raastabuzz.model.Severity;
import com.raastabuzz.model.TrafficCategory;
import com.raastabuzz.model.TrafficReport;
import com.raastabuzz.model.User;
import com.raastabuzz.repository.ForumPostRepository;
import com.raastabuzz.repository.TrafficReportRepository;
import com.raastabuzz.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrafficReportRepository trafficReportRepository;
    
    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initializeData();
        }
    }
    
    private void initializeData() {
        // Create demo users
        User contributor = createUser("Ahmed Rahman", "contributor@demo.com", "demo123", Role.CONTRIBUTOR, 245);
        User moderator = createUser("Fatima Khan", "moderator@demo.com", "demo123", Role.MODERATOR, 1250);
        User contributor2 = createUser("Rashid Ahmed", "rashid@demo.com", "demo123", Role.CONTRIBUTOR, 156);
        User contributor3 = createUser("Nasir Uddin", "nasir@demo.com", "demo123", Role.CONTRIBUTOR, 89);
        User contributor4 = createUser("Salma Begum", "salma@demo.com", "demo123", Role.CONTRIBUTOR, 67);
        
        // Create demo traffic reports
        createTrafficReport("Heavy Traffic Jam", "Major traffic congestion due to road construction", 
            TrafficCategory.TRAFFIC_JAM, Severity.HIGH, 23.7465, 90.3763, "Dhanmondi 27, Dhaka", contributor, 12, 2);
            
        createTrafficReport("Road Accident", "Minor vehicle collision, one lane blocked", 
            TrafficCategory.ACCIDENT, Severity.MEDIUM, 23.7808, 90.4148, "Gulshan Circle 1, Dhaka", moderator, 8, 0);
            
        createTrafficReport("Road Under Water", "Heavy rain has flooded the street, vehicles struggling", 
            TrafficCategory.FLOODING, Severity.HIGH, 23.7288, 90.3914, "Elephant Road, Dhaka", contributor2, 15, 1);
            
        createTrafficReport("Road Closed for Event", "Street blocked for political rally until 6 PM", 
            TrafficCategory.ROAD_CLOSED, Severity.HIGH, 23.7106, 90.4078, "Motijheel Commercial Area, Dhaka", contributor3, 20, 3);

        createTrafficReport("Police Checkpoint", "Routine police checking causing slow traffic", 
            TrafficCategory.CHECKPOINT, Severity.LOW, 23.727351059985754, 90.3899523071484, "Banani 11, Dhaka", contributor4, 5, 0);
        
        // Create demo forum posts
        createForumPost("Dhaka Traffic: Best Routes During Rush Hour", 
            "I've been tracking traffic patterns for months. Here are some alternative routes that work well during peak hours...", 
            PostCategory.TIPS, contributor, 23, 8);
            
        createForumPost("Monsoon Season Road Safety Tips", 
            "With the rainy season approaching, here are some important safety tips for driving in Dhaka during heavy rainfall...", 
            PostCategory.SAFETY, moderator, 45, 12);
            
        createForumPost("Feature Request: Dark Mode for Night Driving", 
            "Would be great to have a dark mode option for the app, especially useful when driving at night...", 
            PostCategory.FEATURE_REQUEST, contributor2, 18, 5);
    }
    
    private User createUser(String name, String email, String password, Role role, Integer points) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setPoints(points);
        user.setIsActive(true);
        return userRepository.save(user);
    }
    
    private void createTrafficReport(String title, String description, TrafficCategory category, 
                                   Severity severity, Double latitude, Double longitude, String address, 
                                   User user, Integer upvotes, Integer downvotes) {
        TrafficReport report = new TrafficReport();
        report.setTitle(title);
        report.setDescription(description);
        report.setCategory(category);
        report.setSeverity(severity);
        report.setLatitude(latitude);
        report.setLongitude(longitude);
        report.setAddress(address);
        report.setUser(user);
        report.setActive(true);
        report.setVerified(upvotes > 5); // Auto-verify if enough upvotes
        report.setUpvotes(upvotes);
        report.setDownvotes(downvotes);
        trafficReportRepository.save(report);
    }
    
    private void createForumPost(String title, String content, PostCategory category, 
                               User user, Integer likes, Integer replies) {
        ForumPost post = new ForumPost();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setUser(user);
        post.setActive(true);
        post.setLikes(likes);
        post.setReplies(replies);
        forumPostRepository.save(post);
    }
}
