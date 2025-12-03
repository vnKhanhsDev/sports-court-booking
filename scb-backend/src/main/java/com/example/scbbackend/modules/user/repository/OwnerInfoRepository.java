package com.example.scbbackend.modules.user.repository;

import com.example.scbbackend.modules.user.entity.OwnerInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OwnerInfoRepository extends JpaRepository<OwnerInfo, UUID> {
}
