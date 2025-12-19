package com.example.scbbackend.config.data.shared;

import com.example.scbbackend.modules.user.entity.*;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserSeedService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final UserProfileRepository userProfileRepository;
    private final OwnerInfoRepository ownerInfoRepository;
    private final PlayerInfoRepository playerInfoRepository;

    private final PasswordEncoder passwordEncoder;

    public void createUserIfNotExists(UserSeedData user) {
        if (accountRepository.existsByUsername(user.username())) {
            log.info("User {} already exists. Skipping...", user.username());
            return;
        }

        Account account = accountRepository.save(
                Account.builder()
                        .username(user.username())
                        .email(user.email())
                        .password(passwordEncoder.encode(user.password()))
                        .build()
        );

        accountRoleRepository.save(
                AccountRole.builder()
                        .account(account)
                        .role(user.role())
                        .build()
        );

        userProfileRepository.save(
                UserProfile.builder()
                        .account(account)
                        .fullName(user.fullName())
                        .gender(user.gender())
                        .dob(user.dob())
                        .build()
        );

        if (user.role().equals(UserRole.OWNER)) {
            ownerInfoRepository.save(
                    OwnerInfo.builder().account(account).build());
        }

        if (user.role().equals(UserRole.PLAYER)) {
            playerInfoRepository.save(
                    PlayerInfo.builder().account(account).build());
        }
    }

}
