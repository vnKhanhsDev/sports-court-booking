package com.example.scbbackend.modules.booking.dto.response;

import lombok.NonNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

public record BookingResponse(
        @NonNull UUID id,
        @NonNull Long courtId,
        @NonNull Long facilityId,
        @NonNull LocalTime startTime,
        @NonNull LocalTime endTime,
        @NonNull LocalDate bookingDate,
        @NonNull Double totalPrice,
        @NonNull String status,
        @NonNull LocalDateTime createdAt
) {}
