package com.example.scbbackend.config.mock;

import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.AccountRole;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.modules.user.entity.UserProfile;
import com.example.scbbackend.modules.user.enums.Gender;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import com.example.scbbackend.modules.user.repository.AccountRoleRepository;
import com.example.scbbackend.modules.user.repository.OwnerInfoRepository;
import com.example.scbbackend.modules.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserMockData {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final UserProfileRepository userProfileRepository;
    private final OwnerInfoRepository ownerInfoRepository;
    private final PasswordEncoder passwordEncoder;

    private record UserData(
            String username,
            String email,
            String password,
            UserRole role,
            String fullName,
            Gender gender,
            LocalDate dob
    ) {}

    private static final UserData USER = new UserData(
            "chusan1", "chusan1@gmail.com", "123456", UserRole.OWNER,
            "Chủ sân 1", Gender.MALE, LocalDate.parse("1970-03-02")
    );

    public OwnerInfo mockOwnerUserData() {
        var account = accountRepository.save(
                Account.builder()
                        .username(USER.username)
                        .email(USER.email)
                        .password(passwordEncoder.encode(USER.password))
                        .build());

        accountRoleRepository.save(
                AccountRole.builder()
                        .account(account)
                        .role(USER.role)
                        .build());

        userProfileRepository.save(
                UserProfile.builder()
                        .account(account)
                        .fullName(USER.fullName)
                        .gender(USER.gender)
                        .dob(USER.dob)
                        .build()
        );

        return ownerInfoRepository.save(
                OwnerInfo.builder().account(account).build());
    }

}
