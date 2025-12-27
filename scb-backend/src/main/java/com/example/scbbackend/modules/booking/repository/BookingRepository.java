package com.example.scbbackend.modules.booking.repository;

import com.example.scbbackend.modules.booking.entity.Booking;
import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.user.entity.PlayerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<@NonNull Booking, @NonNull UUID> {

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.court.id = :courtId
            AND b.bookingDate = :bookingDate
            AND b.startTime < :endTime
            AND b.endTime > :startTime
            AND b.status IN (
                com.example.scbbackend.modules.booking.enums.BookingStatus.PENDING,
                com.example.scbbackend.modules.booking.enums.BookingStatus.CONFIRMED
            )
    """)
    boolean existsConflictingBooking(
            @Param("courtId") Long courtId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    boolean existsByCourtAndStatusIn(@NonNull Court court, @NonNull List<BookingStatus> statuses);
    
    /**
     * Finds all bookings for a given court with active statuses (PENDING or CONFIRMED)
     * @param court The court to check bookings for
     * @return List of active bookings for the court
     */
    List<Booking> findByCourtAndStatusIn(Court court, List<BookingStatus> statuses);

    /**
     * Finds all bookings for a given player
     * @param playerInfo The player to get bookings for
     * @return List of bookings for the player
     */
    @Query("""
        SELECT b FROM Booking b
        LEFT JOIN FETCH b.court c
        LEFT JOIN FETCH b.facility f
        WHERE b.playerInfo = :playerInfo
        ORDER BY b.createdAt DESC
    """)
    List<Booking> findByPlayerInfoOrderByCreatedAtDesc(@Param("playerInfo") PlayerInfo playerInfo);

    /**
     * Finds all bookings for facilities owned by a given owner
     * @param ownerInfo The owner to get bookings for
     * @return List of bookings for the owner's facilities
     */
    @Query("""
        SELECT b FROM Booking b
        LEFT JOIN FETCH b.court c
        LEFT JOIN FETCH b.facility f
        LEFT JOIN FETCH b.playerInfo p
        LEFT JOIN FETCH p.account a
        LEFT JOIN FETCH a.userProfile up
        WHERE f.ownerInfo = :ownerInfo
        ORDER BY b.createdAt DESC
    """)
    List<Booking> findByFacilityOwnerInfoOrderByCreatedAtDesc(@Param("ownerInfo") com.example.scbbackend.modules.user.entity.OwnerInfo ownerInfo);

    /**
     * Finds a booking by ID and validates it belongs to owner's facility
     * @param bookingId The booking ID
     * @param ownerInfo The owner to validate against
     * @return Optional booking if found and belongs to owner
     */
    @Query("""
        SELECT b FROM Booking b
        LEFT JOIN FETCH b.court c
        LEFT JOIN FETCH b.facility f
        WHERE b.id = :bookingId AND f.ownerInfo = :ownerInfo
    """)
    java.util.Optional<Booking> findByIdAndFacilityOwnerInfo(
            @Param("bookingId") UUID bookingId,
            @Param("ownerInfo") com.example.scbbackend.modules.user.entity.OwnerInfo ownerInfo
    );
}
