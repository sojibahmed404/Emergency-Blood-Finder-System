package com.bloodfinder.service;

import com.bloodfinder.model.Request;
import com.bloodfinder.model.User;
import com.bloodfinder.model.User.UserStatus;
import com.bloodfinder.repository.BloodBankRepository;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.RequestRepository;
import com.bloodfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only operations: view users, block/unblock, delete, stats.
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DonorRepository donorRepository;
    private final RequestRepository requestRepository;
    private final BloodBankRepository bloodBankRepository;

    public AdminService(UserRepository userRepository,
                        DonorRepository donorRepository,
                        RequestRepository requestRepository,
                        BloodBankRepository bloodBankRepository) {
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
        this.requestRepository = requestRepository;
        this.bloodBankRepository = bloodBankRepository;
    }

    /** Return all users. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll()
            .stream().map(this::userToMap).collect(Collectors.toList());
    }

    /** Toggle block / active status of a user. */
    @Transactional
    public Map<String, Object> toggleBlockUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot block an admin account");
        }

        user.setStatus(user.getStatus() == UserStatus.ACTIVE
            ? UserStatus.BLOCKED : UserStatus.ACTIVE);
        userRepository.save(user);
        return Map.of("id", user.getId(), "status", user.getStatus().name());
    }

    /** Permanently delete a user (cascades to donor/requests). */
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot delete an admin account");
        }
        userRepository.delete(user);
    }

    /** Dashboard stats. */
    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        long totalUsers    = userRepository.count();
        long totalDonors   = donorRepository.count();
        long available     = donorRepository.countByAvailabilityTrue();
        long totalReqs     = requestRepository.count();
        long pending       = requestRepository.countByStatus(Request.RequestStatus.PENDING);
        long accepted      = requestRepository.countByStatus(Request.RequestStatus.ACCEPTED);
        long totalBanks    = bloodBankRepository.count();
        long blocked       = userRepository.findAll().stream()
                              .filter(u -> u.getStatus() == UserStatus.BLOCKED).count();

        return Map.of(
            "totalUsers",       totalUsers,
            "totalDonors",      totalDonors,
            "availableDonors",  available,
            "totalRequests",    totalReqs,
            "pendingRequests",  pending,
            "acceptedRequests", accepted,
            "totalBloodBanks",  totalBanks,
            "blockedUsers",     blocked
        );
    }

    // ── Mapper ───────────────────────────────────────────────────────────

    private Map<String, Object> userToMap(User u) {
        return Map.of(
            "id",        u.getId(),
            "name",      u.getName(),
            "email",     u.getEmail(),
            "role",      u.getRole().name(),
            "status",    u.getStatus().name(),
            "createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
        );
    }
}
