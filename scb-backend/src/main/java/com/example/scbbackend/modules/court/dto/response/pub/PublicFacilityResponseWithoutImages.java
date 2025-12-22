package com.example.scbbackend.modules.court.dto.response.pub;

import java.math.BigDecimal;

/**
 * Intermediate DTO for JPQL query construction
 * Used internally to construct PublicFacilityResponse with images
 */
public record PublicFacilityResponseWithoutImages(
        Long facilityId,
        Long sportId,
        String facilityName,
        String sportName,
        String address,
        Long totalCourts,
        BigDecimal minPrice,
        BigDecimal maxPrice
) {}

