package com.example.scbbackend.modules.auth.repository;

import com.example.scbbackend.modules.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    @Query("SELECT rt FROM RefreshToken rt JOIN FETCH rt.account a JOIN FETCH a.roles WHERE rt.token = :token")
    Optional<RefreshToken> findByTokenWithAccountAndRoles(@Param("token") String token);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.account.id = :accountId")
    void deleteByAccountId(@Param("accountId") UUID accountId);
}
