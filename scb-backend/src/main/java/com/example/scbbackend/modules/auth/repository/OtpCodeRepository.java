package com.example.scbbackend.modules.auth.repository;

import com.example.scbbackend.modules.auth.entity.OtpCode;
import com.example.scbbackend.modules.auth.enums.OtpType;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpCodeRepository extends JpaRepository<@NonNull OtpCode, @NonNull Long> {

    Optional<OtpCode> findTopByContactAndTypeAndUsedFalseOrderByCreatedAtDesc(String contact, OtpType type);

    List<OtpCode> findAllByContactAndTypeAndUsedFalse(String contact, OtpType type);

    @Modifying
    @Query("DELETE FROM OtpCode o WHERE o.expiryAt < :threshold AND o.used = false")
    void deleteByExpiryAtBeforeAndUsedFalse(@Param("threshold") LocalDateTime threshold);

}
