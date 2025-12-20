package com.example.scbbackend.modules.booking.dto.response;

import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public record PlayerBookingResponse(
        @NonNull UUID id,
        @NonNull Long courtId,
        @NonNull String courtName,
        @NonNull Long facilityId,
        @NonNull String facilityName,
        @NonNull String facilityAddress,
        @NonNull LocalTime startTime,
        @NonNull LocalTime endTime,
        @NonNull LocalDate bookingDate,
        @NonNull Double totalPrice,
        @NonNull String status,
        @NonNull LocalDateTime createdAt
) {}
