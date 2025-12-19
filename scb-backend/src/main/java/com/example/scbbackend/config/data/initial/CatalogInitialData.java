package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogInitialData {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    public void initialize() {
        if (sportRepository.count() > 0) {
            log.info("Catalog already exists. Skipping...");
            return;
        }

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
        return sportRepository.save(Sport.builder().name(name).build());
    }

    private void createCourtTypes(Sport sport, List<String> types) {
        List<CourtType> courtTypes = types.stream()
                .map(t -> CourtType.builder()
                        .sport(sport)
                        .name(t)
                        .build()
                )
                .toList();
        courtTypeRepository.saveAll(courtTypes);
    }

    private void createSurfaceTypes(Sport sport, List<String> types) {
        List<SurfaceType> surfaceTypes = types.stream()
                .map(t -> SurfaceType.builder()
                        .sport(sport)
                        .name(t)
                        .build()
                )
                .toList();
        surfaceTypeRepository.saveAll(surfaceTypes);
    }

}
