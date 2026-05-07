package com.bloodfinder.controller;

import com.bloodfinder.dto.BloodBankRequest;
import com.bloodfinder.dto.BloodBankResponse;
import com.bloodfinder.service.BloodBankService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for Blood Bank management.
 *
 * Public:  GET /api/bloodbanks, GET /api/bloodbanks/{id}
 * ADMIN:   POST, PUT, DELETE /api/bloodbanks/**
 */
@RestController
@RequestMapping("/api/bloodbanks")
public class BloodBankController {

    private final BloodBankService bloodBankService;

    public BloodBankController(BloodBankService bloodBankService) {
        this.bloodBankService = bloodBankService;
    }

    /** GET /api/bloodbanks — List all blood banks (public). */
    @GetMapping
    public ResponseEntity<List<BloodBankResponse>> getAllBloodBanks(
            @RequestParam(required = false) String location) {
        if (location != null && !location.isBlank()) {
            return ResponseEntity.ok(bloodBankService.searchByLocation(location));
        }
        return ResponseEntity.ok(bloodBankService.getAllBloodBanks());
    }

    /** GET /api/bloodbanks/{id} — Get a blood bank by ID (public). */
    @GetMapping("/{id}")
    public ResponseEntity<BloodBankResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bloodBankService.getById(id));
    }

    /** POST /api/bloodbanks — Create a blood bank (ADMIN only). */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodBankResponse> create(@Valid @RequestBody BloodBankRequest req) {
        return ResponseEntity.ok(bloodBankService.create(req));
    }

    /** PUT /api/bloodbanks/{id} — Update a blood bank (ADMIN only). */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BloodBankResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody BloodBankRequest req) {
        return ResponseEntity.ok(bloodBankService.update(id, req));
    }

    /** DELETE /api/bloodbanks/{id} — Delete a blood bank (ADMIN only). */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        bloodBankService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Blood bank deleted successfully"));
    }
}
