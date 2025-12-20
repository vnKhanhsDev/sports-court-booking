package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourtRepository extends JpaRepository<@NonNull Court, @NonNull Long> {

    @Query("""
        SELECT DISTINCT c FROM Court c
        LEFT JOIN FETCH c.priceList pl
        LEFT JOIN FETCH pl.priceSlots
        LEFT JOIN FETCH c.images
        WHERE c.id = :id AND c.facility.ownerInfo = :ownerInfo
    """)
    Optional<Court> findByIdAndOwnerInfo(@Param("id") Long id, @Param("ownerInfo") OwnerInfo ownerInfo);

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse(
            c.id,
            f.name,
            c.name,
            c.status,
            (CASE WHEN (
                SELECT COUNT(b.id) FROM Booking b
                WHERE b.court.id = c.id
                AND b.status = 'CONFIRMED'
                AND CURRENT_TIME BETWEEN b.startTime AND b.endTime
            ) > 0 THEN true ELSE false END)
        )
        FROM Court c
        JOIN c.facility f
        WHERE f.ownerInfo = :ownerInfo
    """)
    List<OwnerCourtSummaryResponse> getAllSummaryCourtsByOwnerInfo(@Param("ownerInfo") OwnerInfo ownerInfo);

    List<Court> findByFacility(Facility facility);

    long countByPriceList(PriceList priceList);

    long countByFacility(@NonNull com.example.scbbackend.modules.court.entity.Facility facility);

    /**
     * Find all public courts: ACTIVE courts from APPROVED facilities
     * Eagerly fetches related entities needed for public display
     */
    @Query("""
        SELECT DISTINCT c FROM Court c
        LEFT JOIN FETCH c.facility f
        LEFT JOIN FETCH c.sport s
        LEFT JOIN FETCH c.courtType ct
        LEFT JOIN FETCH c.surfaceType st
        LEFT JOIN FETCH c.priceList pl
        LEFT JOIN FETCH pl.priceSlots
        LEFT JOIN FETCH c.images
        WHERE c.status = :courtStatus
        AND f.status = :facilityStatus
        ORDER BY c.createdAt DESC
    """)
    List<Court> findAllPublicCourts(
            @Param("courtStatus") CourtStatus courtStatus,
            @Param("facilityStatus") FacilityStatus facilityStatus
    );

    /**
     * Find a public court by ID: ACTIVE court from APPROVED facility
     * Eagerly fetches related entities needed for public display
     */
    @Query("""
        SELECT DISTINCT c FROM Court c
        LEFT JOIN FETCH c.facility f
        LEFT JOIN FETCH c.sport s
        LEFT JOIN FETCH c.courtType ct
        LEFT JOIN FETCH c.surfaceType st
        LEFT JOIN FETCH c.priceList pl
        LEFT JOIN FETCH pl.priceSlots
        LEFT JOIN FETCH c.images
        WHERE c.id = :id
        AND c.status = :courtStatus
        AND f.status = :facilityStatus
    """)
    Optional<Court> findPublicCourtById(
            @Param("id") Long id,
            @Param("courtStatus") CourtStatus courtStatus,
            @Param("facilityStatus") FacilityStatus facilityStatus
    );

}
