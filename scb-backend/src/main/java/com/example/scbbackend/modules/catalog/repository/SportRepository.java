package com.example.scbbackend.modules.catalog.repository;

import com.example.scbbackend.modules.catalog.entity.Sport;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SportRepository extends JpaRepository<@NonNull Sport, @NonNull Long> {
    Optional<Sport> findByCode(@NonNull String code);
}
