package com.example.scbbackend.modules.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.NonNull;

public record BookingStatusUpdateRequest(
        @NonNull
        @NotBlank(message = "Status is required")
        String status // "CONFIRMED", "CANCELLED", "COMPLETED"
) {}
