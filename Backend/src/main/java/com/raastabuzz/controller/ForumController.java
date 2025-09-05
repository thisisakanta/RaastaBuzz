package com.raastabuzz.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import com.raastabuzz.dto.response.MessageResponse;
import com.raastabuzz.model.ForumPost;
import com.raastabuzz.model.PostCategory;
import com.raastabuzz.model.User;
import com.raastabuzz.security.UserPrincipal;
import com.raastabuzz.service.ForumService;
import com.raastabuzz.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/forum")
public class ForumController {
    
    @Autowired
    private ForumService forumService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getAllPosts() {
        List<ForumPost> posts = forumService.getAllActivePosts();
        //System.out.println(posts);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/posts/category/{category}")
    public ResponseEntity<List<ForumPost>> getPostsByCategory(@PathVariable PostCategory category) {
        List<ForumPost> posts = forumService.getPostsByCategory(category);
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/posts/popular")
    public ResponseEntity<List<ForumPost>> getPopularPosts() {
        List<ForumPost> posts = forumService.getPopularPosts();
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPost> getPostById(@PathVariable Long id) {
        return forumService.getPostById(id)
            .map(post -> ResponseEntity.ok().body(post))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/posts/user/me")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<List<ForumPost>> getMyPosts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userService.findById(userPrincipal.getId())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<ForumPost> posts = forumService.getPostsByUser(user);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping("/posts")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> createPost(
            @Valid @RequestBody ForumPostRequest postRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            ForumPost post = forumService.createPost(
                postRequest.getTitle(),
                postRequest.getContent(),
                postRequest.getCategory(),
                user
            );
            
            // Award points for creating a forum post
            userService.updateUserPoints(user, 3);
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PutMapping("/posts/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody ForumPostRequest postRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            ForumPost post = forumService.updatePost(
                id,
                postRequest.getTitle(),
                postRequest.getContent(),
                postRequest.getCategory(),
                user
            );
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            forumService.deletePost(id, user);
            return ResponseEntity.ok(new MessageResponse("Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/posts/{id}/like")
    @PreAuthorize("hasRole('CONTRIBUTOR') or hasRole('MODERATOR')")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        try {
            ForumPost post = forumService.likePost(id);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Inner class for forum post request
    public static class ForumPostRequest {
        private String title;
        private String content;
        private PostCategory category;
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
        
        public PostCategory getCategory() {
            return category;
        }
        
        public void setCategory(PostCategory category) {
            this.category = category;
        }
    }
}
