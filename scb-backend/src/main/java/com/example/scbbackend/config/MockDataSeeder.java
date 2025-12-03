package com.example.scbbackend.config;

import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.AccountRole;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.modules.user.entity.UserProfile;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import com.example.scbbackend.modules.user.repository.AccountRoleRepository;
import com.example.scbbackend.modules.user.repository.OwnerInfoRepository;
import com.example.scbbackend.modules.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class MockDataSeeder implements ApplicationRunner {

    @Value("${app.mock-data.enabled}")
    private boolean mockEnabled;

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final UserProfileRepository userProfileRepository;
    private final OwnerInfoRepository ownerInfoRepository;
    private final PasswordEncoder passwordEncoder;

    private final FacilityRepository facilityRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!mockEnabled) return;

        if (facilityRepository.count() > 0) {
            log.info("Mock data already exists. Skipping...");
            return;
        }

        log.info(">>> STARTING MOCK DATA GENERATION <<<");

        OwnerInfo ownerInfo = seedOwnerInfo();

        log.info(">>> MOCK DATA GENERATED SUCCESSFULLY <<<");
    }

    private OwnerInfo seedOwnerInfo() {
        Account owner = accountRepository.save(
                Account.builder()
                        .username("ownertest")
                        .email("owner@scb.com")
                        .password(passwordEncoder.encode("owner"))
                        .build()
        );

        accountRoleRepository.save(
                AccountRole.builder().account(owner).role(UserRole.OWNER).build());

        userProfileRepository.save(
                UserProfile.builder().account(owner).fullName("Owner Test").build());

        return ownerInfoRepository.save(
                OwnerInfo.builder().account(owner).build());
    }

}
