package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.CourtImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourtImageRepository extends JpaRepository<CourtImage, Long> {
    
    /**
     * Find all image URLs with displayOrder = 1 from courts belonging to a facility with a specific sport
     */
    @Query("""
        SELECT ci.imageUrl
        FROM CourtImage ci
        JOIN ci.court c
        JOIN c.facility f
        JOIN c.sport s
        WHERE f.id = :facilityId
        AND s.id = :sportId
        AND ci.displayOrder = 1
        ORDER BY ci.createdAt ASC
    """)
    List<String> findImageUrlsByFacilityAndSport(
            @Param("facilityId") Long facilityId,
            @Param("sportId") Long sportId
    );
}
