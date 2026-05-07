package com.bloodfinder.service;

import com.bloodfinder.dto.BloodRequestDto;
import com.bloodfinder.model.Donor;
import com.bloodfinder.model.Request;
import com.bloodfinder.model.User;
import com.bloodfinder.repository.DonorRepository;
import com.bloodfinder.repository.RequestRepository;
import com.bloodfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Business logic for blood donation requests.
 */
@Service
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final DonorRepository donorRepository;

    public RequestService(RequestRepository requestRepository,
                          UserRepository userRepository,
                          DonorRepository donorRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.donorRepository = donorRepository;
    }

    /** Create a blood request from a receiver to a donor. */
    @Transactional
    public Map<String, Object> createRequest(String requesterEmail, BloodRequestDto dto) {
        User requester = userRepository.findByEmail(requesterEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Donor donor = donorRepository.findById(dto.getDonorId())
            .orElseThrow(() -> new RuntimeException("Donor not found"));

        Request req = Request.builder()
            .requester(requester)
            .donor(donor)
            .message(dto.getMessage())
            .status(Request.RequestStatus.PENDING)
            .build();

        requestRepository.save(req);
        return toMap(req);
    }

    /** Get all requests made by the current user (receiver). */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyRequests(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByRequesterId(user.getId())
            .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** Get all requests for the current donor to respond to. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRequestsForDonor(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByDonorUserId(user.getId())
            .stream().map(this::toMap).collect(Collectors.toList());
    }

    /** Accept or reject a request (DONOR only). */
    @Transactional
    public Map<String, Object> updateStatus(Long requestId, String status, String donorEmail) {
        Request req = requestRepository.findById(requestId)
            .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!req.getDonor().getUser().getEmail().equals(donorEmail)) {
            throw new RuntimeException("Not authorized to update this request");
        }

        req.setStatus(Request.RequestStatus.valueOf(status.toUpperCase()));
        requestRepository.save(req);
        return toMap(req);
    }

    // ── Mapper ───────────────────────────────────────────────────────────

    private Map<String, Object> toMap(Request r) {
        return Map.of(
            "id",            r.getId(),
            "message",       r.getMessage() != null ? r.getMessage() : "",
            "status",        r.getStatus().name(),
            "createdAt",     r.getCreatedAt() != null ? r.getCreatedAt().toString() : "",
            "requesterName", r.getRequester().getName(),
            "requesterEmail",r.getRequester().getEmail(),
            "donorName",     r.getDonor().getUser().getName(),
            "donorId",       r.getDonor().getId(),
            "bloodGroup",    r.getDonor().getBloodGroup().getLabel()
        );
    }
}
