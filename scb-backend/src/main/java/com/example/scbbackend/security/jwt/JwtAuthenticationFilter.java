package com.example.scbbackend.security.jwt;

import com.example.scbbackend.modules.user.repository.AccountRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AccountRepository accountRepository;

    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/public/**",
            "/api/v1/media/**"
    };

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // Skip public endpoints
        for (String path : PUBLIC_ENDPOINTS) {
            if (requestURI.contains(path)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            jwtService.validateToken(token);

            String accountId = jwtService.extractSubject(token);
            List<String> roles = jwtService.extractRoles(token);

            if (accountId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (!accountRepository.existsById(UUID.fromString(accountId))) {
                    request.setAttribute("exception", "USER_NOT_FOUND");
                } else {
                    var authorities = roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .toList();

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(accountId, null, authorities);

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
            request.setAttribute("exception", "TOKEN_EXPIRED");
        } catch (JwtException e) {
            request.setAttribute("exception", "TOKEN_INVALID");
        } catch (Exception e) {
            request.setAttribute("exception", "UNAUTHENTICATED");
        }

        filterChain.doFilter(request, response);

    }

}
