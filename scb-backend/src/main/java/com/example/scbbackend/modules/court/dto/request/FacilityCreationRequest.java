package com.example.scbbackend.modules.court.dto.request;

import lombok.NonNull;

import java.time.LocalTime;

public record FacilityCreationRequest(
        @NonNull String name,
        String description,
        @NonNull LocalTime openingTime,
        @NonNull LocalTime closingTime,
        @NonNull String provinceCode,
        @NonNull String wardCode,
        @NonNull String addressDetail,
        Double geoLatitude,
        Double geoLongitude
) {}
