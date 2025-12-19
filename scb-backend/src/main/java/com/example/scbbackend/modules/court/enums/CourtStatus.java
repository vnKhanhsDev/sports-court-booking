package com.example.scbbackend.modules.court.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum CourtStatus {
    PENDING,
    ACTIVE,
    REJECTED,
    MAINTENANCE,
    CLOSED;

    public static CourtStatus fromString(String value) {
        try {
            return CourtStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Court status invalid: {}", e.getMessage());
            throw e;
        }
    }
}
