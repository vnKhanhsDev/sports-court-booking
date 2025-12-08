package com.example.scbbackend.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RegisterNewRoleRequest(
        @NotBlank String accountId,
        @NotBlank String role
) { }
