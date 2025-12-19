package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.FacilityStatus;

public record AdminFacilitySummaryResponse(
        Long id,
        String name,
        String ownerEmail,
        FacilityStatus status,
        Long totalCourts
) {}
