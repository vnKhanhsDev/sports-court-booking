package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.address.service.AddressService;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacilityMockData {

    private final FacilityRepository facilityRepository;
    private final AddressService addressService;
    private final CatalogService catalogService;

    private record FacilityData(
            String name,
            LocalTime openingTime,
            LocalTime closingTime,
            String provinceCodeName,
            String districtCodeName,
            String wardCodeName,
            String addressDetail,
            Double geoLatitude,
            Double geoLongitude,
            List<String> sportCodeNames
    ) {}

    private static final List<FacilityData> FACILITY_DATA = List.of(
            new FacilityData(
                    "Đại học Phenikaa",
                    LocalTime.parse("06:00"),
                    LocalTime.parse("23:00"),
                    "thanh_pho_ha_noi",
                    "quan_ha_dong",
                    "phuong_yen_nghia",
                    "Phố Nguyễn Trác",
                    20.962821195770516,
                    105.74893899330873,
                    List.of("football", "tennis", "basketball")
            )
    );

    @Transactional
    public List<Facility> mock(OwnerInfo ownerInfo) {
        if (facilityRepository.existsByOwnerInfo(ownerInfo)) {
            log.info("Facility data already exists. Skipping...");
            return List.of();
        }

        List<Facility> facilities = new ArrayList<>();

        for (FacilityData fd : FACILITY_DATA) {
            Facility facility = mapFacilityDataToFacility(ownerInfo, fd);
            facilities.add(facility);
        }

        facilityRepository.saveAll(facilities);

        log.info("Created {} facilities successfully.", facilities.size());
        return facilities;
    }

    private Facility mapFacilityDataToFacility(OwnerInfo ownerInfo, FacilityData fd) {
        Set<Sport> activeSports = fd.sportCodeNames().stream()
                .map(catalogService::getSportByCode)
                .collect(Collectors.toSet());

        return Facility.builder()
                .ownerInfo(ownerInfo)
                .name(fd.name())
                .openingTime(fd.openingTime())
                .closingTime(fd.closingTime())
                .province(addressService.getProvinceByCodeName(fd.provinceCodeName()))
                .district(addressService.getDistrictByCodeName(fd.districtCodeName()))
                .ward(addressService.getWardByCodeName(fd.wardCodeName()))
                .addressDetail(fd.addressDetail())
                .geoLatitude(fd.geoLatitude())
                .geoLongitude(fd.geoLongitude())
                .status(FacilityStatus.APPROVED)
                .activeSports(activeSports)
                .build();
    }

}
