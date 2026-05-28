package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.court.dto.request.FacilityCreationRequest;
import com.example.scbbackend.modules.court.dto.request.FacilityUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.pub.FacilitySportKey;
import com.example.scbbackend.modules.court.dto.response.pub.DisplayFacilityImages;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.CourtImage;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;
    private final CourtRepository courtRepository;
    private final PriceListRepository priceListRepository;
    private final CourtImageRepository courtImageRepository;

    // =====================================================
    // OWNER FACILITY SERVICES
    // =====================================================


    // =====================================================
    // ADMIN FACILITY SERVICES
    // =====================================================


    // =====================================================
    // PUBLIC FACILITY SERVICES
    // =====================================================

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
                        .provinceCode(request.provinceCode())
                        .wardCode(request.wardCode())
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
                facility.getProvinceCode(),
                facility.getWardCode(),
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
        facility.setProvinceCode(request.provinceCode());
        facility.setWardCode(request.wardCode());
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
     * PUBLIC: GET ALL NEARBY FACILITIES
     * Returns up to 10 facilities closest to the given coordinates
     * */
    @Transactional(readOnly = true)
    public List<PublicFacilitySummaryResponse> getAllNearbyFacilities(
            Double geoLatitude, Double geoLongitude
    ) {
        List<Object[]> results = facilityRepository.findNearbyFacilitiesNative(
                geoLatitude,
                geoLongitude,
                FacilityStatus.APPROVED.name(),
                CourtStatus.ACTIVE.name()
        );

        return results.stream()
                .map(row -> {
                    Long facilityId = ((Number) row[0]).longValue();
                    String facilityName = (String) row[1];
                    Long sportId = ((Number) row[2]).longValue();
                    String sportName = (String) row[3];
                    String address = (String) row[4];
                    Long totalCourts = ((Number) row[5]).longValue();
                    BigDecimal minPrice = row[6] != null ? (BigDecimal) row[6] : null;
                    BigDecimal maxPrice = row[7] != null ? (BigDecimal) row[7] : null;
                    List<String> imageUrls = null; // Will be populated if needed

                    return new PublicFacilitySummaryResponse(
                            facilityId,
                            facilityName,
                            sportId,
                            sportName,
                            address,
                            totalCourts,
                            minPrice,
                            maxPrice,
                            imageUrls
                    );
                })
                .toList();
    }

    /**
     * PUBLIC: GET ALL PUBLIC FACILITIES
     * Returns all APPROVED facilities with their active courts information
     * */
    @Transactional(readOnly = true)
    public List<PublicFacilitySummaryResponse> getAllPublicFacilities() {
        List<PublicFacilitySummaryResponse> facilities =
                facilityRepository.findPublicFacilities(FacilityStatus.APPROVED, CourtStatus.ACTIVE);

        List<Long> facilityIds = facilities.stream()
                .map(PublicFacilitySummaryResponse::facilityId)
                .distinct()
                .toList();

        List<DisplayFacilityImages> images = courtImageRepository.findDisplayFacilityImages(facilityIds);

        Map<FacilitySportKey, List<String>> imageMap =
                images.stream()
                        .collect(Collectors.groupingBy(
                                DisplayFacilityImages::key,
                                Collectors.mapping(
                                        DisplayFacilityImages::imageUrl,
                                        Collectors.toList()
                                )
                        ));

        return facilities.stream()
                .map(f -> new PublicFacilitySummaryResponse(
                        f.facilityId(),
                        f.facilityName(),
                        f.sportId(),
                        f.sportName(),
                        f.address(),
                        f.totalCourts(),
                        f.minPrice(),
                        f.maxPrice(),
                        imageMap.getOrDefault(
                                new FacilitySportKey(f.facilityId(), f.sportId()),
                                List.of()
                        )
                ))
                .toList();
    }

    /**
     * PUBLIC: GET FEATURED FACILITIES BY SPORT ID
     * Returns up to 6 APPROVED facilities for a specific sport with their active courts information
     * */
    @Transactional(readOnly = true)
    public List<PublicFacilitySummaryResponse> getFeaturedFacilitiesBySportId(Long sportId) {
        List<PublicFacilitySummaryResponse> facilities =
                facilityRepository.findPublicFacilitiesBySportId(
                        FacilityStatus.APPROVED,
                        CourtStatus.ACTIVE,
                        sportId
                );

        // Limit to 6 facilities
        facilities = facilities.stream()
                .limit(6)
                .toList();

        List<Long> facilityIds = facilities.stream()
                .map(PublicFacilitySummaryResponse::facilityId)
                .distinct()
                .toList();

        List<DisplayFacilityImages> images = courtImageRepository.findDisplayFacilityImages(facilityIds);

        Map<FacilitySportKey, List<String>> imageMap =
                images.stream()
                        .collect(Collectors.groupingBy(
                                DisplayFacilityImages::key,
                                Collectors.mapping(
                                        DisplayFacilityImages::imageUrl,
                                        Collectors.toList()
                                )
                        ));

        return facilities.stream()
                .map(f -> new PublicFacilitySummaryResponse(
                        f.facilityId(),
                        f.facilityName(),
                        f.sportId(),
                        f.sportName(),
                        f.address(),
                        f.totalCourts(),
                        f.minPrice(),
                        f.maxPrice(),
                        imageMap.getOrDefault(
                                new FacilitySportKey(f.facilityId(), f.sportId()),
                                List.of()
                        )
                ))
                .toList();
    }

    /**
     * PUBLIC: GET PUBLIC FACILITY DETAIL BY FACILITY ID AND SPORT ID
     * Returns detailed information about an APPROVED facility for a specific sport
     * */
    @Transactional(readOnly = true)
    public PublicFacilityDetailResponse getPublicFacilityDetail(Long facilityId, Long sportId) {
        Facility facility = facilityRepository.findPublicFacilityById(
                facilityId,
                FacilityStatus.APPROVED
        ).orElseThrow(() -> new AppException(ApiCode.FACILITY_NOT_FOUND));
        
        // Verify sport is in facility's active sports
        boolean hasSport = facility.getActiveSports().stream()
                .anyMatch(sport -> sport.getId().equals(sportId));
        if (!hasSport) {
            throw new AppException(ApiCode.FACILITY_NOT_FOUND);
        }
        
        // Get sport name
        String sportName = facility.getActiveSports().stream()
                .filter(sport -> sport.getId().equals(sportId))
                .findFirst()
                .map(Sport::getName)
                .orElse("");
        
        // Get all ACTIVE courts for this facility and sport
        // Note: This query eagerly fetches all images via LEFT JOIN FETCH c.images
        List<Court> courts = courtRepository.findPublicCourtsByFacilityAndSport(
                facilityId,
                sportId,
                CourtStatus.ACTIVE,
                FacilityStatus.APPROVED
        );
        
        // Collect ALL images from ALL courts (not filtered by displayOrder)
        // Use direct query to ensure all images are retrieved, as LEFT JOIN FETCH with multiple collections
        // can sometimes miss images due to cartesian product issues
        List<String> allImageUrls = courtImageRepository.findAllImageUrlsByFacilityAndSport(
                facilityId,
                sportId
        );
        
        // Calculate min and max prices from all price slots of all courts
        BigDecimal minPrice = courts.stream()
                .filter(court -> court.getPriceList() != null && court.getPriceList().getPriceSlots() != null)
                .flatMap(court -> court.getPriceList().getPriceSlots().stream())
                .map(com.example.scbbackend.modules.court.entity.PriceSlot::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(null);
        
        BigDecimal maxPrice = courts.stream()
                .filter(court -> court.getPriceList() != null && court.getPriceList().getPriceSlots() != null)
                .flatMap(court -> court.getPriceList().getPriceSlots().stream())
                .map(com.example.scbbackend.modules.court.entity.PriceSlot::getPrice)
                .max(BigDecimal::compareTo)
                .orElse(null);
        
        // Build court summaries
        List<PublicFacilityDetailResponse.CourtSummary> courtSummaries = courts.stream()
                .map(court -> {
                    // Get all images for this court, sorted by displayOrder
                    List<String> courtImageUrls = court.getImages().stream()
                            .sorted((img1, img2) -> Integer.compare(img1.getDisplayOrder(), img2.getDisplayOrder()))
                            .map(CourtImage::getImageUrl)
                            .toList();
                    
                    return new PublicFacilityDetailResponse.CourtSummary(
                            court.getId(),
                            court.getName(),
                            court.getCourtType().getName(),
                            court.getSurfaceType().getName(),
                            courtImageUrls
                    );
                })
                .toList();
        
        return new PublicFacilityDetailResponse(
                facility.getId(),
                facility.getName(),
                facility.getDescription(),
                facility.getFullAddress(),
                facility.getGeoLatitude(),
                facility.getGeoLongitude(),
                facility.getOpeningTime(),
                facility.getClosingTime(),
                sportId,
                sportName,
                (long) courts.size(),
                minPrice,
                maxPrice,
                allImageUrls,
                courtSummaries
        );
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
