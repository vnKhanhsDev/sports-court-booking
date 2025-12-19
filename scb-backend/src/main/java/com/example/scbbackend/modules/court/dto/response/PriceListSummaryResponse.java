package com.example.scbbackend.modules.court.dto.response;

public record PriceListSummaryResponse(
        Long id,
        String name,
        int version,
        long appliedCourtCount,
        boolean isActive
) {}
