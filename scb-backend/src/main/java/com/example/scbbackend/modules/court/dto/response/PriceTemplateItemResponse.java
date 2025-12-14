package com.example.scbbackend.modules.court.dto.response;

import lombok.Builder;

@Builder(toBuilder = true)
public record PriceTemplateItemResponse(
        Long id,
        String startTime,
        String endTime,
        double price
) {}
