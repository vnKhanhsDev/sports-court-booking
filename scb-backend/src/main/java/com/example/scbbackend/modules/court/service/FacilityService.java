package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.modules.court.dto.response.FacilityBasicForOwner;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    private final CourtService courtService;

    @Transactional(readOnly = true)
    public List<FacilityBasicForOwner> getFacilitiesWithCourtsByOwner(OwnerInfo ownerInfo) {
        List<Facility> facilities = facilityRepository.findByOwnerInfo(ownerInfo);

        return facilities.stream()
                .map(facility -> FacilityBasicForOwner.builder()
                        .id(facility.getId())
                        .name(facility.getName())
                        .openingTime(facility.getOpeningTime())
                        .closingTime(facility.getClosingTime())
                        .status(facility.getStatus())
                        .address("123, Cau Giay, Ha Noi")
                        .courts(courtService.getCourtBasicForOwnerByFacility(facility))
                        .build()
                ).collect(Collectors.toList());
    }

}
