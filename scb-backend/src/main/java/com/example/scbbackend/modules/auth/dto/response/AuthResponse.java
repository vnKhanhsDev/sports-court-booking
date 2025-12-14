package com.example.scbbackend.modules.auth.dto.response;

import com.example.scbbackend.modules.user.dto.response.UserLoginResponse;
import lombok.Builder;

@Builder(toBuilder = true)
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserLoginResponse user
) { }
