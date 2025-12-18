package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.dto.request.CourtCreationRequest;
import com.example.scbbackend.modules.court.dto.request.CourtUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtDetailResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.dto.shared.CourtImageDto;
import com.example.scbbackend.modules.court.dto.shared.PriceItemDto;
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
    private final CourtPriceRepository courtPriceRepository;
    private final CourtImageRepository courtImageRepository;

    private final CatalogService catalogService;
    private final FacilityService facilityService;
    private final PriceTemplateService priceTemplateService;
    private final CourtPriceItemRepository courtPriceItemRepository;
    private final PriceService priceService;

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

        // Only fetch price template if priceTemplateId is provided
        PriceTemplate template = null;
        if (request.priceTemplateId() != null) {
            template = priceTemplateService
                    .getPriceTemplateByIdAndOwnerInfo(request.priceTemplateId(), ownerInfo);
        }

        Court court = courtRepository.save(
                Court.builder()
                        .facility(facility)
                        .sport(sport)
                        .courtType(courtType)
                        .surfaceType(surfaceType)
                        .name(request.name())
                        .priceTemplate(template)
                        .build()
        );

        // Create court price and items only if no template is used and items are provided
        if (template == null && request.items() != null && !request.items().isEmpty()) {
            CourtPrice courtPrice = courtPriceRepository.save(
                    CourtPrice.builder()
                            .court(court)
                            .build()
            );

            List<CourtPriceItem> priceItems = request.items().stream()
                    .map(i -> CourtPriceItem.builder()
                            .courtPrice(courtPrice)
                            .startTime(i.startTime())
                            .endTime(i.endTime())
                            .price(i.price())
                            .build()
                    )
                    .toList();
            courtPriceItemRepository.saveAll(priceItems);
        }

        saveCourtImages(court, request.images());

        return getAllCourts(ownerInfo);
    }

    /**
     * MAIN: GET COURT BY ID
     * */
    public OwnerCourtDetailResponse getCourtDetail(Long id, OwnerInfo ownerInfo) {
        Court court = courtRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        List<PriceItemDto> items;
        if (court.getPriceTemplate() != null) {
            items = court.getPriceTemplate().getPriceTemplateItems().stream()
                    .map(i -> new PriceItemDto(
                            i.getStartTime(),
                            i.getEndTime(),
                            i.getPrice()
                    ))
                    .toList();
        } else if (court.getCourtPrice() != null && court.getCourtPrice().getItems() != null) {
            items = court.getCourtPrice().getItems().stream()
                    .map(i -> new PriceItemDto(
                            i.getStartTime(),
                            i.getEndTime(),
                            i.getPrice()
                    ))
                    .toList();
        } else {
            items = List.of();
        }

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
                court.getPriceTemplate() != null ? court.getPriceTemplate().getId() : null,
                items,
                images,
                court.getStatus()
        );
    }

    /**
     * MAIN: UPDATE COURT
     * */
    @Transactional
    public List<OwnerCourtSummaryResponse> updateCourt(Long id, OwnerInfo ownerInfo, CourtUpdationRequest request) {
        Court court = courtRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.COURT_NOT_FOUND));

        // Only fetch price template if priceTemplateId is provided
        PriceTemplate template = null;
        if (request.priceTemplateId() != null) {
            template = priceTemplateService
                    .getPriceTemplateByIdAndOwnerInfo(request.priceTemplateId(), ownerInfo);
        }

        court.setFacility(facilityService.getFacilityByIdAndOwnerInfo(request.facilityId(), ownerInfo));
        court.setSport(catalogService.getSportById(request.sportId()));
        court.setCourtType(catalogService.getCourtTypeById(request.courtTypeId()));
        court.setSurfaceType(catalogService.getSurfaceTypeById(request.surfaceTypeId()));
        court.setName(request.name());
        court.setPriceTemplate(template);
        court.setStatus(CourtStatus.fromString(request.status()));

        // Handle price template and court price updates
        if (template != null) {
            // If a template is selected, delete existing court price and items
            CourtPrice existingCourtPrice = court.getCourtPrice();
            if (existingCourtPrice != null) {
                // Delete items first to avoid foreign key constraint violations
                if (existingCourtPrice.getItems() != null && !existingCourtPrice.getItems().isEmpty()) {
                    courtPriceItemRepository.deleteAll(existingCourtPrice.getItems());
                }
                courtPriceRepository.delete(existingCourtPrice);
                court.setCourtPrice(null);
            }
        } else if (request.items() != null && !request.items().isEmpty()) {
            // If no template but items are provided, save/update court prices
            // saveCourtPrices will handle updating existing or creating new CourtPrice
            priceService.saveCourtPrices(court, request.items());
        } else {
            // If no template and no items, clear existing court price and items
            CourtPrice existingCourtPrice = court.getCourtPrice();
            if (existingCourtPrice != null) {
                // Delete items first to avoid foreign key constraint violations
                if (existingCourtPrice.getItems() != null && !existingCourtPrice.getItems().isEmpty()) {
                    courtPriceItemRepository.deleteAll(existingCourtPrice.getItems());
                }
                courtPriceRepository.delete(existingCourtPrice);
                court.setCourtPrice(null);
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
