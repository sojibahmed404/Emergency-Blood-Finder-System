package com.bloodfinder.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Request() {}

    public Request(Long id, User requester, Donor donor, String message, RequestStatus status, LocalDateTime createdAt) {
        this.id = id; this.requester = requester; this.donor = donor;
        this.message = message;
        this.status = status != null ? status : RequestStatus.PENDING;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User requester;
        private Donor donor;
        private String message;
        private RequestStatus status = RequestStatus.PENDING;

        public Builder id(Long id)                  { this.id = id; return this; }
        public Builder requester(User r)            { this.requester = r; return this; }
        public Builder donor(Donor d)               { this.donor = d; return this; }
        public Builder message(String m)            { this.message = m; return this; }
        public Builder status(RequestStatus s)      { this.status = s; return this; }
        public Request build() { return new Request(id, requester, donor, message, status, null); }
    }

    public enum RequestStatus { PENDING, ACCEPTED, REJECTED }
}
