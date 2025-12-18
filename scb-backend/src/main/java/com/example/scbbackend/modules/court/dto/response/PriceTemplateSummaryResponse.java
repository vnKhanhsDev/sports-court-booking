package com.example.scbbackend.modules.court.dto.response;

public record PriceTemplateSummaryResponse(
        Long id,
        String name,
        int version,
        long appliedCourtCount,
        boolean isActive
) {}
