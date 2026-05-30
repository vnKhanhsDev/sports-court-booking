package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.modules.auth.entity.RefreshToken;
import com.example.scbbackend.modules.auth.repository.RefreshTokenRepository;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    @Value("${jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION_TIME;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Transactional
    public RefreshToken createRefreshToken(Account account) {
        refreshTokenRepository.deleteByAccountId(account.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .account(account)
                .token(jwtService.generateRefreshToken(account))
                .expiryAt(LocalDateTime.now().plusSeconds(REFRESH_EXPIRATION_TIME / 1000))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByTokenWithAccountAndRoles(token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));

        if (refreshToken.getExpiryAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, null);
        }

        return refreshToken;
    }

    @Transactional
    public void deleteByAccountId(UUID accountId) {
        refreshTokenRepository.deleteByAccountId(accountId);
    }

}
