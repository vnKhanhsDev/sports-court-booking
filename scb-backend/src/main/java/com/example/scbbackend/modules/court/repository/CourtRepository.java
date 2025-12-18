package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
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
        LEFT JOIN FETCH c.priceTemplate pt
        LEFT JOIN FETCH pt.priceTemplateItems
        LEFT JOIN FETCH c.courtPrice cp
        LEFT JOIN FETCH cp.items
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

    List<Court> findByPriceTemplate(PriceTemplate priceTemplate);

    long countByPriceTemplate(PriceTemplate priceTemplate);

}
