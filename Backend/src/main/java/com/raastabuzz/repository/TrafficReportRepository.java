package com.raastabuzz.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.raastabuzz.model.Severity;
import com.raastabuzz.model.TrafficCategory;
import com.raastabuzz.model.TrafficReport;
import com.raastabuzz.model.User;

@Repository
public interface TrafficReportRepository extends JpaRepository<TrafficReport, Long> {
    
    List<TrafficReport> findByActiveTrue();
    
    Page<TrafficReport> findByActiveTrue(Pageable pageable);
    
    List<TrafficReport> findByActiveTrueOrderByCreatedAtDesc();
    
    List<TrafficReport> findByCategory(TrafficCategory category);
    
    List<TrafficReport> findBySeverity(Severity severity);
    
    List<TrafficReport> findByUser(User user);
    
    List<TrafficReport> findByVerifiedTrue();
    
    @Query("SELECT tr FROM TrafficReport tr WHERE tr.active = true AND " +
           "tr.latitude BETWEEN :minLat AND :maxLat AND " +
           "tr.longitude BETWEEN :minLng AND :maxLng")
    List<TrafficReport> findReportsInArea(@Param("minLat") Double minLat, 
                                         @Param("maxLat") Double maxLat,
                                         @Param("minLng") Double minLng, 
                                         @Param("maxLng") Double maxLng);
    
    @Query("SELECT tr FROM TrafficReport tr WHERE tr.active = true AND " +
           "tr.createdAt >= :since ORDER BY tr.createdAt DESC")
    List<TrafficReport> findRecentReports(@Param("since") LocalDateTime since);
    
    @Query("SELECT tr FROM TrafficReport tr WHERE tr.active = true AND " +
           "tr.category = :category AND tr.createdAt >= :since")
    List<TrafficReport> findRecentReportsByCategory(@Param("category") TrafficCategory category,
                                                   @Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(tr) FROM TrafficReport tr WHERE tr.user = :user AND tr.active = true")
    Long countActiveReportsByUser(@Param("user") User user);
    
    @Query("SELECT COUNT(tr) FROM TrafficReport tr WHERE tr.user = :user AND tr.verified = true")
    Long countVerifiedReportsByUser(@Param("user") User user);
}
