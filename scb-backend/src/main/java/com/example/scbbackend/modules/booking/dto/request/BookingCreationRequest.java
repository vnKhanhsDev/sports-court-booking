package com.example.scbbackend.modules.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.NonNull;

import java.util.List;

public record BookingCreationRequest(
        @NonNull
        @NotNull(message = "Court ID is required")
        Long courtId,

        @NonNull
        @NotNull(message = "Facility ID is required")
        Long facilityId,

        @NonNull
        @NotBlank(message = "Start time is required")
        String startTime, // Format: "HH:mm:ss"

        @NonNull
        @NotBlank(message = "End time is required")
        String endTime, // Format: "HH:mm:ss"

        @NonNull
        @NotBlank(message = "Booking date is required")
        String bookingDate, // Format: "YYYY-MM-DD"

        List<Integer> daysOfWeek, // For fixed schedule: [1, 3, 5] for Monday, Wednesday, Friday

        @NonNull
        @NotBlank(message = "Schedule type is required")
        String scheduleType, // "oddDays" or "fixedDays"

        @NonNull
        @NotBlank(message = "Customer name is required")
        String customerName,

        @NonNull
        @NotBlank(message = "Customer phone is required")
        String customerPhone,

        @NonNull
        @NotBlank(message = "Customer email is required")
        @Email(message = "Invalid email format")
        String customerEmail,

        String notes,

        @NonNull
        @NotNull(message = "Total price is required")
        @Positive(message = "Total price must be positive")
        Double totalPrice,

        @NonNull
        @NotBlank(message = "Payment method is required")
        String paymentMethod // "banking", "momo", "vnpay", "cash"
) {}
