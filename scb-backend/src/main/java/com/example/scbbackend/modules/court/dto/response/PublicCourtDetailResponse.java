package com.example.scbbackend.modules.court.dto.response;

import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record PublicCourtDetailResponse(
        @NonNull Long id,
        @NonNull String name,
        @NonNull CourtStatus status,
        
        // Facility information
        @NonNull Long facilityId,
        @NonNull String facilityName,
        @NonNull String facilityDescription,
        @NonNull String facilityAddress,
        Double facilityLatitude,
        Double facilityLongitude,
        @NonNull LocalTime facilityOpeningTime,
        @NonNull LocalTime facilityClosingTime,
        @NonNull Integer facilityTotalCourts, // Number of courts in the facility
        
        // Sport and court type information
        @NonNull Long sportId,
        @NonNull String sportName,
        @NonNull Long courtTypeId,
        @NonNull String courtTypeName,
        @NonNull Long surfaceTypeId,
        @NonNull String surfaceTypeName,
        
        // Pricing information
        @NonNull List<PriceSlotDto> priceSlots,
        
        // Images
        @NonNull List<CourtImageDto> images,
        
        // Booking availability for a specific date
        @NonNull LocalDate date,
        @NonNull List<TimeSlotAvailability> timeSlotAvailabilities
) {}
