package com.example.scbbackend.modules.court.dto.shared;

import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceItemDto(
        @NonNull LocalTime startTime,
        @NonNull LocalTime endTime,
        @NonNull BigDecimal price
) {}
