package com.example.scbbackend.modules.court.dto.request;

import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import lombok.NonNull;

import java.util.List;

public record CourtCreationRequest(
        @NonNull Long facilityId,
        @NonNull Long sportId,
        @NonNull Long courtTypeId,
        @NonNull Long surfaceTypeId,
        @NonNull String name,
        Long priceListId,
        List<PriceSlotDto> slots,
        List<CourtImageDto> images
) {}
