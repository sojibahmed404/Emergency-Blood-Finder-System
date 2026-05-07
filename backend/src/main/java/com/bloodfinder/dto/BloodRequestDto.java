package com.bloodfinder.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BloodRequestDto {

    @NotNull
    private Long donorId;

    @NotBlank
    private String message;

    public BloodRequestDto() {}

    public Long getDonorId()         { return donorId; }
    public void setDonorId(Long id)  { this.donorId = id; }

    public String getMessage()           { return message; }
    public void setMessage(String message) { this.message = message; }
}
