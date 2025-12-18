package com.example.scbbackend.modules.court.dto.request;

import lombok.NonNull;

import java.time.LocalTime;

public record FacilityUpdationRequest(
        @NonNull String name,
        String description,
        @NonNull LocalTime openingTime,
        @NonNull LocalTime closingTime,
        @NonNull String provinceCode,
        @NonNull String districtCode,
        @NonNull String wardCode,
        @NonNull String addressDetail,
        Double geoLatitude,
        Double geoLongitude,
        String status
) {}
