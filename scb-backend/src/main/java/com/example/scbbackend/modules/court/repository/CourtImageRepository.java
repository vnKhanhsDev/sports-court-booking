package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.dto.response.pub.DisplayFacilityImages;
import com.example.scbbackend.modules.court.entity.CourtImage;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourtImageRepository extends JpaRepository<@NonNull CourtImage, @NonNull Long> {

    @Query("""
        SELECT new com.example.scbbackend.modules.court.dto.response.pub.DisplayFacilityImages(
            new com.example.scbbackend.modules.court.dto.response.pub.FacilitySportKey(f.id, s.id),
            ci.imageUrl
        )
        FROM CourtImage ci
        JOIN ci.court c
        JOIN c.facility f
        JOIN c.sport s
        WHERE ci.displayOrder = 1 AND f.id IN :facilityIds
        """)
    List<DisplayFacilityImages> findDisplayFacilityImages(
            @Param("facilityIds") List<Long> facilityIds
    );


    /**
     * Find ALL image URLs (all displayOrders) from courts belonging to a facility with a specific sport
     * Used for facility detail page to ensure all images are retrieved
     */
    @Query("""
        SELECT ci.imageUrl
        FROM CourtImage ci
        JOIN ci.court c
        JOIN c.facility f
        JOIN c.sport s
        WHERE f.id = :facilityId
        AND s.id = :sportId
        ORDER BY ci.displayOrder ASC, ci.createdAt ASC
    """)
    List<String> findAllImageUrlsByFacilityAndSport(
            @Param("facilityId") Long facilityId,
            @Param("sportId") Long sportId
    );
}
