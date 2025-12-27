package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PriceListRepository extends JpaRepository<@NonNull PriceList, @NonNull Long> {

    boolean existsByOwnerInfo(@NonNull OwnerInfo ownerInfo);

    Optional<PriceList> findByIdAndOwnerInfo(@NonNull Long id, @NonNull OwnerInfo ownerInfo);

    List<PriceList> findAllByOwnerInfoAndCourtIsNull(@NonNull OwnerInfo ownerInfo);

    long countByFacility(@NonNull com.example.scbbackend.modules.court.entity.Facility facility);
}
