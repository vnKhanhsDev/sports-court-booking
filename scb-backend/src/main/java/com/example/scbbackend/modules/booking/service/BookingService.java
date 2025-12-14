package com.example.scbbackend.modules.booking.service;

import com.example.scbbackend.modules.booking.entity.Booking;
import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.booking.repository.BookingRepository;
import com.example.scbbackend.modules.court.entity.Court;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    /**
     * Checks if a court has any active bookings (PENDING or CONFIRMED status)
     * @param court The court to check
     * @return true if the court has active bookings, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isCourtBooked(Court court) {
        if (court == null) {
            log.error("Court is null");
            return false;
        }
        
        final List<BookingStatus> ACTIVE_STATUSES = List.of(
                BookingStatus.PENDING,
                BookingStatus.CONFIRMED
        );

        return bookingRepository.existsByCourtAndBookingStatusIn(court, ACTIVE_STATUSES);
    }

}
