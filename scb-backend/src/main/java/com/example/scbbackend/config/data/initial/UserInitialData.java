package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.config.data.shared.UserSeedData;
import com.example.scbbackend.config.data.shared.UserSeedService;
import com.example.scbbackend.modules.user.enums.Gender;
import com.example.scbbackend.modules.user.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserInitialData {

    private final UserSeedService userSeedService;

    private static final UserSeedData ADMIN = new UserSeedData(
            "systemadmin",
            "admin@gmail.com",
            "admin",
            UserRole.ADMIN,
            "System Admin",
            Gender.MALE,
            LocalDate.parse("2002-03-27")
    );

    public void initialize() {
        userSeedService.createUserIfNotExists(ADMIN);
    }

}
