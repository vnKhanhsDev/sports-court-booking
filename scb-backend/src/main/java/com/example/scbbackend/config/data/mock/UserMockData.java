package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.config.data.shared.UserSeedData;
import com.example.scbbackend.config.data.shared.UserSeedService;
import com.example.scbbackend.modules.user.enums.Gender;
import com.example.scbbackend.modules.user.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserMockData {

    private final UserSeedService userSeedService;

    private static final UserSeedData OWNER_1 = new UserSeedData(
            "chusan1",
            "chusan1@gmail.com",
            "123456",
            UserRole.OWNER,
            "Chủ sân 1",
            Gender.MALE,
            LocalDate.parse("1989-09-12")
    );

    private static final UserSeedData PLAYER_1 = new UserSeedData(
            "nguoichoi1",
            "nguoichoi1@gamil.com",
            "123456",
            UserRole.PLAYER,
            "Người chơi 1",
            Gender.MALE,
            LocalDate.parse("1999-06-06")
    );

    public void mock() {
        userSeedService.createUserIfNotExists(OWNER_1);
        userSeedService.createUserIfNotExists(PLAYER_1);
    }

}
