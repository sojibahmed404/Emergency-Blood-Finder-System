package com.bloodfinder.service;

import com.bloodfinder.dto.AuthRequest;
import com.bloodfinder.dto.AuthResponse;
import com.bloodfinder.dto.RegisterRequest;
import com.bloodfinder.model.User;
import com.bloodfinder.model.User.Role;
import com.bloodfinder.model.Donor;
import com.bloodfinder.repository.UserRepository;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles user registration and login.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       DonorRepository donorRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.passwordEncoder = passwordEncoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Register a new DONOR or RECEIVER.
     * Returns an AuthResponse with JWT so the user is immediately logged in.
     */
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered: " + req.getEmail());
        }

        Role role = "DONOR".equalsIgnoreCase(req.getRole()) ? Role.DONOR : Role.RECEIVER;

        if (role == Role.DONOR && (req.getBloodGroup() == null || req.getBloodGroup().isBlank())) {
            throw new RuntimeException("Blood group is required for donors");
        }

        User user = User.builder()
            .name(req.getName())
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(role)
            .status(User.UserStatus.ACTIVE)
            .build();

        userRepository.save(user);

        if (role == Role.DONOR) {
            Donor donor = Donor.builder()
                .user(user)
                .bloodGroup(Donor.BloodGroup.fromLabel(req.getBloodGroup()))
                .location(req.getLocation())
                .phone(req.getPhone())
                .availability(true)
                .build();
            donorRepository.save(donor);
        }

        String token = jwtUtil.generateTokenFromEmail(user.getEmail());
        return buildResponse(user, token);
    }

    /**
     * Authenticate user credentials and return JWT.
     */
    public AuthResponse login(AuthRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        String token = jwtUtil.generateToken(auth);

        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
            .token(token)
            .type("Bearer")
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole().name())
            .build();
    }
}
