package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.dto.request.CourtCreationRequest;
import com.example.scbbackend.modules.court.dto.request.CourtUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtDetailResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import com.example.scbbackend.modules.court.domain.valueobject.PriceSlotKey;
import com.example.scbbackend.modules.court.entity.*;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.repository.*;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    private final CourtImageRepository courtImageRepository;

    private final CatalogService catalogService;
    private final FacilityService facilityService;
    private final PriceListService priceListService;

    /**
     * MAIN: GET ALL COURTS
     * */
    @Transactional(readOnly = true)
    public List<OwnerCourtSummaryResponse> getAllCourts(OwnerInfo ownerInfo) {
        return courtRepository.getAllSummaryCourtsByOwnerInfo(ownerInfo);
    }

    /**
     * MAIN: CREATE COURT
     * */
    @Transactional
    public List<OwnerCourtSummaryResponse> createCourt(OwnerInfo ownerInfo, CourtCreationRequest request) {
        Facility facility = facilityService.getFacilityByIdAndOwnerInfo(request.facilityId(), ownerInfo);

        var sport = catalogService.getSportById(request.sportId());
        var courtType = catalogService.getCourtTypeById(request.courtTypeId());
        var surfaceType = catalogService.getSurfaceTypeById(request.surfaceTypeId());

        // Determine price list for this court:
        // - use existing shared price list if priceListId is provided
        // - otherwise create a new private price list with the provided slots
        PriceList priceList;
        if (request.priceListId() != null) {
            priceList = priceListService.getPriceListById(request.priceListId(), ownerInfo);
        } else if (request.slots() != null && !request.slots().isEmpty()) {
            String privateName = String.format("PriceList %s V%d", request.name(), 1);

            PriceList privatePriceList = PriceList.builder()
                    .ownerInfo(ownerInfo)
                    .facility(facility)
                    .sport(sport)
                    .courtType(courtType)
                    .surfaceType(surfaceType)
                    .name(privateName)
                    .version(1)
                    .isActive(true)
                    .build();

            priceList = priceListService.savePriceListForCourt(privatePriceList, request.slots());
        } else {
            // Court must always have a price list: either reuse an existing one or define slots
            throw new AppException(ApiCode.COURT_PRICE_INPUT_INVALID);
        }

        Court court = courtRepository.save(
                Court.builder()
                        .facility(facility)
                        .sport(sport)
                        .courtType(courtType)
                        .surfaceType(surfaceType)
                        .name(request.name())
                        .priceList(priceList)
                        .build()
        );

        saveCourtImages(court, request.images());

        return getAllCourts(ownerInfo);
    }

    /**
     * MAIN: GET COURT BY ID
     */
    public OwnerCourtDetailResponse getCourtDetail(Long id, OwnerInfo ownerInfo) {
        Court court = courtRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        // Build slots from the court's price list (shared or private)
        List<PriceSlotDto> slots = (court.getPriceList() != null && court.getPriceList().getPriceSlots() != null)
                ? court.getPriceList().getPriceSlots().stream()
                .map(s -> new PriceSlotDto(
                        s.getFromTime(),
                        s.getToTime(),
                        s.getPrice()
                ))
                .toList()
                : List.of();

        List<CourtImageDto> images = (court.getImages() != null)
                ? court.getImages().stream()
                .map(i -> new CourtImageDto(
                        i.getImageUrl(),
                        i.getDisplayOrder()
                ))
                .toList()
                : List.of();

        return new OwnerCourtDetailResponse(
                court.getFacility().getId(),
                court.getSport().getId(),
                court.getCourtType().getId(),
                court.getSurfaceType().getId(),
                court.getName(),
                court.getPriceList() != null ? court.getPriceList().getId() : null,
                slots,
                images,
                court.getStatus()
        );
    }

    private boolean hasSlotChanged(
            List<PriceSlot> existingSlots, List<PriceSlotDto> newSlots
    ) {
        if (existingSlots.size() != newSlots.size()) return true;

        return !existingSlots.stream()
                .map(PriceSlotKey::from)
                .collect(java.util.stream.Collectors.toSet())
                .equals(
                        newSlots.stream()
                                .map(PriceSlotKey::from)
                                .collect(java.util.stream.Collectors.toSet())
                );
    }

    /**
     * MAIN: UPDATE COURT
     */
    @Transactional
    public List<OwnerCourtSummaryResponse> updateCourt(Long id, OwnerInfo ownerInfo, CourtUpdationRequest request) {
        Court court = courtRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        // Update basic court info
        court.setFacility(facilityService.getFacilityByIdAndOwnerInfo(request.facilityId(), ownerInfo));
        court.setSport(catalogService.getSportById(request.sportId()));
        court.setCourtType(catalogService.getCourtTypeById(request.courtTypeId()));
        court.setSurfaceType(catalogService.getSurfaceTypeById(request.surfaceTypeId()));
        court.setName(request.name());
        court.setStatus(CourtStatus.fromString(request.status()));

        // Handle pricing via PriceList / PriceSlot
        PriceList currentPriceList = court.getPriceList();

        if (request.priceListId() != null) {
            // Switch to an existing shared price list
            PriceList sharedPriceList = priceListService.getPriceListById(request.priceListId(), ownerInfo);
            court.setPriceList(sharedPriceList);
        } else if (request.slots() != null && !request.slots().isEmpty()) {
            // Use / create / version a private price list for this court
            if (currentPriceList == null || currentPriceList.getCourt() == null) {
                // No private price list yet (or currently using a shared one) -> create V1
                String privateName = String.format("PriceList %s V%d", court.getName(), 1);

                PriceList privatePriceList = PriceList.builder()
                        .ownerInfo(ownerInfo)
                        .facility(court.getFacility())
                        .sport(court.getSport())
                        .courtType(court.getCourtType())
                        .surfaceType(court.getSurfaceType())
                        .court(court)
                        .name(privateName)
                        .version(1)
                        .isActive(true)
                        .build();

                PriceList saved = priceListService.savePriceListForCourt(privatePriceList, request.slots());
                court.setPriceList(saved);
            } else {
                // Already using a private price list -> check if slots changed
                var existingSlots = currentPriceList.getPriceSlots().stream().toList();

                boolean slotsChanged = hasSlotChanged(existingSlots, request.slots());

                if (slotsChanged) {
                    int newVersion = currentPriceList.getVersion() + 1;
                    String privateName = String.format("PriceList %s V%d", court.getName(), newVersion);

                    PriceList newPriceList = PriceList.builder()
                            .ownerInfo(ownerInfo)
                            .facility(court.getFacility())
                            .sport(court.getSport())
                            .courtType(court.getCourtType())
                            .surfaceType(court.getSurfaceType())
                            .court(court)
                            .name(privateName)
                            .version(newVersion)
                            .isActive(true)
                            .build();

                    PriceList saved = priceListService.savePriceListForCourt(newPriceList, request.slots());
                    court.setPriceList(saved);
                } else {
                    // Slots unchanged -> keep current private price list but sync meta with court
                    currentPriceList.setFacility(court.getFacility());
                    currentPriceList.setSport(court.getSport());
                    currentPriceList.setCourtType(court.getCourtType());
                    currentPriceList.setSurfaceType(court.getSurfaceType());
                }
            }
        }

        // Save the court entity to persist the changes
        courtRepository.save(court);

        saveCourtImages(court, request.images());

        return getAllCourts(ownerInfo);
    }

    /**
     * MAIN: DELETE COURT
     * */
    @Transactional
    public List<OwnerCourtSummaryResponse> deleteCourt(Long id, OwnerInfo ownerInfo) {
        Court court = courtRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        courtRepository.delete(court);

        return getAllCourts(ownerInfo);
    }

    @Transactional
    public void syncCourtStatusOnFacilityApproved(Facility facility) {
        List<Court> courts = courtRepository.findByFacility(facility).stream()
                .peek(c -> c.setStatus(CourtStatus.ACTIVE))
                .toList();
        courtRepository.saveAll(courts);
    }

    @Transactional
    public void syncCourtStatusOnFacilityRejected(Facility facility) {
        List<Court> courts = courtRepository.findByFacility(facility).stream()
                .peek(c -> c.setStatus(CourtStatus.REJECTED))
                .toList();
        courtRepository.saveAll(courts);
    }

    /**
     * Save court images for creation & updation
     * For updates, replace old images with new ones
     * */
    private void saveCourtImages(Court court, List<CourtImageDto> imageDtos) {
        // For updates, delete existing images before adding new ones
        // This ensures images are replaced, not duplicated
        if (court.getId() != null && court.getImages() != null && !court.getImages().isEmpty()) {
            courtImageRepository.deleteAll(court.getImages());
        }

        // Save new images if provided
        if (imageDtos == null || imageDtos.isEmpty()) {
            return;
        }

        List<CourtImage> images = imageDtos.stream()
                .map(i -> CourtImage.builder()
                        .court(court)
                        .imageUrl(i.imageUrl())
                        .displayOrder(i.displayOrder())
                        .build()
                )
                .toList();

        courtImageRepository.saveAll(images);
    }

}
