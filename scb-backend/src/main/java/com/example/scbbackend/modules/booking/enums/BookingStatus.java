package com.example.scbbackend.modules.booking.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW,
    EXPIRED;

    public static BookingStatus fromString(String status) {
        try {
            return BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Booking status invalid: {}", e.getMessage());
            throw e;
        }
    }
}
