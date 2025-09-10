package com.raastabuzz.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.raastabuzz.dto.request.TrafficReportRequest;
import com.raastabuzz.dto.request.VoteRequest;
import com.raastabuzz.dto.response.MessageResponse;
import com.raastabuzz.model.Severity;
import com.raastabuzz.model.TrafficCategory;
import com.raastabuzz.model.TrafficReport;
import com.raastabuzz.model.User;
import com.raastabuzz.repository.TrafficReportRepository;
import com.raastabuzz.security.UserPrincipal;
import com.raastabuzz.service.FirebaseStorageService;
import com.raastabuzz.service.TrafficReportService;
import com.raastabuzz.service.UserService;

import jakarta.validation.Valid;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/traffic-reports")
public class TrafficReportController {


    private final TrafficReportService trafficReportService;

    private final UserService userService;

    private final FirebaseStorageService firebaseStorageService;

    private final TrafficReportRepository trafficReportRepository;
    public TrafficReportController(
            TrafficReportService trafficReportService,
            UserService userService,
            FirebaseStorageService firebaseStorageService,
            TrafficReportRepository trafficReportRepository
    ) {
        this.trafficReportService = trafficReportService;
        this.userService = userService;
        this.firebaseStorageService = firebaseStorageService;
        this.trafficReportRepository = trafficReportRepository;
    }
    
    @GetMapping
    public ResponseEntity<List<TrafficReport>> getAllReports() {
        List<TrafficReport> reports = trafficReportService.getAllActiveReports();

        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<Page<TrafficReport>> getAllReportsPaginated(Pageable pageable) {
        Page<TrafficReport> reports = trafficReportService.getAllActiveReports(pageable);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TrafficReport> getReportById(@PathVariable Long id) {
        return trafficReportService.getReportById(id)
            .map(report -> ResponseEntity.ok().body(report))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<TrafficReport>> getReportsByCategory(@PathVariable TrafficCategory category) {
        List<TrafficReport> reports = trafficReportService.getReportsByCategory(category);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<TrafficReport>> getReportsBySeverity(@PathVariable Severity severity) {
        List<TrafficReport> reports = trafficReportService.getReportsBySeverity(severity);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/area")
    public ResponseEntity<List<TrafficReport>> getReportsInArea(
            @RequestParam Double minLat,
            @RequestParam Double maxLat,
            @RequestParam Double minLng,
            @RequestParam Double maxLng) {
        List<TrafficReport> reports = trafficReportService.getReportsInArea(minLat, maxLat, minLng, maxLng);
        return ResponseEntity.ok(reports);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<TrafficReport>> getRecentReports(
            @RequestParam(defaultValue = "24") int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        List<TrafficReport> reports = trafficReportService.getRecentReports(since);
        return ResponseEntity.ok(reports);
    }
    
    @PostMapping
    public ResponseEntity<?> createReport(
            @Valid @RequestBody TrafficReportRequest reportRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            TrafficReport report = trafficReportService.createReport(reportRequest, user);
            
            // Award points for creating a report
            userService.updateUserPoints(user, 5);
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody TrafficReportRequest reportRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            TrafficReport report = trafficReportService.updateReport(id, reportRequest, user);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> deleteReport(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            trafficReportService.deleteReport(id, user);
            return ResponseEntity.ok(new MessageResponse("Report deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/vote")
    public ResponseEntity<?> voteOnReport(
            @PathVariable Long id,
            @Valid @RequestBody VoteRequest voteRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            TrafficReport report = trafficReportService.voteOnReport(id, voteRequest.getVoteType(), user);
            
            // Award points for voting
            userService.updateUserPoints(user, 1);
            
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{reportId}/image")
    public ResponseEntity<?> uploadReportImage(
            @PathVariable Long reportId,
            @RequestParam("file") MultipartFile file) {
        Optional<TrafficReport> optionalReport = trafficReportRepository.findById(reportId);
        if (optionalReport.isEmpty()) {
            return ResponseEntity.badRequest().body("Traffic report not found");
        }
        try {
            String imageUrl = firebaseStorageService.uploadReportImage(file, reportId);

            TrafficReport report = optionalReport.get();
            report.setImageUrl(imageUrl);
            trafficReportRepository.save(report);

            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "Image uploaded successfully", "imageUrl", imageUrl)
            );
        } catch (Exception e) {

            return ResponseEntity.internalServerError().body("Failed to upload image");
        }
    }
    
    @GetMapping("/{reportId}/image")
    public ResponseEntity<?> getTrafficReportImage(@PathVariable Long reportId) {
        Optional<TrafficReport> optionalReport = trafficReportRepository.findById(reportId);
        if (optionalReport.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Traffic report not found"));
        }
        TrafficReport report = optionalReport.get();
        return ResponseEntity.ok(Map.of(
            "reportId", report.getId(),
            "imageUrl", report.getImageUrl(),
            "hasImage", report.getImageUrl() != null && !report.getImageUrl().isEmpty()
        ));
    }
}
