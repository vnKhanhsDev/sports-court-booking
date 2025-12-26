package com.example.scbbackend.modules.catalog.dto.response;

import lombok.NonNull;

import java.util.List;

public record PublicSportResponse(
        @NonNull Long id,
        @NonNull String name,
        @NonNull String iconUrl,
        @NonNull String imageUrl,
        List<PublicCourtTypeResponse> courtTypes,
        List<PublicSurfaceTypeResponse> surfaceTypes
) {}
