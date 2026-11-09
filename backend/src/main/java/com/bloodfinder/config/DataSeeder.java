package com.bloodfinder.config;

import com.bloodfinder.model.User;
import com.bloodfinder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure admin user exists if it was deleted
        if (!userRepository.existsByEmail("admin@bloodfinder.com")) {
            User admin = User.builder()
                .name("Admin")
                .email("admin@bloodfinder.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN)
                .status(User.UserStatus.ACTIVE)
                .build();
            userRepository.save(admin);
            System.out.println("Default admin user created");
        }
    }
}
