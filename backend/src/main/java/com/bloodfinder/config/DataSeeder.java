package com.bloodfinder.config;

import com.bloodfinder.model.User;
import com.bloodfinder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== RESETTING ALL PASSWORDS ======");
        
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            // Do not reset manual_ NO_LOGIN_MANUAL_ENTRY users
            if (user.getEmail().startsWith("manual_") || user.getPassword().equals("NO_LOGIN_MANUAL_ENTRY")) {
                continue;
            }

            if (user.getRole() == User.Role.ADMIN) {
                user.setPassword(passwordEncoder.encode("admin123"));
            } else {
                user.setPassword(passwordEncoder.encode("donor123"));
            }
            userRepository.save(user);
        }
        
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
            System.out.println("====== Default admin user created ======");
        }
        
        System.out.println("====== ALL PASSWORDS RESET SUCCESSFULLY ======");
        System.out.println("Admin password: admin123");
        System.out.println("All donors password: donor123");
    }
}
