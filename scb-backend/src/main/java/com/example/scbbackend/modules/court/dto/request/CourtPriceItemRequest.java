package com.example.scbbackend.modules.court.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder(toBuilder = true)
public record CourtPriceItemRequest(
        @NotNull(message = "Start time is required")
        String startTime,
        
        @NotNull(message = "End time is required")
        String endTime,
        
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Double price
) {}
