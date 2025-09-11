package com.raastabuzz.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.raastabuzz.model.ForumComment;
import com.raastabuzz.model.ForumPost;
import com.raastabuzz.model.PostCategory;
import com.raastabuzz.model.User;
import com.raastabuzz.repository.ForumCommentRepository;
import com.raastabuzz.repository.ForumPostRepository;

@Service
@Transactional
public class ForumService {
    
    @Autowired
    private ForumPostRepository forumPostRepository;
    
    @Autowired
    private ForumCommentRepository forumCommentRepository;
    
    public List<ForumPost> getAllActivePosts() {
        return forumPostRepository.findByActiveTrueOrderByCreatedAtDesc();
    }
    
    public List<ForumPost> getPostsByCategory(PostCategory category) {
        return forumPostRepository.findByActiveTrueAndCategoryOrderByCreatedAtDesc(category);
    }
    
    public List<ForumPost> getPostsByUser(User user) {
        return forumPostRepository.findByUser(user);
    }
    
    public List<ForumPost> getPopularPosts() {
        return forumPostRepository.findPopularPosts();
    }
    
    public Optional<ForumPost> getPostById(Long id) {
        return forumPostRepository.findById(id);
    }
    
    public ForumPost createPost(String title, String content, PostCategory category, User user) {
        ForumPost post = new ForumPost();
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        post.setUser(user);
        post.setActive(true);
        post.setLikes(0);
        post.setReplies(0);
        
        return forumPostRepository.save(post);
    }
    
    public ForumPost updatePost(Long id, String title, String content, PostCategory category, User user) {
        ForumPost post = forumPostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Forum post not found with id: " + id));
        
        // Check if user owns the post or is moderator
        if (!post.getUser().getId().equals(user.getId()) && 
            !user.getRole().name().equals("MODERATOR")) {
            throw new RuntimeException("You don't have permission to update this post");
        }
        
        post.setTitle(title);
        post.setContent(content);
        post.setCategory(category);
        
        return forumPostRepository.save(post);
    }
    
    public void deletePost(Long id, User user) {
        ForumPost post = forumPostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Forum post not found with id: " + id));
        
        // Check if user owns the post or is moderator
        if (!post.getUser().getId().equals(user.getId()) && 
            !user.getRole().name().equals("MODERATOR")) {
            throw new RuntimeException("You don't have permission to delete this post");
        }
        
        post.setActive(false);
        forumPostRepository.save(post);
    }
    
    public ForumPost likePost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Forum post not found with id: " + postId));
        
        post.setLikes(post.getLikes() + 1);
        return forumPostRepository.save(post);
    }
    
    public List<ForumComment> getCommentsForPost(Long postId) {
        ForumPost post = forumPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Forum post not found with id: " + postId));
        return forumCommentRepository.findByPostOrderByCreatedAtAsc(post);
    }
    
    public ForumComment addComment(Long postId, String content, User user) {
        ForumPost post = forumPostRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Forum post not found with id: " + postId));
        ForumComment comment = new ForumComment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        ForumComment saved = forumCommentRepository.save(comment);
        post.setReplies(post.getReplies() + 1);
        forumPostRepository.save(post);
        return saved;
    }
    
    public Long getActivePostsCountByUser(User user) {
        return forumPostRepository.countActivePostsByUser(user);
    }
}
