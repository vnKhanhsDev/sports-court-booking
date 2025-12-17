package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PriceTemplateRepository extends JpaRepository<@NonNull PriceTemplate, @NonNull Long> {

    List<PriceTemplate> findByOwnerInfo(OwnerInfo ownerInfo);

    Optional<PriceTemplate> findByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo);

//    @Query("""
//        SELECT new com.example.scbbackend.modules.court.dto.response.PriceTemplateBasicResponse(
//            t.id, f.id, s.id, ct.id, st.id, t.name
//        )
//        FROM PriceTemplate t
//        LEFT JOIN t.facility f
//        LEFT JOIN t.sport s
//        LEFT JOIN t.courtType ct
//        LEFT JOIN t.surfaceType st
//        WHERE t.ownerInfo = :ownerInfo
//            AND t.isActive = true
//    """)
//    List<PriceTemplateBasicResponse> findBasicTemplateByOwnerInfo(@Param("ownerInfo") OwnerInfo ownerInfo);

}
