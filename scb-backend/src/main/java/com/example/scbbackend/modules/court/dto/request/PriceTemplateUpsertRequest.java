package com.example.scbbackend.modules.court.dto.request;

import com.example.scbbackend.modules.court.dto.shared.PriceTemplateItemDto;
import lombok.NonNull;

import java.util.List;

public record PriceTemplateUpsertRequest(
        Long facilityId,
        Long sportId,
        Long courtTypeId,
        Long surfaceTypeId,
        @NonNull String name,
        String description,
        boolean isActive,
        @NonNull List<PriceTemplateItemDto> items
) {}
