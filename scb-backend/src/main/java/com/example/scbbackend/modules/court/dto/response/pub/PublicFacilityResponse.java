package com.example.scbbackend.modules.court.dto.response.pub;

import java.math.BigDecimal;

public record PublicFacilityResponse(
        Long facilityId,
        String facilityName,
        String sportName,
        String address,
        Long totalCourts,
        BigDecimal minPrice,
        BigDecimal maxPrice
) {}
