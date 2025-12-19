package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.modules.user.repository.OwnerInfoRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Slf4j
@Order(20)
@Configuration
@RequiredArgsConstructor
public class MockDataConfig implements ApplicationRunner {

    @Value("${app.mock-data.enabled}")
    private static boolean enabled;

    private final UserMockData userMockData;
    private final FacilityMockData facilityMockData;
    private final PriceMockData priceMockData;

    private final OwnerInfoRepository ownerInfoRepository;

    @Override
    public void run(@NonNull ApplicationArguments args) throws Exception {

        if (enabled) return;

        log.info(">>> MOCK DATA CONFIG STARTED <<<");

        userMockData.mock();

        OwnerInfo ownerInfo = ownerInfoRepository.findByAccountUsername("chusan1")
                        .orElseThrow(() -> new AppException(ApiCode.USER_NOT_FOUND));

        facilityMockData.mock(ownerInfo);

        priceMockData.mock(ownerInfo);

        log.info(">>> MOCK DATA CONFIG SUCCESS <<<");
    }

}
