package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
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
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourtMockData {

    private final FacilityRepository facilityRepository;
    private final CourtRepository courtRepository;

    private final CatalogService catalogService;

    @Transactional
    public void mock(OwnerInfo ownerInfo, PriceList priceList) {
        if (facilityRepository.count() > 0) {
            log.info("Court data already exists. Skipping...");
            return;
        }

        try {

            log.info("Court mock started...");

            ObjectMapper mapper = new ObjectMapper();

            ClassPathResource courtResource = new ClassPathResource("/data/court_mock_data.json");
            InputStream inputStream = courtResource.getInputStream();

            List<FacilityJsonDto> facilityJsonDtos = mapper.readValue(inputStream, new TypeReference<>() {});

            List<Facility> facilities = new ArrayList<>();
            List<Court> courts = new ArrayList<>();

            for (FacilityJsonDto f : facilityJsonDtos) {
                Set<Sport> activeSports = f.getActiveSports().stream()
                        .map(catalogService::getSportByCode)
                        .collect(Collectors.toSet());

                Facility facility = Facility.builder()
                        .ownerInfo(ownerInfo)
                        .name(f.getFacilityName())
                        .openingTime(LocalTime.parse(f.getOpeningTime()))
                        .closingTime(LocalTime.parse(f.getClosingTime()))
                        .provinceCode(f.getProvinceCode())
                        .wardCode(f.getWardCode())
                        .addressDetail(f.getAddressDetail())
                        .geoLatitude(f.getGeoLatitude())
                        .geoLongitude(f.getGeoLongitude())
                        .status(FacilityStatus.APPROVED)
                        .activeSports(activeSports)
                        .build();
                facilities.add(facility);

                for (CourtJsonDto c : f.getCourts()) {
                    Sport sport = catalogService.getSportByCode(c.getSportCode());
                    courts.add(
                            Court.builder()
                                    .facility(facility)
                                    .sport(sport)
                                    .courtType(catalogService.getCourtTypeBySportCodeAndCode(c.getSportCode(), c.getCourtTypeCode()))
                                    .surfaceType(catalogService.getSurfaceTypeBySportCodeAndCode(c.getSportCode(), c.getSurfaceTypeCode()))
                                    .name(c.getCourtName())
                                    .priceList(priceList)
                                    .status(CourtStatus.ACTIVE)
                                    .build()
                    );
                }
            }

            facilityRepository.saveAll(facilities);
            courtRepository.saveAll(courts);

            log.info("Created {} facilities successfully.", facilities.size());
            log.info("Created {} courts successfully.", courts.size());

        } catch (Exception e) {
            log.error("Court mock failed", e);
            throw new RuntimeException(e);
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class FacilityJsonDto {
        private String facilityName;
        private String openingTime;
        private String closingTime;
        private String provinceCode;
        private String wardCode;
        private String addressDetail;
        private double geoLatitude;
        private double geoLongitude;
        private List<String> activeSports;
        private List<CourtJsonDto> courts;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class CourtJsonDto {
        private String sportCode;
        private String courtTypeCode;
        private String surfaceTypeCode;
        private String courtName;
        private int priceListIndex;
    }

}

