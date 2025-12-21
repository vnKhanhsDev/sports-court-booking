package com.example.scbbackend.modules.address.repository;

import com.example.scbbackend.modules.address.entity.Ward;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WardRepository extends JpaRepository<@NonNull Ward, @NonNull String> {
    Optional<Ward> findByCode(@NonNull String wardCode);
    Optional<Ward> findByCodeName(@NonNull String wardCodeName);

    List<Ward> findByDistrictCode(@NonNull String code);
}
