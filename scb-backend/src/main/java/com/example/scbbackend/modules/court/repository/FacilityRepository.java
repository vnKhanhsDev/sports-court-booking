package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FacilityRepository extends JpaRepository<@NonNull Facility, @NonNull Long> {

    List<Facility> findByOwnerInfo(OwnerInfo ownerInfo);

}
