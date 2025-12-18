package com.example.scbbackend.modules.address.repository;

import com.example.scbbackend.modules.address.entity.District;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DistrictRepository extends JpaRepository<@NonNull District, @NonNull String> {
    Optional<District> findByCode(@NonNull String districtCode);

    List<District> findByProvinceCode(@NonNull String code);
}
