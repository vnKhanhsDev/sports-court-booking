package com.example.scbbackend.modules.user.repository;

import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OwnerInfoRepository extends JpaRepository<@NonNull OwnerInfo, @NonNull UUID> {
    Optional<OwnerInfo> findByAccountUsername(String username);
}
