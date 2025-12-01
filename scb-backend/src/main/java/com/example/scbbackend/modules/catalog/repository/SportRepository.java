package com.example.scbbackend.modules.catalog.repository;

import com.example.scbbackend.modules.catalog.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SportRepository extends JpaRepository<Sport, Long> {
}
