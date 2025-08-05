package com.raastabuzz.repository;

import com.raastabuzz.model.Vote;
import com.raastabuzz.model.VoteType;
import com.raastabuzz.model.User;
import com.raastabuzz.model.TrafficReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    Optional<Vote> findByUserAndTrafficReport(User user, TrafficReport trafficReport);
    
    List<Vote> findByTrafficReport(TrafficReport trafficReport);
    
    List<Vote> findByUser(User user);
    
    List<Vote> findByType(VoteType type);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.trafficReport = :trafficReport AND v.type = :voteType")
    Long countVotesByTypeAndReport(@Param("trafficReport") TrafficReport trafficReport, 
                                  @Param("voteType") VoteType voteType);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.user = :user AND v.type = :voteType")
    Long countVotesByUserAndType(@Param("user") User user, @Param("voteType") VoteType voteType);
    
    Boolean existsByUserAndTrafficReport(User user, TrafficReport trafficReport);
}
