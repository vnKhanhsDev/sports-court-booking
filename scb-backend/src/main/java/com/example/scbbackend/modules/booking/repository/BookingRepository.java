package com.example.scbbackend.modules.booking.repository;

import com.example.scbbackend.modules.booking.entity.Booking;
import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.court.entity.Court;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<@NonNull Booking, @NonNull UUID> {

    boolean existsByCourtAndBookingStatusIn(@NonNull Court court, @NonNull List<BookingStatus> bookingStatuses);
    
    /**
     * Finds all bookings for a given court with active statuses (PENDING or CONFIRMED)
     * @param court The court to check bookings for
     * @return List of active bookings for the court
     */
    List<Booking> findByCourtAndBookingStatusIn(Court court, List<BookingStatus> statuses);
}
