package com.example.scbbackend.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RegisterNewAccountRequest(
        @NotBlank String contact,
        @NotBlank String role,
        @NotBlank String fullName,
        @NotBlank String gender,
        @NotNull LocalDate dob,
        @NotBlank String password
) { }
