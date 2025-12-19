package com.example.scbbackend.modules.court.dto.shared;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceSlotDto(
        LocalTime fromTime,
        LocalTime toTime,
        BigDecimal price
) {}
