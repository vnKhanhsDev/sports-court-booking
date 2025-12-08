package com.example.scbbackend.modules.auth.dto.request;

public record VerifyOtpRequest(
        String contact,
        String type,
        String code
) { }
