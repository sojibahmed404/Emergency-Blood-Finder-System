package com.bloodfinder.repository;

import com.bloodfinder.model.BloodBank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BloodBankRepository extends JpaRepository<BloodBank, Long> {

    @Query("""
        SELECT b FROM BloodBank b
        WHERE (:location IS NULL OR LOWER(b.location) LIKE LOWER(CONCAT('%', :location, '%')))
        ORDER BY b.name ASC
        """)
    List<BloodBank> searchByLocation(@Param("location") String location);
}
