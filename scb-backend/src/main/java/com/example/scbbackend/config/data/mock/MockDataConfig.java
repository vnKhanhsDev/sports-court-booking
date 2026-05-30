package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.modules.court.entity.PriceList;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Order(20)
@Configuration
@RequiredArgsConstructor
public class MockDataConfig implements ApplicationRunner {

    @Value("${app.mock-data.enabled}")
    private boolean enabled;

    private final UserMockData userMockData;
    private final PriceMockData priceMockData;
    private final CourtMockData courtMockData;

    private final OwnerInfoRepository ownerInfoRepository;

    @Override
    @Transactional
    public void run(@NonNull ApplicationArguments args) throws Exception {

        if (!enabled) {
            log.info("Mock data is disabled. Skipping...");
            return;
        }

        log.info(">>> MOCK DATA CONFIG STARTED <<<");

        userMockData.mock();

        OwnerInfo ownerInfo = ownerInfoRepository.findByAccountUsername("chusan1")
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));

        List<PriceList> priceLists = priceMockData.mock(ownerInfo);
        PriceList firstPriceList = priceLists.isEmpty() ? null : priceLists.getFirst();

        if (firstPriceList == null) return;

        courtMockData.mock(ownerInfo, firstPriceList);

        log.info(">>> MOCK DATA CONFIG SUCCESS <<<");
    }

}
