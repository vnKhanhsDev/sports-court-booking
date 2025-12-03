package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility,Long> {
}
