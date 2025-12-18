package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.CourtPrice;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtPriceRepository extends JpaRepository<@NonNull CourtPrice, @NonNull Long> {
    List<CourtPrice> findAllByCourt(Court court);
}
