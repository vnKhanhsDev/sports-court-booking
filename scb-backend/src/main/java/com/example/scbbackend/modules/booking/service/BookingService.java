package com.example.scbbackend.modules.booking.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.booking.dto.request.BookingCreationRequest;
import com.example.scbbackend.modules.booking.dto.response.BookingResponse;
import com.example.scbbackend.modules.booking.dto.response.PlayerBookingResponse;
import com.example.scbbackend.modules.booking.dto.response.OwnerBookingResponse;
import com.example.scbbackend.modules.booking.entity.Booking;
import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.booking.repository.BookingRepository;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.PlayerInfo;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.modules.user.repository.PlayerInfoRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final FacilityRepository facilityRepository;
    private final PlayerInfoRepository playerInfoRepository;
    private final EntityManager entityManager;

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

        return bookingRepository.existsByCourtAndStatusIn(court, ACTIVE_STATUSES);
    }

    /**
     * Create a new booking
     */
    @Transactional
    public BookingResponse createBooking(PlayerInfo playerInfo, BookingCreationRequest request) {
        // Validate and fetch court
        Court court = courtRepository.findById(request.courtId())
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        // Validate and fetch facility
        Facility facility = facilityRepository.findById(request.facilityId())
                .orElseThrow(() -> new AppException(ApiCode.FACILITY_NOT_FOUND));

        // Validate facility matches court
        if (!court.getFacility().getId().equals(facility.getId())) {
            throw new AppException(ApiCode.INPUT_INVALID);
        }

        // Parse times and date
        LocalTime startTime = LocalTime.parse(request.startTime());
        LocalTime endTime = LocalTime.parse(request.endTime());
        LocalDate bookingDate = LocalDate.parse(request.bookingDate());

        // Validate time range
        if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
            throw new AppException(ApiCode.INPUT_INVALID);
        }

        // Create booking
        Booking booking = Booking.builder()
                .playerInfo(playerInfo)
                .facility(facility)
                .court(court)
                .startTime(startTime)
                .endTime(endTime)
                .totalPrice(request.totalPrice())
                .depositAmount(0.0) // Default deposit, can be calculated later
                .status(BookingStatus.PENDING)
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        // Flush to ensure @CreationTimestamp is set
        entityManager.flush();
        entityManager.refresh(savedBooking);
        
        // Use current time as fallback if createdAt is still null (shouldn't happen, but safety check)
        LocalDateTime createdAt = savedBooking.getCreatedAt();
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
            log.warn("createdAt was null for booking {}, using current time", savedBooking.getId());
        }

        return new BookingResponse(
                savedBooking.getId(),
                savedBooking.getCourt().getId(),
                savedBooking.getFacility().getId(),
                savedBooking.getStartTime(),
                savedBooking.getEndTime(),
                bookingDate, // Return the requested booking date
                savedBooking.getTotalPrice(),
                savedBooking.getStatus().name(),
                createdAt
        );
    }

    /**
     * Get all bookings for a player
     */
    @Transactional(readOnly = true)
    public List<PlayerBookingResponse> getPlayerBookings(PlayerInfo playerInfo) {
        List<Booking> bookings = bookingRepository.findByPlayerInfoOrderByCreatedAtDesc(playerInfo);
        
        return bookings.stream()
                .map(booking -> {
                    String facilityAddress = booking.getFacility().getAddressDetail();
                    if (booking.getFacility().getWard() != null) {
                        facilityAddress += ", " + booking.getFacility().getWard().getName();
                    }
                    if (booking.getFacility().getDistrict() != null) {
                        facilityAddress += ", " + booking.getFacility().getDistrict().getName();
                    }
                    if (booking.getFacility().getProvince() != null) {
                        facilityAddress += ", " + booking.getFacility().getProvince().getName();
                    }
                    
                    // Use createdAt date as booking date (since bookingDate is not stored in entity)
                    LocalDate bookingDate = booking.getCreatedAt().toLocalDate();
                    
                    return new PlayerBookingResponse(
                            booking.getId(),
                            booking.getCourt().getId(),
                            booking.getCourt().getName(),
                            booking.getFacility().getId(),
                            booking.getFacility().getName(),
                            facilityAddress,
                            booking.getStartTime(),
                            booking.getEndTime(),
                            bookingDate,
                            booking.getTotalPrice(),
                            booking.getStatus().name(),
                            booking.getCreatedAt()
                    );
                })
                .toList();
    }

    /**
     * Get all bookings for an owner's facilities
     */
    @Transactional(readOnly = true)
    public List<OwnerBookingResponse> getOwnerBookings(OwnerInfo ownerInfo) {
        List<Booking> bookings = bookingRepository.findByFacilityOwnerInfoOrderByCreatedAtDesc(ownerInfo);
        
        return bookings.stream()
                .map(booking -> {
                    // Get player information
                    String playerName = "Khách hàng";
                    String playerPhone = "N/A";
                    String playerEmail = "N/A";
                    
                    if (booking.getPlayerInfo() != null && booking.getPlayerInfo().getAccount() != null) {
                        var account = booking.getPlayerInfo().getAccount();
                        if (account.getUserProfile() != null && account.getUserProfile().getFullName() != null) {
                            playerName = account.getUserProfile().getFullName();
                        } else if (account.getUsername() != null) {
                            playerName = account.getUsername();
                        }
                        if (account.getPhone() != null) {
                            playerPhone = account.getPhone();
                        }
                        if (account.getEmail() != null) {
                            playerEmail = account.getEmail();
                        }
                    }
                    
                    // Use createdAt date as booking date (since bookingDate is not stored in entity)
                    LocalDate bookingDate = booking.getCreatedAt().toLocalDate();
                    
                    return new OwnerBookingResponse(
                            booking.getId(),
                            booking.getCourt().getId(),
                            booking.getCourt().getName(),
                            booking.getFacility().getId(),
                            booking.getFacility().getName(),
                            playerName,
                            playerPhone,
                            playerEmail,
                            booking.getStartTime(),
                            booking.getEndTime(),
                            bookingDate,
                            booking.getTotalPrice(),
                            booking.getStatus().name(),
                            booking.getCreatedAt()
                    );
                })
                .toList();
    }

    /**
     * Update booking status (for owner)
     */
    @Transactional
    public OwnerBookingResponse updateBookingStatus(UUID bookingId, OwnerInfo ownerInfo, String statusString) {
        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(statusString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AppException(ApiCode.INPUT_INVALID);
        }
        // Find booking and validate ownership
        Booking booking = bookingRepository.findByIdAndFacilityOwnerInfo(bookingId, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.BOOKING_NOT_FOUND));

        // Validate status transition
        BookingStatus currentStatus = booking.getStatus();
        if (!isValidStatusTransition(currentStatus, newStatus)) {
            throw new AppException(ApiCode.INPUT_INVALID);
        }

        // Update status
        booking.setStatus(newStatus);
        Booking updatedBooking = bookingRepository.save(booking);

        // Get player information
        String playerName = "Khách hàng";
        String playerPhone = "N/A";
        String playerEmail = "N/A";
        
        if (updatedBooking.getPlayerInfo() != null && updatedBooking.getPlayerInfo().getAccount() != null) {
            var account = updatedBooking.getPlayerInfo().getAccount();
            if (account.getUserProfile() != null && account.getUserProfile().getFullName() != null) {
                playerName = account.getUserProfile().getFullName();
            } else if (account.getUsername() != null) {
                playerName = account.getUsername();
            }
            if (account.getPhone() != null) {
                playerPhone = account.getPhone();
            }
            if (account.getEmail() != null) {
                playerEmail = account.getEmail();
            }
        }
        
        LocalDate bookingDate = updatedBooking.getCreatedAt().toLocalDate();
        
        return new OwnerBookingResponse(
                updatedBooking.getId(),
                updatedBooking.getCourt().getId(),
                updatedBooking.getCourt().getName(),
                updatedBooking.getFacility().getId(),
                updatedBooking.getFacility().getName(),
                playerName,
                playerPhone,
                playerEmail,
                updatedBooking.getStartTime(),
                updatedBooking.getEndTime(),
                bookingDate,
                updatedBooking.getTotalPrice(),
                updatedBooking.getStatus().name(),
                updatedBooking.getCreatedAt()
        );
    }

    /**
     * Validate if status transition is allowed
     */
    private boolean isValidStatusTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        // PENDING -> CONFIRMED or CANCELLED
        if (currentStatus == BookingStatus.PENDING) {
            return newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.CANCELLED;
        }
        
        // CONFIRMED -> COMPLETED or CANCELLED
        if (currentStatus == BookingStatus.CONFIRMED) {
            return newStatus == BookingStatus.COMPLETED || newStatus == BookingStatus.CANCELLED;
        }
        
        // Once CANCELLED, COMPLETED, NO_SHOW, or EXPIRED, cannot change
        return false;
    }

}
