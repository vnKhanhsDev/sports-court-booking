package com.example.scbbackend.modules.court.dto.response;

import lombok.NonNull;
import java.math.BigDecimal;
import java.time.LocalTime;

/**
 * Represents the availability status of a time slot for booking
 */
public record TimeSlotAvailability(
        @NonNull LocalTime fromTime,
        @NonNull LocalTime toTime,
        @NonNull BigDecimal price,
        @NonNull SlotStatus status
) {
    public enum SlotStatus {
        AVAILABLE,  // Slot is available for booking
        BOOKED,     // Slot is already booked
        LOCKED,     // Slot is locked (e.g., outside operating hours, maintenance)
        PLAYED      // Slot has been played (completed booking)
    }
}
