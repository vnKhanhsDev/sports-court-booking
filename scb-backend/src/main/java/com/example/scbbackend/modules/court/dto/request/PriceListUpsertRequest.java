package com.example.scbbackend.modules.court.dto.request;

import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import lombok.NonNull;

import java.util.List;

public record PriceListUpsertRequest(
        Long facilityId,
        Long sportId,
        Long courtTypeId,
        Long surfaceTypeId,
        @NonNull String name,
        String note,
        boolean isActive,
        @NonNull List<PriceSlotDto> slots
) {
}
