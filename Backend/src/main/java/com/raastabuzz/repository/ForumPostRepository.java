package com.raastabuzz.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.raastabuzz.model.ForumPost;
import com.raastabuzz.model.PostCategory;
import com.raastabuzz.model.User;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    
    List<ForumPost> findByActiveTrueOrderByCreatedAtDesc();
    
    List<ForumPost> findByCategory(PostCategory category);
    
    List<ForumPost> findByUser(User user);
    
    List<ForumPost> findByActiveTrueAndCategoryOrderByCreatedAtDesc(PostCategory category);
    
    @Query("SELECT fp FROM ForumPost fp WHERE fp.active = true ORDER BY fp.likes DESC, fp.createdAt DESC")
    List<ForumPost> findPopularPosts();
    
    @Query("SELECT COUNT(fp) FROM ForumPost fp WHERE fp.user = :user AND fp.active = true")
    Long countActivePostsByUser(@Param("user") User user);
}
