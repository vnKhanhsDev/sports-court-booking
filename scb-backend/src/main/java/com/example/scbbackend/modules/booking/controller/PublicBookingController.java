package com.example.scbbackend.modules.booking.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.booking.dto.request.BookingCreationRequest;
import com.example.scbbackend.modules.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/public/booking")
@RequiredArgsConstructor
public class PublicBookingController {

    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<?> createBooking(@Valid @RequestBody BookingCreationRequest request) {
        try {
            log.info("Creating booking for facilityId: {}, courtId: {}, date: {}, time: {} - {}", 
                    request.getFacilityId(), request.getCourtId(), 
                    request.getBookingDate(), request.getStartTime(), request.getEndTime());
            
            var bookingResponse = bookingService.createBooking(request);
            log.info("Booking created successfully with id: {}", bookingResponse.id());
            
            return ApiResponse.success(
                    ApiCode.CREATE_BOOKING_SUCCESS,
                    bookingResponse
            );
        } catch (Exception e) {
            log.error("Error creating booking: {}", e.getMessage(), e);
            // Exception will be handled by GlobalExceptionHandler
            throw e;
        }
    }

}
