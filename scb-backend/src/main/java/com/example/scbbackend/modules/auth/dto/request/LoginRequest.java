package com.example.scbbackend.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String contact,
        @NotBlank String role,
        @NotBlank String password
) { }
