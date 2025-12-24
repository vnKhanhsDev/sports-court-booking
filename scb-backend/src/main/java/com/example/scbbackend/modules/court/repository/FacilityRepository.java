package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacilityRepository extends JpaRepository<@NonNull Facility, @NonNull Long> {

    boolean existsByOwnerInfo(@NonNull OwnerInfo ownerInfo);

    List<Facility> findByOwnerInfo(OwnerInfo ownerInfo);

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse(
            f.id,
            f.name,
            f.openingTime,
            f.closingTime,
            f.status,
            CONCAT(f.addressDetail, ', ', w.name, ', ', d.name, ', ', p.name) ,
            COUNT(c)
        )
        FROM Facility f
        LEFT JOIN f.courts c
        LEFT JOIN f.province p
        LEFT JOIN f.district d
        LEFT JOIN f.ward w
        WHERE f.ownerInfo = :ownerInfo
        GROUP BY f.id, f.name, f.openingTime, f.closingTime, f.status, f.addressDetail, w.name, d.name, p.name
    """)
    List<OwnerFacilitySummaryResponse> findSummaryByOwnerInfo(@Param("ownerInfo") OwnerInfo ownerInfo);

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse(
            f.id,
            f.name,
            a.email,
            f.status,
            COUNT(c)
        )
        FROM Facility f
        JOIN f.ownerInfo o
        JOIN o.account a
        LEFT JOIN Court c ON c.facility = f
        GROUP BY f.id, f.name, a.email, f.status
    """)
    List<AdminFacilitySummaryResponse> findAllAdminFacilities();

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse(
            f.id,
            f.name,
            ats.id,
            ats.name,
            CONCAT(
                COALESCE(d.name, ''),
                CASE WHEN d.name IS NOT NULL AND p.name IS NOT NULL THEN ', ' ELSE '' END,
                COALESCE(p.name, '')
            ),
            COUNT(DISTINCT c.id),
            MIN(ps.price),
            MAX(ps.price),
            NULL
        )
        FROM Facility f
        JOIN f.ownerInfo o
        JOIN o.account a
        JOIN f.activeSports ats
        LEFT JOIN f.province p
        LEFT JOIN f.district d
        LEFT JOIN Court c ON c.facility = f AND c.sport = ats AND c.status = :courtStatus
        LEFT JOIN c.priceList pl
        LEFT JOIN pl.priceSlots ps
        WHERE f.status = :facilityStatus
        GROUP BY f.id, f.name, ats.id, ats.name, d.name, p.name
    """)
    List<PublicFacilitySummaryResponse> findPublicFacilities(
            @Param("facilityStatus") FacilityStatus facilityStatus,
            @Param("courtStatus") CourtStatus courtStatus
    );

    List<Facility> findByStatus(FacilityStatus status);

    Optional<Facility> findByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo);

    /**
     * Find a public facility by ID with eagerly fetched relationships
     * Used for public facility detail endpoint
     */
    @Query("""
        SELECT DISTINCT f FROM Facility f
        LEFT JOIN FETCH f.activeSports
        LEFT JOIN FETCH f.province
        LEFT JOIN FETCH f.district
        LEFT JOIN FETCH f.ward
        WHERE f.id = :id
        AND f.status = :status
    """)
    Optional<Facility> findPublicFacilityById(
            @Param("id") Long id,
            @Param("status") FacilityStatus status
    );
}
