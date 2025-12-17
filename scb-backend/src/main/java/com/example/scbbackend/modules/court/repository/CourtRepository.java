package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtRepository extends JpaRepository<@NonNull Court, @NonNull Long> {

    List<Court> findByFacility(Facility facility);
    List<Court> findByPriceTemplate(PriceTemplate priceTemplate);

}
