package com.example.scbbackend.config.data.initial;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Slf4j
@Order(10)
@Configuration
@RequiredArgsConstructor
public class InitialDataConfig implements ApplicationRunner {

    private final UserInitialData userInitialData;
    private final CatalogInitialData catalogInitialData;
    private final AddressInitialData addressInitialData;

    @Override
    public void run(@NonNull ApplicationArguments args) throws Exception {

        log.info(">>> INITIAL DATA CONFIG STARTED <<<");

        userInitialData.initialize();
        catalogInitialData.initialize();
        addressInitialData.initialize();

        log.info(">>> INITIAL DATA CONFIG SUCCESS <<<");

    }

}
