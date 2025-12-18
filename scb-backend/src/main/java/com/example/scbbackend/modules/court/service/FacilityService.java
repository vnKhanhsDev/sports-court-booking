package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.address.service.AddressService;
import com.example.scbbackend.modules.court.dto.request.FacilityCreationRequest;
import com.example.scbbackend.modules.court.dto.request.FacilityUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.FacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    private final AddressService addressService;

    @Transactional(readOnly = true)
    public List<OwnerFacilitySummaryResponse> getAllFacilities(OwnerInfo ownerInfo) {
        return facilityRepository.findSummaryByOwnerInfo(ownerInfo);
    }

    @Transactional
    public List<OwnerFacilitySummaryResponse> createFacility(OwnerInfo ownerInfo, FacilityCreationRequest request) {
        facilityRepository.save(
                Facility.builder()
                        .ownerInfo(ownerInfo)
                        .name(request.name())
                        .description(request.description())
                        .openingTime(request.openingTime())
                        .closingTime(request.closingTime())
                        .province(addressService.findProvinceByCode(request.provinceCode()))
                        .district(addressService.findDistrictByCode(request.districtCode()))
                        .ward(addressService.findWardByCode(request.wardCode()))
                        .addressDetail(request.addressDetail())
                        .geoLatitude(request.geoLatitude())
                        .geoLongitude(request.geoLongitude())
                        .build()
        );

        return getAllFacilities(ownerInfo);
    }

    @Transactional(readOnly = true)
    public FacilityDetailResponse getFacilityDetail(Long id, OwnerInfo ownerInfo) {
        Facility facility = getFacilityByIdAndOwnerInfo(id, ownerInfo);

        return new FacilityDetailResponse(
                facility.getName(),
                facility.getDescription(),
                facility.getOpeningTime(),
                facility.getClosingTime(),
                facility.getProvince() != null ? facility.getProvince().getCode() : null,
                facility.getDistrict() != null ? facility.getDistrict().getCode() : null,
                facility.getWard() != null ? facility.getWard().getCode() : null,
                facility.getAddressDetail(),
                facility.getGeoLatitude(),
                facility.getGeoLongitude(),
                facility.getStatus()
        );
    }

    @Transactional
    public List<OwnerFacilitySummaryResponse> updateFacility(Long id, OwnerInfo ownerInfo, FacilityUpdationRequest request) {
        Facility facility = getFacilityByIdAndOwnerInfo(id, ownerInfo);

        facility.setName(request.name());
        facility.setDescription(request.description());
        facility.setOpeningTime(request.openingTime());
        facility.setClosingTime(request.closingTime());
        facility.setProvince(addressService.findProvinceByCode(request.provinceCode()));
        facility.setDistrict(addressService.findDistrictByCode(request.districtCode()));
        facility.setWard(addressService.findWardByCode(request.wardCode()));
        facility.setAddressDetail(request.addressDetail());
        facility.setGeoLatitude(request.geoLatitude());
        facility.setGeoLongitude(request.geoLongitude());
        facility.setStatus(FacilityStatus.fromString(request.status()));

        return getAllFacilities(ownerInfo);
    }

    @Transactional
    public List<OwnerFacilitySummaryResponse> deleteFacility(Long id, OwnerInfo ownerInfo) {
        Facility facility = getFacilityByIdAndOwnerInfo(id, ownerInfo);

        facilityRepository.delete(facility);

        return getAllFacilities(ownerInfo);
    }

    @Transactional(readOnly = true)
    public List<FacilityOptionResponse> getFacilityOptions(OwnerInfo ownerInfo) {
        return facilityRepository.findByOwnerInfo(ownerInfo).stream()
                .map(f -> new FacilityOptionResponse(
                        f.getId(),
                        f.getName()
                ))
                .toList();
    }


    @Transactional(readOnly = true)
    protected Facility findFacilityById(Long id) {
        return facilityRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    protected Facility getFacilityByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo) {
        return facilityRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.FACILITY_NOT_FOUND));
    }

}
