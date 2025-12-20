package com.example.scbbackend.modules.booking.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.booking.dto.request.BookingCreationRequest;
import com.example.scbbackend.modules.booking.dto.request.BookingStatusUpdateRequest;
import com.example.scbbackend.modules.booking.dto.response.BookingResponse;
import com.example.scbbackend.modules.booking.dto.response.PlayerBookingResponse;
import com.example.scbbackend.modules.booking.dto.response.OwnerBookingResponse;
import com.example.scbbackend.modules.booking.service.BookingService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.PlayerInfo;
import com.example.scbbackend.security.annotation.CurrentAccount;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ApiResponse<BookingResponse> createBooking(
            @CurrentAccount Account account,
            @Valid @RequestBody BookingCreationRequest request
    ) {
        // Check if user has player role
        if (account.getPlayerInfo() == null) {
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }

        PlayerInfo playerInfo = account.getPlayerInfo();
        BookingResponse booking = bookingService.createBooking(playerInfo, request);

        return ApiResponse.success(ApiCode.CREATE_BOOKING_SUCCESS, booking);
    }

    @GetMapping("/my-bookings")
    public ApiResponse<List<PlayerBookingResponse>> getMyBookings(
            @CurrentAccount Account account
    ) {
        // Check if user has player role
        if (account.getPlayerInfo() == null) {
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }

        PlayerInfo playerInfo = account.getPlayerInfo();
        List<PlayerBookingResponse> bookings = bookingService.getPlayerBookings(playerInfo);

        return ApiResponse.success(ApiCode.GET_BOOKINGS_SUCCESS, bookings);
    }

    @GetMapping("/owner-bookings")
    public ApiResponse<List<OwnerBookingResponse>> getOwnerBookings(
            @CurrentAccount Account account
    ) {
        // Check if user has owner role
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }

        com.example.scbbackend.modules.user.entity.OwnerInfo ownerInfo = account.getOwnerInfo();
        List<OwnerBookingResponse> bookings = bookingService.getOwnerBookings(ownerInfo);

        return ApiResponse.success(ApiCode.GET_BOOKINGS_SUCCESS, bookings);
    }

    @PutMapping("/{bookingId}/status")
    public ApiResponse<OwnerBookingResponse> updateBookingStatus(
            @PathVariable UUID bookingId,
            @CurrentAccount Account account,
            @Valid @RequestBody BookingStatusUpdateRequest request
    ) {
        // Check if user has owner role
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }

        com.example.scbbackend.modules.user.entity.OwnerInfo ownerInfo = account.getOwnerInfo();
        OwnerBookingResponse updatedBooking = bookingService.updateBookingStatus(bookingId, ownerInfo, request.status());

        return ApiResponse.success(ApiCode.UPDATE_BOOKING_SUCCESS, updatedBooking);
    }
}
