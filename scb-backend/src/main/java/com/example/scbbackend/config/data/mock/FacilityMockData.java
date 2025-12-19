package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityMockData {

    private final FacilityRepository facilityRepository;

    private record FacilityData(
            String name,
            LocalTime openingTime,
            LocalTime closingTime
    ) {}

    private static final List<FacilityData> FACILITY_DATA = List.of(
            new FacilityData("Sân Đầm Hồng", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Tsunami", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Pickfit", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Văn Phú X7", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Đại học Phenikaa", LocalTime.parse("06:00"), LocalTime.parse("23:00"))
    );

    public void mock(OwnerInfo ownerInfo) {
        List<Facility> facilities = FACILITY_DATA.stream()
                .map(d -> Facility.builder()
                        .ownerInfo(ownerInfo)
                        .name(d.name())
                        .openingTime(d.openingTime())
                        .closingTime(d.closingTime())
                        .build()
                )
                .toList();
        facilityRepository.saveAll(facilities);
    }

}
