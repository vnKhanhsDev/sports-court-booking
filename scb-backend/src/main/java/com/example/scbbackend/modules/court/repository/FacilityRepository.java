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
            CONCAT(f.addressDetail, ', ', w.name, ', ', p.name) ,
            COUNT(c)
        )
        FROM Facility f
        LEFT JOIN f.courts c
        LEFT JOIN f.province p
        LEFT JOIN f.ward w
        WHERE f.ownerInfo = :ownerInfo
        GROUP BY f.id, f.name, f.openingTime, f.closingTime, f.status, f.addressDetail, w.name, p.name
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
            CONCAT(COALESCE(f.addressDetail, ''), CASE WHEN f.addressDetail IS NOT NULL THEN ', ' ELSE '' END, COALESCE(w.name, ''), CASE WHEN w.name IS NOT NULL AND p.name IS NOT NULL THEN ', ' ELSE '' END, COALESCE(p.name, '')),
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
        LEFT JOIN f.ward w
        LEFT JOIN Court c ON c.facility = f AND c.sport = ats AND c.status = :courtStatus
        LEFT JOIN c.priceList pl
        LEFT JOIN pl.priceSlots ps
        WHERE f.status = :facilityStatus
        GROUP BY f.id, f.name, ats.id, ats.name, f.addressDetail, w.name, p.name
    """)
    List<PublicFacilitySummaryResponse> findPublicFacilities(
            @Param("facilityStatus") FacilityStatus facilityStatus,
            @Param("courtStatus") CourtStatus courtStatus
    );

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse(
            f.id,
            f.name,
            ats.id,
            ats.name,
            CONCAT(COALESCE(f.addressDetail, ''), CASE WHEN f.addressDetail IS NOT NULL THEN ', ' ELSE '' END, COALESCE(w.name, ''), CASE WHEN w.name IS NOT NULL AND p.name IS NOT NULL THEN ', ' ELSE '' END, COALESCE(p.name, '')),
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
        LEFT JOIN f.ward w
        LEFT JOIN Court c ON c.facility = f AND c.sport = ats AND c.status = :courtStatus
        LEFT JOIN c.priceList pl
        LEFT JOIN pl.priceSlots ps
        WHERE f.status = :facilityStatus
        AND ats.id = :sportId
        GROUP BY f.id, f.name, ats.id, ats.name, f.addressDetail, w.name, p.name
    """)
    List<PublicFacilitySummaryResponse> findPublicFacilitiesBySportId(
            @Param("facilityStatus") FacilityStatus facilityStatus,
            @Param("courtStatus") CourtStatus courtStatus,
            @Param("sportId") Long sportId
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
        LEFT JOIN FETCH f.ward
        WHERE f.id = :id
        AND f.status = :status
    """)
    Optional<Facility> findPublicFacilityById(
            @Param("id") Long id,
            @Param("status") FacilityStatus status
    );

    /**
     * Find nearby facilities using Haversine formula
     * Returns facilities within reasonable distance, ordered by distance
     * Limits to 10 results
     */
    @Query(value = """
        SELECT f.id, f.name, ats.id as sport_id, ats.name as sport_name,
               CONCAT(COALESCE(f.address_detail, ''), 
                      CASE WHEN f.address_detail IS NOT NULL THEN ', ' ELSE '' END,
                      COALESCE(w.name, ''), 
                      CASE WHEN w.name IS NOT NULL AND p.name IS NOT NULL THEN ', ' ELSE '' END,
                      COALESCE(p.name, '')) as address,
               COUNT(DISTINCT c.id) as total_courts,
               MIN(ps.price) as min_price,
               MAX(ps.price) as max_price,
               NULL as image_urls,
               (6371 * acos(cos(radians(:latitude)) * cos(radians(f.geo_latitude)) * 
                            cos(radians(f.geo_longitude) - radians(:longitude)) + 
                            sin(radians(:latitude)) * sin(radians(f.geo_latitude)))) as distance
        FROM facilities f
        JOIN owner_infos o ON f.owner_account_id = o.account_id
        JOIN facility_sports fs ON f.id = fs.facility_id
        JOIN sports ats ON fs.sport_id = ats.id
        LEFT JOIN provinces p ON f.province_code = p.code
        LEFT JOIN wards w ON f.ward_code = w.code
        LEFT JOIN courts c ON c.facility_id = f.id AND c.sport_id = ats.id AND c.status = :courtStatus
        LEFT JOIN price_lists pl ON c.price_list_id = pl.id
        LEFT JOIN price_slots ps ON pl.id = ps.price_list_id
        WHERE f.status = :facilityStatus
          AND f.geo_latitude IS NOT NULL
          AND f.geo_longitude IS NOT NULL
          AND (6371 * acos(cos(radians(:latitude)) * cos(radians(f.geo_latitude)) * 
                           cos(radians(f.geo_longitude) - radians(:longitude)) + 
                           sin(radians(:latitude)) * sin(radians(f.geo_latitude)))) < 50
        GROUP BY f.id, f.name, ats.id, ats.name, f.address_detail, w.name, p.name, 
                 f.geo_latitude, f.geo_longitude
        ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(f.geo_latitude)) * 
                              cos(radians(f.geo_longitude) - radians(:longitude)) + 
                              sin(radians(:latitude)) * sin(radians(f.geo_latitude)))) ASC
        LIMIT 10
        """, nativeQuery = true)
    List<Object[]> findNearbyFacilitiesNative(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("facilityStatus") String facilityStatus,
            @Param("courtStatus") String courtStatus
    );
}
