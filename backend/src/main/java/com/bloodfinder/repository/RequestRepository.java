package com.bloodfinder.repository;

import com.bloodfinder.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByRequesterId(Long requesterId);

    List<Request> findByDonorUserId(Long donorUserId);

    long countByStatus(Request.RequestStatus status);
}
