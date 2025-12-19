package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceSlot;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceSlotRepository extends JpaRepository<@NonNull PriceSlot, @NonNull Long> {
}
