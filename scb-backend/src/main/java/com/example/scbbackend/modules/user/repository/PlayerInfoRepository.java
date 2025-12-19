package com.example.scbbackend.modules.user.repository;

import com.example.scbbackend.modules.user.entity.PlayerInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlayerInfoRepository extends JpaRepository<@NonNull PlayerInfo, @NonNull UUID> {
}
