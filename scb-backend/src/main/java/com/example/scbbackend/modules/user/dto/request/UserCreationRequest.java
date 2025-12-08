package com.example.scbbackend.modules.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.time.LocalDate;

@Builder(toBuilder = true)
public record UserCreationRequest(
        @NotBlank String contact,
        @NotBlank String role,
        @NotBlank String fullName,
        @NotBlank String gender,
        @NotBlank LocalDate dob,
        @NotBlank String password
) { }
