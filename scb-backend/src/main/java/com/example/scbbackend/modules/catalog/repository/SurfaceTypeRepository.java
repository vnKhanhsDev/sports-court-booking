package com.example.scbbackend.modules.catalog.repository;

import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SurfaceTypeRepository extends JpaRepository<@NonNull SurfaceType, @NonNull Long> {
    Optional<SurfaceType> findByCode(@NonNull String code);
    
    Optional<SurfaceType> findBySportAndCode(@NonNull Sport sport, @NonNull String code);
}
