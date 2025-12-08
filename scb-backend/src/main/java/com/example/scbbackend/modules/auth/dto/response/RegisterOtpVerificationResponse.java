package com.example.scbbackend.modules.auth.dto.response;

import lombok.Builder;

@Builder(toBuilder = true)
public record RegisterOtpVerificationResponse(
        String accountId,
        String fullName,
        String gender,
        String dob
) { }
