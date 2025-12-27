package com.example.scbbackend.modules.catalog.repository;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourtTypeRepository extends JpaRepository<@NonNull CourtType, @NonNull Long> {
    Optional<CourtType> findByCode(@NonNull String code);
    
    Optional<CourtType> findBySportAndCode(@NonNull Sport sport, @NonNull String code);
}
