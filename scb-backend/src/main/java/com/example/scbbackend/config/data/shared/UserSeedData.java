package com.example.scbbackend.config.data.shared;

import com.example.scbbackend.modules.user.enums.Gender;
import com.example.scbbackend.modules.user.enums.UserRole;
import lombok.NonNull;

import java.time.LocalDate;

public record UserSeedData(
        @NonNull String username,
        @NonNull String email,
        @NonNull String password,
        @NonNull UserRole role,
        @NonNull String fullName,
        @NonNull Gender gender,
        @NonNull LocalDate dob
) {}
