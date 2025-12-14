package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.enums.CourtStatus;
import lombok.Builder;

@Builder(toBuilder = true)
public record CourtBasicForOwner(
        Long id,
        String facilityName,
        String sportName,
        String courtTypeName,
        String name,
        CourtStatus status,
        boolean isBooked
) {}
