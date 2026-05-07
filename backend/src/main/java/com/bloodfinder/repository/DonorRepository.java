package com.bloodfinder.repository;

import com.bloodfinder.model.Donor;
import com.bloodfinder.model.Donor.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByUserId(Long userId);

    long countByAvailabilityTrue();

    /**
     * Search donors by optional blood group and optional location (case-insensitive).
     * Passing null for either param disables that filter.
     */
    @Query("""
        SELECT d FROM Donor d
        WHERE (:bloodGroup IS NULL OR d.bloodGroup = :bloodGroup)
          AND (:location   IS NULL OR LOWER(d.location) LIKE LOWER(CONCAT('%', :location, '%')))
        ORDER BY d.availability DESC, d.id ASC
        """)
    List<Donor> searchDonors(@Param("bloodGroup") BloodGroup bloodGroup,
                             @Param("location") String location);
}
