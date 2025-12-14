package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.FacilityStatus;
import lombok.Builder;

import java.time.LocalTime;
import java.util.List;

@Builder(toBuilder = true)
public record FacilityBasicForOwner(
        Long id,
        String name,
        LocalTime openingTime,
        LocalTime closingTime,
        FacilityStatus status,
        String address,
        List<CourtBasicForOwner> courts
) {}
