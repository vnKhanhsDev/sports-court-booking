package com.example.scbbackend.modules.catalog.dto.response;

import java.util.List;

public record SportPublicResponse(
        Long id,
        String name,
        List<CourtTypePublicResponse> courtTypes,
        List<SurfaceTypePublicResponse> surfaceTypes
) { }
