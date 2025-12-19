package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;

import java.util.List;

public record PriceListDetailResponse(
        Long id,
        Long facilityId,
        Long sportId,
        Long courtTypeId,
        Long surfaceTypeId,
        String name,
        String note,
        int version,
        boolean isActive,
        List<PriceSlotDto> slots
) {}
