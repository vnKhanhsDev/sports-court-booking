package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.domain.valueobject.PriceTemplateItemKey;
import com.example.scbbackend.modules.court.dto.request.PriceTemplateUpsertRequest;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateOptionResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateSummaryResponse;
import com.example.scbbackend.modules.court.dto.shared.PriceTemplateItemDto;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.court.entity.PriceTemplateItem;
import com.example.scbbackend.modules.court.repository.PriceTemplateItemRepository;
import com.example.scbbackend.modules.court.repository.PriceTemplateRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceTemplateService {

    private final PriceTemplateRepository priceTemplateRepository;
    private final PriceTemplateItemRepository priceTemplateItemRepository;

    private final FacilityService facilityService;
    private final CatalogService catalogService;
    private final CourtService courtService;

    /**
     * Get all price templates for management
     * @param ownerInfo: owner info
     * @return List<PriceTemplateSummaryResponse>: price template list
     * */
    @Transactional(readOnly = true)
    public List<PriceTemplateSummaryResponse> getAllPriceTemplates(OwnerInfo ownerInfo) {
        return priceTemplateRepository.findByOwnerInfo(ownerInfo).stream()
                .map(t ->
                        new PriceTemplateSummaryResponse(
                                t.getId(),
                                t.getName(),
                                t.getVersion(),
                                courtService.getAllCourtsByPriceTemplate(t).size(),
                                t.isActive()
                        )
                )
                .toList();
    }

    /**
     * Create new price template
     * */
    @Transactional
    public List<PriceTemplateSummaryResponse> createPriceTemplate(OwnerInfo ownerInfo, PriceTemplateUpsertRequest request) {
        final int DEFAULT_VERSION = 1;

        savePriceTemplate(ownerInfo, request, DEFAULT_VERSION);

        return getAllPriceTemplates(ownerInfo);
    }

    /**
     * Get price template by id
     * */
    @Transactional(readOnly = true)
    public PriceTemplateDetailResponse getPriceTemplateById(Long id, OwnerInfo ownerInfo) {
        PriceTemplate t = getPriceTemplateByIdAndOwnerInfo(id, ownerInfo);

        List<PriceTemplateItemDto> items = priceTemplateItemRepository.findByPriceTemplate(t).stream()
                .map(i -> new PriceTemplateItemDto(
                        i.getStartTime(),
                        i.getEndTime(),
                        i.getPrice()
                ))
                .toList();

        return new PriceTemplateDetailResponse(
                t.getId(),
                t.getFacility() != null ? t.getFacility().getId() : null,
                t.getSport() != null ? t.getSport().getId() : null,
                t.getCourtType() != null ? t.getCourtType().getId() : null,
                t.getSurfaceType() != null ? t.getSurfaceType().getId() : null,
                t.getName(),
                t.getDescription(),
                t.getVersion(),
                t.isActive(),
                items
        );
    }

    /**
     * Get price template items by price template id
     * */
    @Transactional(readOnly = true)
    public List<PriceTemplateItemDto> getAllPriceTemplateItemsByPriceTemplateId(Long id, OwnerInfo ownerInfo) {
        PriceTemplate template = getPriceTemplateByIdAndOwnerInfo(id, ownerInfo);

        return priceTemplateItemRepository.findByPriceTemplate(template).stream()
                .map(i -> new PriceTemplateItemDto(
                        i.getStartTime(),
                        i.getEndTime(),
                        i.getPrice()
                ))
                .toList();
    }

    /**
     * Update price template
     * */
    @Transactional
    public List<PriceTemplateSummaryResponse> updatePriceTemplate(
            Long id, OwnerInfo ownerInfo, PriceTemplateUpsertRequest request
    ) {
        PriceTemplate existingTemplate = getPriceTemplateByIdAndOwnerInfo(id, ownerInfo);
        List<PriceTemplateItem> existingItems = priceTemplateItemRepository.findByPriceTemplate(existingTemplate);

        boolean itemsChanged = hasItemsChanged(existingItems, request.items());

        if (itemsChanged) {
            int version = existingTemplate.getVersion() + 1;
            createNewVersion(ownerInfo, request, version);
        } else {
            existingTemplate.setFacility(request.facilityId() != null ? facilityService.getFacilityById(request.facilityId()) : null);
            existingTemplate.setSport(request.sportId() != null ? catalogService.getSportById(request.sportId()) : null);
            existingTemplate.setCourtType(request.courtTypeId() != null ? catalogService.getCourtTypeById(request.courtTypeId()) : null);
            existingTemplate.setSurfaceType(request.surfaceTypeId() != null ? catalogService.getSurfaceTypeById(request.surfaceTypeId()) : null);
            existingTemplate.setName(request.name());
            existingTemplate.setDescription(request.description());
            existingTemplate.setActive(request.isActive());

            priceTemplateRepository.save(existingTemplate);
        }

        return getAllPriceTemplates(ownerInfo);
    }

    private boolean hasItemsChanged(
            List<PriceTemplateItem> existingItems, List<PriceTemplateItemDto> newItems
    ) {
        if (existingItems.size() != newItems.size()) return true;

        return !existingItems.stream()
                .map(PriceTemplateItemKey::from)
                .collect(Collectors.toSet())
                .equals(
                        newItems.stream()
                                .map(PriceTemplateItemKey::from)
                                .collect(Collectors.toSet())
                );
    }

    private void createNewVersion(
            OwnerInfo ownerInfo, PriceTemplateUpsertRequest request, int version
    ) {
        savePriceTemplate(ownerInfo, request, version);
    }

    /**
     * Delete price template
     * */
    @Transactional
    public List<PriceTemplateSummaryResponse> deletePriceTemplate(Long id, OwnerInfo ownerInfo) {
        PriceTemplate template = getPriceTemplateByIdAndOwnerInfo(id, ownerInfo);

        int appliedCourtCount = courtService.getAllCourtsByPriceTemplate(template).size();

        if (appliedCourtCount > 0) {
            throw new AppException(ApiCode.PRICE_TEMPLATE_IN_USE);
        }

        List<PriceTemplateItem> existingItems = priceTemplateItemRepository.findByPriceTemplate(template);
        priceTemplateItemRepository.deleteAll(existingItems);

        priceTemplateRepository.delete(template);

        return getAllPriceTemplates(ownerInfo);
    }

    /**
     * Get all price template options
     * */
    @Transactional(readOnly = true)
    public List<PriceTemplateOptionResponse> getAllPriceTemplateOptions(OwnerInfo ownerInfo) {
        return priceTemplateRepository.findByOwnerInfo(ownerInfo).stream()
                .filter(PriceTemplate::isActive)
                .map(t -> new PriceTemplateOptionResponse(
                        t.getId(),
                        t.getFacility() != null ? t.getFacility().getId() : null,
                        t.getSport() != null ? t.getSport().getId() : null,
                        t.getCourtType() != null ? t.getCourtType().getId() : null,
                        t.getSurfaceType() != null ? t.getSurfaceType().getId() : null,
                        t.getName()
                ))
                .toList();
    }

    private PriceTemplate getPriceTemplateByIdAndOwnerInfo(Long id, OwnerInfo ownerInfo) {
        PriceTemplate template = priceTemplateRepository
                .findByIdAndOwnerInfo(id, ownerInfo).orElse(null);

        if (template == null)
            throw new AppException(ApiCode.PRICE_TEMPLATE_NOT_FOUND);

        return template;
    }


    private void savePriceTemplate(
            OwnerInfo ownerInfo, PriceTemplateUpsertRequest request, int version
    ) {
        PriceTemplate template = priceTemplateRepository.save(
                PriceTemplate.builder()
                        .ownerInfo(ownerInfo)
                        .facility(request.facilityId() != null ? facilityService.getFacilityById(request.facilityId()) : null)
                        .sport(request.sportId() != null ? catalogService.getSportById(request.sportId()) : null)
                        .courtType(request.courtTypeId() != null ? catalogService.getCourtTypeById(request.courtTypeId()) : null)
                        .surfaceType(request.surfaceTypeId() != null ? catalogService.getSurfaceTypeById(request.surfaceTypeId()) : null)
                        .name(request.name())
                        .description(request.description())
                        .version(version)
                        .isActive(request.isActive())
                        .build()
        );

        request.items().forEach(item ->
                priceTemplateItemRepository.save(
                        PriceTemplateItem.builder()
                                .priceTemplate(template)
                                .startTime(item.startTime())
                                .endTime(item.endTime())
                                .price(item.price())
                                .build()
                )
        );
    }

}
