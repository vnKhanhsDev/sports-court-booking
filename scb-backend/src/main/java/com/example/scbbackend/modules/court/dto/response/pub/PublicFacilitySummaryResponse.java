package com.example.scbbackend.modules.court.dto.response.pub;

import java.math.BigDecimal;
import java.util.List;

public record PublicFacilitySummaryResponse(
        Long facilityId,
        String facilityName,
        Long sportId,
        String sportName,
        String address,
        Long totalCourts,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        List<String> imageUrls
) {}
