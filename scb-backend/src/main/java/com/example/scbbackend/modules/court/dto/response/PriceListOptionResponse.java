package com.example.scbbackend.modules.court.dto.response;

public record PriceListOptionResponse(
        Long id,
        Long facilityId,
        Long sportId,
        Long courtTypeId,
        Long surfaceTypeId,
        String name
) {}
