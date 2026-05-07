package com.bloodfinder.controller;

import com.bloodfinder.dto.BloodRequestDto;
import com.bloodfinder.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * REST controller for blood donation requests.
 *
 * POST /api/requests                  — Receiver creates a request
 * GET  /api/requests/mine             — Get my sent requests (Receiver)
 * GET  /api/requests/incoming         — Get requests for me as Donor
 * PUT  /api/requests/{id}/status      — Donor accepts/rejects
 */
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    /** POST /api/requests */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRequest(
            @Valid @RequestBody BloodRequestDto dto,
            Principal principal) {
        return ResponseEntity.ok(requestService.createRequest(principal.getName(), dto));
    }

    /** GET /api/requests/mine */
    @GetMapping("/mine")
    public ResponseEntity<List<Map<String, Object>>> getMyRequests(Principal principal) {
        return ResponseEntity.ok(requestService.getMyRequests(principal.getName()));
    }

    /** GET /api/requests/incoming */
    @GetMapping("/incoming")
    public ResponseEntity<List<Map<String, Object>>> getIncomingRequests(Principal principal) {
        return ResponseEntity.ok(requestService.getRequestsForDonor(principal.getName()));
    }

    /** PUT /api/requests/{id}/status */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Principal principal) {
        return ResponseEntity.ok(requestService.updateStatus(id, status, principal.getName()));
    }
}
