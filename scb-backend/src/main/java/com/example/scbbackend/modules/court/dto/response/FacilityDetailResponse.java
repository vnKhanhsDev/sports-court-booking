package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.FacilityStatus;
import lombok.NonNull;

import java.time.LocalTime;

public record FacilityDetailResponse(
        @NonNull String name,
        String description,
        @NonNull LocalTime openingTime,
        @NonNull LocalTime closingTime,
        String provinceCode,
        String districtCode,
        String wardCode,
        String addressDetail,
        Double geoLatitude,
        Double geoLongitude,
        FacilityStatus status
) {}
