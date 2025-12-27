package com.example.scbbackend.modules.address.repository;

import com.example.scbbackend.modules.address.entity.Province;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProvinceRepository extends JpaRepository<@NonNull Province, @NonNull String> {
    Optional<Province> findByCode(@NonNull String provinceCode);
    Optional<Province> findByCodeName(@NonNull String provinceCodeName);
}
