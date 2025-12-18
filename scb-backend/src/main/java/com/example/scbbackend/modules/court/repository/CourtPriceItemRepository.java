package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.CourtPriceItem;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourtPriceItemRepository extends JpaRepository<@NonNull CourtPriceItem, @NonNull Long> {
}
