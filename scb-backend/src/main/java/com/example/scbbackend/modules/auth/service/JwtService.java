package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.modules.user.entity.Account;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class JwtService {

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;
    @Value("${jwt.access-expiration}")
    private long ACCESS_EXPIRATION_TIME;
    @Value("${jwt.refresh-expiration}")
    private long REFRESH_EXPIRATION_TIME;

    private final long REGISTER_EXPIRATION_TIME = 1000 * 60 * 15;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SIGNER_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // ===================
    //    GENERATE KEYS
    // ===================
    public String generateRegisterToken(String contact) {
        return Jwts.builder()
                .setSubject(contact)
                .claim("scope", "PRE_REGISTER_VERIFIED")
                .setIssuedAt(new Date())
                .setExpiration (new Date(System.currentTimeMillis() + REGISTER_EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // ====================
    //    VALIDATE TOKEN
    // ====================
    public boolean isTokenValid(String token, Account account) {
        try {
            String subject = extractSubject(token);
            if (subject == null) {
                return false;
            }
            return subject.equals(account.getId().toString()) && !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Boolean isTokenExpired(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            log.warn("Failed to check token expiration: {}", e.getMessage());
            return true;
        }
    }

    // ====================
    //    EXTRACT CLAIMS
    // ====================
    public String extractSubject(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        } catch (Exception e) {
            log.warn("Failed to extract subject from token: {}", e.getMessage());
            return null;
        }
    }

    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> {
            List<?> roles = claims.get("roles", List.class);
            if (roles == null || roles.isEmpty()) return Collections.emptyList();
            return roles.stream().map(Object::toString).collect(Collectors.toList());
        });
    }

    public String extractScope(String token) {
        return extractClaim(token, claims -> claims.get("scope", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims =  extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to extract JWT claims: {}", e.getMessage());
            throw e;
        }
    }

}
