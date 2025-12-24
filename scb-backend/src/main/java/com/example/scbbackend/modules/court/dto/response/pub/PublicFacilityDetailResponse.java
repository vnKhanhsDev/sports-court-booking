package com.example.scbbackend.modules.court.dto.response.pub;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

public record PublicFacilityDetailResponse(
        Long facilityId,
        String facilityName,
        String facilityDescription,
        String fullAddress,
        Double latitude,
        Double longitude,
        LocalTime openingTime,
        LocalTime closingTime,
        
        Long sportId,
        String sportName,
        
        Long totalCourts,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<String> imageUrls,
        
        List<CourtSummary> courts
) {
    public record CourtSummary(
            Long courtId,
            String courtName,
            String courtTypeName,
            String surfaceTypeName,
            List<String> imageUrls
    ) {}
}

