package com.raastabuzz.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raastabuzz.dto.request.TrafficReportRequest;
import com.raastabuzz.model.Severity;
import com.raastabuzz.model.TrafficCategory;
import com.raastabuzz.model.TrafficReport;
import com.raastabuzz.model.User;
import com.raastabuzz.model.Vote;
import com.raastabuzz.model.VoteType;
import com.raastabuzz.repository.TrafficReportRepository;
import com.raastabuzz.repository.VoteRepository;
import org.springframework.web.bind.annotation.RestController;

@Service
@Transactional
@RequiredArgsConstructor
@RestController
public class TrafficReportService {

    @Autowired
    private TrafficReportRepository trafficReportRepository;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;  // Add this for WebSocket broadcasting

    public List<TrafficReport> getAllActiveReports() {
        return trafficReportRepository.findByActiveTrueOrderByCreatedAtDesc();
    }

    public Page<TrafficReport> getAllActiveReports(Pageable pageable) {
        return trafficReportRepository.findByActiveTrue(pageable);
    }

    public Optional<TrafficReport> getReportById(Long id) {
        return trafficReportRepository.findById(id);
    }

    public List<TrafficReport> getReportsByCategory(TrafficCategory category) {
        return trafficReportRepository.findByCategory(category);
    }

    public List<TrafficReport> getReportsBySeverity(Severity severity) {
        return trafficReportRepository.findBySeverity(severity);
    }

    public List<TrafficReport> getReportsByUser(User user) {
        return trafficReportRepository.findByUser(user);
    }

    public List<TrafficReport> getReportsInArea(Double minLat, Double maxLat,
                                                Double minLng, Double maxLng) {
        return trafficReportRepository.findReportsInArea(minLat, maxLat, minLng, maxLng);
    }

    public List<TrafficReport> getRecentReports(LocalDateTime since) {
        return trafficReportRepository.findRecentReports(since);
    }

    public TrafficReport createReport(TrafficReportRequest request, User user) {
        TrafficReport report = new TrafficReport();
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setCategory(request.getCategory());
        report.setSeverity(request.getSeverity());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setAddress(request.getAddress());
        report.setImageUrl(request.getImageUrl());
        report.setUser(user);
        report.setActive(true);
        report.setVerified(false);
        report.setUpvotes(0);
        report.setDownvotes(0);

        TrafficReport savedReport = trafficReportRepository.save(report);
        messagingTemplate.convertAndSend("/topic/reports", savedReport);  // Broadcast the new report
        return savedReport;
    }

    public TrafficReport updateReport(Long id, TrafficReportRequest request, User user) {
        TrafficReport report = trafficReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Traffic report not found with id: " + id));

        // Check if user owns the report or is moderator
        if (!report.getUser().getId().equals(user.getId()) &&
                !user.getRole().name().equals("MODERATOR")) {
            throw new RuntimeException("You don't have permission to update this report");
        }

        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setCategory(request.getCategory());
        report.setSeverity(request.getSeverity());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setAddress(request.getAddress());
        report.setImageUrl(request.getImageUrl());

        TrafficReport savedReport = trafficReportRepository.save(report);
        messagingTemplate.convertAndSend("/topic/reports", savedReport);  // Broadcast the updated report
        return savedReport;
    }

    public void deleteReport(Long id, User user) {
        TrafficReport report = trafficReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Traffic report not found with id: " + id));

        // Check if user owns the report or is moderator
        if (!report.getUser().getId().equals(user.getId()) &&
                !user.getRole().name().equals("MODERATOR")) {
            throw new RuntimeException("You don't have permission to delete this report");
        }

        report.setActive(false);
        TrafficReport savedReport = trafficReportRepository.save(report);
        messagingTemplate.convertAndSend("/topic/reports", savedReport);  // Broadcast the deactivated report
    }

    public TrafficReport voteOnReport(Long reportId, VoteType voteType, User user) {
        TrafficReport report = trafficReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Traffic report not found with id: " + reportId));

        // Check if user already voted on this report
        Optional<Vote> existingVote = voteRepository.findByUserAndTrafficReport(user, report);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            VoteType oldVoteType = vote.getType();

            // Update the vote
            vote.setType(voteType);
            voteRepository.save(vote);

            // Update report counts
            updateVoteCounts(report, oldVoteType, voteType);
        } else {
            // Create new vote
            Vote vote = new Vote();
            vote.setTrafficReport(report);
            vote.setUser(user);
            vote.setType(voteType);
            voteRepository.save(vote);

            // Update report counts
            if (voteType == VoteType.UPVOTE) {
                report.setUpvotes(report.getUpvotes() + 1);
            } else {
                report.setDownvotes(report.getDownvotes() + 1);
            }
        }

        TrafficReport savedReport = trafficReportRepository.save(report);
        messagingTemplate.convertAndSend("/topic/reports", savedReport);  // Broadcast the updated report with new votes
        return savedReport;
    }

    private void updateVoteCounts(TrafficReport report, VoteType oldVoteType, VoteType newVoteType) {
        // Remove old vote count
        if (oldVoteType == VoteType.UPVOTE) {
            report.setUpvotes(Math.max(0, report.getUpvotes() - 1));
        } else {
            report.setDownvotes(Math.max(0, report.getDownvotes() - 1));
        }

        // Add new vote count
        if (newVoteType == VoteType.UPVOTE) {
            report.setUpvotes(report.getUpvotes() + 1);
        } else {
            report.setDownvotes(report.getDownvotes() + 1);
        }
    }

    public Long getActiveReportsCountByUser(User user) {
        return trafficReportRepository.countActiveReportsByUser(user);
    }

    public Long getVerifiedReportsCountByUser(User user) {
        return trafficReportRepository.countVerifiedReportsByUser(user);
    }
}