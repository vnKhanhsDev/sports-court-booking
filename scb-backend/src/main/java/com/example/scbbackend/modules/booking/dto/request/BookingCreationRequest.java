package com.example.scbbackend.modules.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Getter
public class BookingCreationRequest {

    private UUID playerId;

    @NotBlank(message = "customer_name cannot be blank")
    private String customerName;

    @NotBlank(message = "customer_phone cannot be blank")
    private String customerPhone;

    @Email(message = "customer_email invalid")
    @NotBlank(message = "customer_email cannot be blank")
    private String customerEmail;

    @NotNull(message = "facility_id cannot be null")
    private Long facilityId;

    @NotNull(message = "court_id cannot be null")
    private Long courtId;

    @NotNull(message = "booking_date cannot be null")
    private LocalDate bookingDate;

    @NotNull(message = "start_time cannot be null")
    private LocalTime startTime;

    @NotNull(message = "end_time cannot be null")
    private LocalTime endTime;

    private String note;

    @NotBlank(message = "payment_method cannot be blank")
    private String paymentMethod;

}
