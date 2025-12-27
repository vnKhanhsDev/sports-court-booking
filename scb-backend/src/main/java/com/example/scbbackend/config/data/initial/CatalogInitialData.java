package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogInitialData {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    @Transactional
    public void initialize() {
        if (sportRepository.count() > 0) {
            log.info("Catalog data already exists. Skipping...");
            return;
        }

        try {
            log.info("Catalog initialization started...");

            ObjectMapper mapper = new ObjectMapper();

            ClassPathResource catalogResource = new ClassPathResource("/data/catalog_initial_data.json");
            InputStream inputStream = catalogResource.getInputStream();

            List<SportJsonDto> sportJsonDtos = mapper.readValue(inputStream, new TypeReference<>() {});

            List<Sport> sports = new ArrayList<>();
            List<CourtType> courtTypes = new ArrayList<>();
            List<SurfaceType> surfaceTypes = new ArrayList<>();

            for (SportJsonDto s : sportJsonDtos) {
                Sport sport = Sport.builder()
                        .name(s.getSportName())
                        .code(s.getSportCode())
                        .iconUrl(s.getIconUrl())
                        .imageUrl(s.getImageUrl())
                        .build();
                sports.add(sport);

                for (CourtTypeJsonDto ct : s.getCourtTypes()) {
                    courtTypes.add(
                            CourtType.builder()
                                    .sport(sport)
                                    .name(ct.getCourtTypeName())
                                    .code(ct.getCourtTypeCode())
                                    .build()
                    );
                }

                for (SurfaceTypeJsonDto st : s.getSurfaceTypes()) {
                    surfaceTypes.add(
                            SurfaceType.builder()
                                    .sport(sport)
                                    .name(st.getSurfaceTypeName())
                                    .code(st.getSurfaceTypeCode())
                                    .build()
                    );
                }
            }

            sportRepository.saveAll(sports);
            courtTypeRepository.saveAll(courtTypes);
            surfaceTypeRepository.saveAll(surfaceTypes);

            log.info("Catalog initialization completed successfully.");
        } catch (Exception e) {
            log.error("Catalog initialization failed", e);
            throw new RuntimeException(e);
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class SportJsonDto {
        private String sportName;
        private String sportCode;
        private String iconUrl;
        private String imageUrl;
        private List<CourtTypeJsonDto> courtTypes = new ArrayList<>();
        private List<SurfaceTypeJsonDto> surfaceTypes = new ArrayList<>();
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class CourtTypeJsonDto {
        private String courtTypeName;
        private String courtTypeCode;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class SurfaceTypeJsonDto {
        private String surfaceTypeName;
        private String surfaceTypeCode;
    }

}
