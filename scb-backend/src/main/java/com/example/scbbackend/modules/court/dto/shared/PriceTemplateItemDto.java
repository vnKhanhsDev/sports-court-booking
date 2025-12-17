package com.example.scbbackend.modules.court.dto.shared;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceTemplateItemDto(
        LocalTime startTime,
        LocalTime endTime,
        BigDecimal price
) {}
