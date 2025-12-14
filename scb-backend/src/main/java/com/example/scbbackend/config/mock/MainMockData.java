package com.example.scbbackend.config.mock;

import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Slf4j
@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class MainMockData implements ApplicationRunner {

    @Value("${app.mock-data.enabled}")
    private boolean mockEnabled;

    private final AccountRepository accountRepository;
    private final UserMockData userMockData;
    private final CourtMockData courtMockData;


    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!mockEnabled) return;

        log.info(">>> STARTING MOCK DATA GENERATION <<<");

        if (accountRepository.existsByUsername("chusan1")) {
            log.info("Mock data already exists. Skipping...");
            return;
        }

        OwnerInfo ownerInfo = userMockData.mockOwnerUserData();
        courtMockData.mockData(ownerInfo);

        log.info(">>> MOCK DATA GENERATED SUCCESSFULLY <<<");
    }
}
