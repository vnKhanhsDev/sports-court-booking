package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceItemDto;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import lombok.NonNull;

import java.util.List;

public record OwnerCourtDetailResponse(
        @NonNull Long facilityId,
        @NonNull Long sportId,
        @NonNull Long courtTypeId,
        @NonNull Long surfaceTypeId,
        @NonNull String name,
        Long priceTemplateId,
        List<PriceItemDto> items,
        List<CourtImageDto> imageUrls,
        CourtStatus status
) {}
