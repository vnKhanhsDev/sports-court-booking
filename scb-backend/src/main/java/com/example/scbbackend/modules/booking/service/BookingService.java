package com.example.scbbackend.modules.booking.service;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.modules.booking.dto.request.BookingCreationRequest;
import com.example.scbbackend.modules.booking.dto.response.BookingResponse;
import com.example.scbbackend.modules.booking.entity.Booking;
import com.example.scbbackend.modules.booking.entity.BookingGuestInfo;
import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.booking.repository.BookingGuestInfoRespository;
import com.example.scbbackend.modules.booking.repository.BookingRepository;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceSlot;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.PlayerInfo;
import com.example.scbbackend.modules.user.repository.PlayerInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private static final BigDecimal AMOUNT_PERCENTAGE = BigDecimal.valueOf(0.3);

    private final BookingRepository bookingRepository;
    private final BookingGuestInfoRespository bookingGuestInfoRespository;
    private final CourtRepository courtRepository;
    private final FacilityRepository facilityRepository;
    private final PlayerInfoRepository playerInfoRepository;

    @Transactional
    public BookingResponse createBooking(BookingCreationRequest request) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));

        if (bookingRepository.existsConflictingBooking(
                court.getId(), request.getBookingDate(), request.getStartTime(), request.getEndTime())
        ) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, null);
        }

        PlayerInfo playerInfo = null;
        BookingGuestInfo bookingGuestInfo = null;
        if (request.getPlayerId() != null) {
            playerInfo = playerInfoRepository.findById(request.getPlayerId())
                    .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
        } else {
            bookingGuestInfo = bookingGuestInfoRespository.save(
                    BookingGuestInfo.builder()
                            .fullName(request.getCustomerName())
                            .email(request.getCustomerEmail())
                            .phone(request.getCustomerPhone())
                            .build()
            );
        }

        BigDecimal totalPrice = calculateTotalPrice(court, request.getStartTime(), request.getEndTime());
        BigDecimal depositAmount = playerInfo != null ? totalPrice.multiply(AMOUNT_PERCENTAGE) : totalPrice;

        Booking booking = bookingRepository.save(
                Booking.builder()
                        .playerInfo(playerInfo)
                        .bookingGuestInfo(bookingGuestInfo)
                        .facility(facility)
                        .court(court)
                        .bookingDate(request.getBookingDate())
                        .startTime(request.getStartTime())
                        .endTime(request.getEndTime())
                        .totalPrice(totalPrice)
                        .depositAmount(depositAmount)
                        .status(BookingStatus.PENDING)
                        .build()
        );
        
        // Flush to ensure @CreationTimestamp is applied
        bookingRepository.flush();

        return new BookingResponse(
                booking.getId(),
                booking.getCourt().getId(),
                booking.getFacility().getId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getBookingDate(),
                totalPrice.doubleValue(),
                booking.getStatus().name(),
                booking.getCreatedAt() != null ? booking.getCreatedAt() : LocalDateTime.now()
        );
    }

    @Transactional
    public void updateBookingStatus(UUID bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
        
        BookingStatus oldStatus = booking.getStatus();
        
        // Check if booking is already in the desired status (idempotency)
        if (oldStatus == newStatus) {
            log.info("Booking {} is already in status {}, skipping update", bookingId, newStatus);
            return;
        }
        
        booking.setStatus(newStatus);
        bookingRepository.save(booking);
        log.info("Booking {} status updated from {} to {}", bookingId, oldStatus, newStatus);
    }

    private BigDecimal calculateTotalPrice(Court court, LocalTime start, LocalTime end) {
        if (court == null || court.getPriceList() == null) {
            log.warn("Court or price list is null, returning zero price");
            return BigDecimal.ZERO;
        }

        var priceSlots = court.getPriceList().getPriceSlots();
        if (priceSlots == null || priceSlots.isEmpty()) {
            log.warn("No price slots found for court {}, returning zero price", court.getId());
            return BigDecimal.ZERO;
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        
        // Calculate duration in hours (rounding up for partial hours)
        long startMinutes = start.toSecondOfDay() / 60;
        long endMinutes = end.toSecondOfDay() / 60;
        long durationMinutes = endMinutes - startMinutes;
        
        if (durationMinutes <= 0) {
            log.warn("Invalid booking duration: start={}, end={}", start, end);
            return BigDecimal.ZERO;
        }

        // Calculate price for each hour in the booking range
        int startHour = start.getHour();
        int endHour = end.getHour();
        
        // If end time has minutes, we need to include that hour too
        if (end.getMinute() > 0) {
            endHour++;
        }

        for (int hour = startHour; hour < endHour; hour++) {
            LocalTime hourTime = LocalTime.of(hour, 0);
            
            // Find the price slot that contains this hour
            BigDecimal hourPrice = priceSlots.stream()
                    .filter(slot -> {
                        LocalTime slotFrom = slot.getFromTime();
                        LocalTime slotTo = slot.getToTime();
                        // Check if hourTime falls within this slot
                        // Slot is typically [fromTime, toTime), so hourTime >= fromTime && hourTime < toTime
                        return !hourTime.isBefore(slotFrom) && hourTime.isBefore(slotTo);
                    })
                    .findFirst()
                    .map(PriceSlot::getPrice)
                    .orElse(BigDecimal.ZERO);
            
            totalPrice = totalPrice.add(hourPrice);
        }

        return totalPrice;
    }

}
