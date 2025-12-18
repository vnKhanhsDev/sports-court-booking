package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.FacilityStatus;

import java.time.LocalTime;

public record OwnerFacilitySummaryResponse(
        Long id,
        String name,
        LocalTime openingTime,
        LocalTime closingTime,
        FacilityStatus status,
        String address,
        Long totalCourts
) {}
