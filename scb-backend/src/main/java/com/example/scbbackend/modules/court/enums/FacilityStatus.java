package com.example.scbbackend.modules.court.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum FacilityStatus {
    PENDING,
    APPROVED,
    REJECTED,
    LOCKED;

    public static FacilityStatus fromString(String value) {
        try {
            return FacilityStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Invalid facility status value: {}", value);
            throw e;
        }
    }
}
