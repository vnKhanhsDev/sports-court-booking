package com.example.scbbackend.modules.user.dto.response;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder(toBuilder = true)
public record UserLoginResponse(
        UUID accountId,
        String username,
        String avatarUrl,
        Set<String> roles
) { }
