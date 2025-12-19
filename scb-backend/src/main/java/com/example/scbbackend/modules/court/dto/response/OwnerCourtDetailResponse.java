package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import lombok.NonNull;

import java.util.List;

public record OwnerCourtDetailResponse(
        @NonNull Long facilityId,
        @NonNull Long sportId,
        @NonNull Long courtTypeId,
        @NonNull Long surfaceTypeId,
        @NonNull String name,
        Long priceListId,
        List<PriceSlotDto> slots,
        List<CourtImageDto> imageUrls,
        CourtStatus status
) {}
