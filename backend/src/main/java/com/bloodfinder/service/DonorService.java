package com.bloodfinder.service;

import com.bloodfinder.dto.DonorRequest;
import com.bloodfinder.dto.DonorResponse;
import com.bloodfinder.model.Donor;
import com.bloodfinder.model.Donor.BloodGroup;
import com.bloodfinder.model.User;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for creating, updating, and searching donor profiles.
 */
@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final UserRepository userRepository;

    public DonorService(DonorRepository donorRepository, UserRepository userRepository) {
        this.donorRepository = donorRepository;
        this.userRepository = userRepository;
    }

    /** Create or update the donor profile for the authenticated user. */
    @Transactional
    public DonorResponse saveProfile(String email, DonorRequest req) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != User.Role.DONOR) {
            throw new RuntimeException("Only DONOR role can create a donor profile");
        }

        Donor donor = donorRepository.findByUserId(user.getId())
            .orElseGet(() -> Donor.builder().user(user).build());

        donor.setBloodGroup(BloodGroup.fromLabel(req.getBloodGroup()));
        donor.setLocation(req.getLocation());
        donor.setPhone(req.getPhone());
        donor.setAvailability(req.getAvailability() != null ? req.getAvailability() : true);
        if (req.getLastDonated() != null && !req.getLastDonated().isBlank()) {
            donor.setLastDonated(LocalDate.parse(req.getLastDonated()));
        }

        donorRepository.save(donor);
        return toResponse(donor);
    }

    /** Get my own donor profile. */
    @Transactional(readOnly = true)
    public DonorResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Donor donor = donorRepository.findByUserId(user.getId())
            .orElseThrow(() -> new RuntimeException("Donor profile not found"));
        return toResponse(donor);
    }

    /** Get all donors (admin / public listing). */
    @Transactional(readOnly = true)
    public List<DonorResponse> getAllDonors() {
        return donorRepository.findAll()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get a single donor by donor ID. */
    @Transactional(readOnly = true)
    public DonorResponse getDonorById(Long id) {
        Donor donor = donorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Donor not found with id: " + id));
        return toResponse(donor);
    }

    /**
     * Search donors by blood group label (e.g. "A+") and/or location.
     * Both params are optional — passing null means "no filter".
     */
    @Transactional(readOnly = true)
    public List<DonorResponse> searchDonors(String bloodGroupLabel, String location) {
        BloodGroup bg = null;
        if (bloodGroupLabel != null && !bloodGroupLabel.isBlank()) {
            bg = BloodGroup.fromLabel(bloodGroupLabel);
        }
        String loc = (location != null && !location.isBlank()) ? location : null;

        return donorRepository.searchDonors(bg, loc)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Add a donor quickly without full user registration (manual entry). */
    @Transactional
    public DonorResponse quickAddDonor(com.bloodfinder.dto.QuickAddDonorRequest req) {
        String emailToUse = req.getEmail();
        if (emailToUse == null || emailToUse.isBlank()) {
            emailToUse = "manual_" + System.currentTimeMillis() + "@bloodfinder.local";
        } else if (userRepository.findByEmail(emailToUse).isPresent()) {
            throw new RuntimeException("Email already exists: " + emailToUse);
        }
        
        User user = User.builder()
            .name(req.getName())
            .email(emailToUse)
            .password("NO_LOGIN_MANUAL_ENTRY")
            .role(User.Role.DONOR)
            .status(User.UserStatus.ACTIVE)
            .build();
        userRepository.save(user);

        Donor donor = Donor.builder()
            .user(user)
            .bloodGroup(BloodGroup.fromLabel(req.getBloodGroup()))
            .location(req.getLocation())
            .phone(req.getPhone())
            .availability(true)
            .build();
        donorRepository.save(donor);
        
        return toResponse(donor);
    }

    // ── Mapper ───────────────────────────────────────────────────────────

    private DonorResponse toResponse(Donor d) {
        return DonorResponse.builder()
            .id(d.getId())
            .userId(d.getUser().getId())
            .name(d.getUser().getName())
            .email(d.getUser().getEmail())
            .bloodGroup(d.getBloodGroup().getLabel())
            .location(d.getLocation())
            .phone(d.getPhone())
            .availability(d.getAvailability())
            .lastDonated(d.getLastDonated() != null ? d.getLastDonated().toString() : null)
            .status(d.getUser().getStatus().name())
            .build();
    }
}
