package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.address.service.AddressService;
import com.example.scbbackend.modules.court.dto.request.FacilityCreationRequest;
import com.example.scbbackend.modules.court.dto.request.FacilityUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityResponse;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.court.repository.CourtImageRepository;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.court.repository.PriceListRepository;
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
    private final CourtRepository courtRepository;
    private final PriceListRepository priceListRepository;
    private final CourtImageRepository courtImageRepository;

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

        // Check if facility has any courts
        long courtCount = courtRepository.countByFacility(facility);
        if (courtCount > 0) {
            throw new AppException(ApiCode.FACILITY_HAS_COURTS);
        }

        // Check if facility is referenced by any price lists
        long priceListCount = priceListRepository.countByFacility(facility);
        if (priceListCount > 0) {
            throw new AppException(ApiCode.FACILITY_HAS_PRICE_LISTS);
        }

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

    /**
     * ADMIN: GET ALL FACILITIES
     * */
    @Transactional(readOnly = true)
    public List<AdminFacilitySummaryResponse> getAllAdminFacilities() {
        return facilityRepository.findAllAdminFacilities();
    }

    /**
     * ADMIN: APPROVE FACILITY
     * Sets facility status to APPROVED and updates all PENDING courts to ACTIVE
     * */
    @Transactional
    public List<AdminFacilitySummaryResponse> approveFacility(Long id) {
        Facility facility = getFacilityById(id);
        facility.setStatus(FacilityStatus.APPROVED);
        facilityRepository.save(facility);
        
        // Update all PENDING courts of this facility to ACTIVE
        List<Court> pendingCourts = courtRepository.findByFacility(facility).stream()
                .filter(c -> c.getStatus() == CourtStatus.PENDING)
                .peek(c -> c.setStatus(CourtStatus.ACTIVE))
                .toList();
        if (!pendingCourts.isEmpty()) {
            courtRepository.saveAll(pendingCourts);
        }
        
        return getAllAdminFacilities();
    }

    /**
     * ADMIN: REJECT FACILITY
     * Sets facility status to REJECTED and updates all PENDING courts to REJECTED
     * */
    @Transactional
    public List<AdminFacilitySummaryResponse> rejectFacility(Long id) {
        Facility facility = getFacilityById(id);
        facility.setStatus(FacilityStatus.REJECTED);
        facilityRepository.save(facility);
        
        // Update all PENDING courts of this facility to REJECTED
        List<Court> pendingCourts = courtRepository.findByFacility(facility).stream()
                .filter(c -> c.getStatus() == CourtStatus.PENDING)
                .peek(c -> c.setStatus(CourtStatus.REJECTED))
                .toList();
        if (!pendingCourts.isEmpty()) {
            courtRepository.saveAll(pendingCourts);
        }
        
        return getAllAdminFacilities();
    }

    /**
     * ADMIN: APPROVE ALL PENDING FACILITIES
     * Sets all pending facilities to APPROVED and updates their PENDING courts to ACTIVE
     * */
    @Transactional
    public List<AdminFacilitySummaryResponse> approveAllFacilities() {
        List<Facility> facilities = facilityRepository.findByStatus(FacilityStatus.PENDING);
        
        for (Facility facility : facilities) {
            facility.setStatus(FacilityStatus.APPROVED);
            
            // Update all PENDING courts of this facility to ACTIVE
            List<Court> pendingCourts = courtRepository.findByFacility(facility).stream()
                    .filter(c -> c.getStatus() == CourtStatus.PENDING)
                    .peek(c -> c.setStatus(CourtStatus.ACTIVE))
                    .toList();
            if (!pendingCourts.isEmpty()) {
                courtRepository.saveAll(pendingCourts);
            }
        }
        
        facilityRepository.saveAll(facilities);
        return getAllAdminFacilities();
    }

    /**
     * PUBLIC: GET ALL PUBLIC FACILITIES
     * Returns all APPROVED facilities with their active courts information
     * */
    @Transactional(readOnly = true)
    public List<PublicFacilityResponse> getAllPublicFacilities() {
        List<com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityResponseWithoutImages> facilities = 
                facilityRepository.findPublicFacilities(
                        CourtStatus.ACTIVE,
                        FacilityStatus.APPROVED
                );
        
        // Enrich each facility with images
        return facilities.stream()
                .map(facility -> {
                    List<String> imageUrls = courtImageRepository.findImageUrlsByFacilityAndSport(
                            facility.facilityId(),
                            facility.sportId()
                    );
                    return new PublicFacilityResponse(
                            facility.facilityId(),
                            facility.sportId(),
                            facility.facilityName(),
                            facility.sportName(),
                            facility.address(),
                            facility.totalCourts(),
                            facility.minPrice(),
                            facility.maxPrice(),
                            imageUrls
                    );
                })
                .toList();
    }


    @Transactional(readOnly = true)
    protected Facility findFacilityById(Long id) {
        return facilityRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    protected Facility getFacilityById(Long id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new AppException(ApiCode.FACILITY_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    protected Facility getFacilityByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo) {
        return facilityRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.FACILITY_NOT_FOUND));
    }

}
