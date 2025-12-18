package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.CourtStatus;
import lombok.NonNull;

public record OwnerCourtSummaryResponse(
        @NonNull Long id,
        @NonNull String facilityName,
        @NonNull String name,
        @NonNull CourtStatus status,
        @NonNull Boolean isBooked
) {}
