package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.entity.Facility;
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

    Optional<Facility> findByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo);
}
