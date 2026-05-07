package com.bloodfinder.controller;

import com.bloodfinder.dto.DonorRequest;
import com.bloodfinder.dto.DonorResponse;
import com.bloodfinder.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * REST controller for donor profile management and search.
 *
 * Public:  GET /api/donors, GET /api/donors/search, GET /api/donors/{id}
 * DONOR:   POST /api/donors/profile, GET /api/donors/me
 */
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    /** GET /api/donors — List all donors (public). */
    @GetMapping
    public ResponseEntity<List<DonorResponse>> getAllDonors() {
        return ResponseEntity.ok(donorService.getAllDonors());
    }

    /** GET /api/donors/search?bloodGroup=A%2B&location=Dhaka (public). */
    @GetMapping("/search")
    public ResponseEntity<List<DonorResponse>> searchDonors(
            @RequestParam(required = false) String bloodGroup,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(donorService.searchDonors(bloodGroup, location));
    }

    /** GET /api/donors/me — Get my own donor profile (DONOR only). */
    @GetMapping("/me")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonorResponse> getMyProfile(Principal principal) {
        return ResponseEntity.ok(donorService.getMyProfile(principal.getName()));
    }

    /** GET /api/donors/{id} — Get donor profile by ID (public). */
    @GetMapping("/{id}")
    public ResponseEntity<DonorResponse> getDonorById(@PathVariable Long id) {
        return ResponseEntity.ok(donorService.getDonorById(id));
    }

    /** POST /api/donors/profile — Create or update donor profile (DONOR only). */
    @PostMapping("/profile")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<DonorResponse> saveProfile(
            @Valid @RequestBody DonorRequest req,
            Principal principal) {
        return ResponseEntity.ok(donorService.saveProfile(principal.getName(), req));
    }

    /** POST /api/donors/quick-add — Add donor quickly without full registration (public). */
    @PostMapping("/quick-add")
    public ResponseEntity<DonorResponse> quickAdd(@Valid @RequestBody com.bloodfinder.dto.QuickAddDonorRequest req) {
        return ResponseEntity.ok(donorService.quickAddDonor(req));
    }
}
