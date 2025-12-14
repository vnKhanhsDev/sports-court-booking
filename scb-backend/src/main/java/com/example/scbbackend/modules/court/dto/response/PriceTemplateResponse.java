package com.example.scbbackend.modules.court.dto.response;

import lombok.Builder;

@Builder(toBuilder = true)
public record PriceTemplateResponse(
        Long id,
        String facilityName,
        String sportName,
        String name,
        int version,
        boolean isActive
) {}
