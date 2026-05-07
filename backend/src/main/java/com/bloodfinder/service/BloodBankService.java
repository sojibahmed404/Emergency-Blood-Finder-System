package com.bloodfinder.service;

import com.bloodfinder.dto.BloodBankRequest;
import com.bloodfinder.dto.BloodBankResponse;
import com.bloodfinder.model.BloodBank;
import com.bloodfinder.repository.BloodBankRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Business logic for Blood Bank CRUD operations.
 */
@Service
public class BloodBankService {

    private final BloodBankRepository bloodBankRepository;

    public BloodBankService(BloodBankRepository bloodBankRepository) {
        this.bloodBankRepository = bloodBankRepository;
    }

    /** Get all blood banks. */
    @Transactional(readOnly = true)
    public List<BloodBankResponse> getAllBloodBanks() {
        return bloodBankRepository.findAll()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get all blood banks filtered by location. */
    @Transactional(readOnly = true)
    public List<BloodBankResponse> searchByLocation(String location) {
        String loc = (location != null && !location.isBlank()) ? location : null;
        return bloodBankRepository.searchByLocation(loc)
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** Get a single blood bank by ID. */
    @Transactional(readOnly = true)
    public BloodBankResponse getById(Long id) {
        BloodBank bank = bloodBankRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blood bank not found: " + id));
        return toResponse(bank);
    }

    /** Create a new blood bank (ADMIN only). */
    @Transactional
    public BloodBankResponse create(BloodBankRequest req) {
        BloodBank bank = BloodBank.builder()
            .name(req.getName())
            .location(req.getLocation())
            .contact(req.getContact())
            .description(req.getDescription())
            .build();
        bloodBankRepository.save(bank);
        return toResponse(bank);
    }

    /** Update an existing blood bank (ADMIN only). */
    @Transactional
    public BloodBankResponse update(Long id, BloodBankRequest req) {
        BloodBank bank = bloodBankRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blood bank not found: " + id));
        bank.setName(req.getName());
        bank.setLocation(req.getLocation());
        bank.setContact(req.getContact());
        bank.setDescription(req.getDescription());
        bloodBankRepository.save(bank);
        return toResponse(bank);
    }

    /** Delete a blood bank (ADMIN only). */
    @Transactional
    public void delete(Long id) {
        BloodBank bank = bloodBankRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Blood bank not found: " + id));
        bloodBankRepository.delete(bank);
    }

    // ── Mapper ───────────────────────────────────────────────────────────

    private BloodBankResponse toResponse(BloodBank b) {
        return BloodBankResponse.builder()
            .id(b.getId())
            .name(b.getName())
            .location(b.getLocation())
            .contact(b.getContact())
            .description(b.getDescription())
            .createdAt(b.getCreatedAt() != null ? b.getCreatedAt().toString() : null)
            .build();
    }
}
