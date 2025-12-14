package com.example.scbbackend.modules.court.dto.response;

import lombok.Builder;

import java.util.List;

@Builder(toBuilder = true)
public record PriceTemplateDetailResponse(
        Long id,
        String facilityName,
        String sportName,
        String name,
        int version,
        boolean isActive,
        List<PriceTemplateItemResponse> items
) {}
