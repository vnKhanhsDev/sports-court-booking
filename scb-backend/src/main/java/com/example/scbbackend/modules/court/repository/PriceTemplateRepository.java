package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceTemplateRepository extends JpaRepository<@NonNull PriceTemplate, @NonNull Long> {

    List<PriceTemplate> findByOwnerInfo(OwnerInfo ownerInfo);

    PriceTemplate findByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo);

}
