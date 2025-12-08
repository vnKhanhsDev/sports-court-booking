package com.example.scbbackend.modules.user.dto.response;

import com.example.scbbackend.modules.user.enums.Gender;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder(toBuilder = true)
public record UserRegistrationResponse(
        UUID accountId,
        String fullName,
        Gender gender,
        LocalDate dob
) { }
