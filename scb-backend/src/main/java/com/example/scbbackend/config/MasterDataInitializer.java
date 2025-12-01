package com.example.scbbackend.config;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class MasterDataInitializer implements ApplicationRunner {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {

        log.info(">>> START MASTER DATA INITIALIZATION <<<");

        if (sportRepository.count() == 0) createCatalog();
        else log.info("Catalog already exists. Skipping...");

        log.info(">>> MASTER DATA INITIALIZED SUCCESSFULLY <<<");

    }

    private void createCatalog() {
        Sport football = createSport("Bóng đá");
        createCourtTypes(football, List.of("Sân 5", "Sân 7", "Sân 9", "Sân 11"));
        createSurfaceTypes(football, List.of("Cỏ tự nhiên", "Cỏ nhân tạo"));

        Sport badminton = createSport("Cầu lông");
        createCourtTypes(badminton, List.of("Sân đơn/đôi"));
        createSurfaceTypes(badminton, List.of("Thảm PVC", "Gỗ"));

        Sport pickleball = createSport("Pickleball");
        createCourtTypes(pickleball, List.of("Sân đơn/dôi"));
        createSurfaceTypes(pickleball, List.of("Acrylic", "Gỗ"));
    }

    private Sport createSport(String name) {
        return sportRepository.save(
                Sport.builder().name(name).build());
    }

    private void createCourtTypes(Sport sport, List<String> types) {
        List<CourtType> courtTypes = types.stream()
                .map(type -> CourtType.builder()
                        .sport(sport)
                        .name(type)
                        .build()
                ).toList();
        courtTypeRepository.saveAll(courtTypes);
    }

    private void createSurfaceTypes(Sport sport, List<String> types) {
        List<SurfaceType> surfaceTypes = types.stream()
                .map(type -> SurfaceType.builder()
                        .sport(sport)
                        .name(type)
                        .build()
                ).toList();
        surfaceTypeRepository.saveAll(surfaceTypes);
    }

}
