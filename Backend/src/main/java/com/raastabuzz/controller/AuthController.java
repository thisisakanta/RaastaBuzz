package com.raastabuzz.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raastabuzz.dto.request.LoginRequest;
import com.raastabuzz.dto.request.RegisterRequest;
import com.raastabuzz.dto.response.JwtResponse;
import com.raastabuzz.dto.response.MessageResponse;
import com.raastabuzz.model.User;
import com.raastabuzz.security.JwtTokenProvider;
import com.raastabuzz.security.UserPrincipal;
import com.raastabuzz.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserService userService;
    
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);
            
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findById(userPrincipal.getId()).orElse(null);
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getName(),
                userPrincipal.getUsername(),
                user.getRole().name(),
                user.getPoints()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid credentials"));
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            if (userService.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
            }
            
            User user = userService.createUser(signUpRequest);
            
            // Auto login after registration
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword()
                )
            );
            
            String jwt = jwtTokenProvider.generateToken(authentication);
            
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPoints()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Could not create user account"));
        }
    }
}
