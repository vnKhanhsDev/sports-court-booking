package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.domain.valueobject.PriceSlotKey;
import com.example.scbbackend.modules.court.dto.request.PriceListUpsertRequest;
import com.example.scbbackend.modules.court.dto.response.PriceListDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListOptionResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListSummaryResponse;
import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.entity.PriceSlot;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.PriceListRepository;
import com.example.scbbackend.modules.court.repository.PriceSlotRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceListService {

    private final PriceListRepository priceListRepository;
    private final PriceSlotRepository priceSlotRepository;
    private final CourtRepository courtRepository;

    private final FacilityService facilityService;
    private final CatalogService catalogService;

    @Transactional(readOnly = true)
    public List<PriceListSummaryResponse> getAllPriceLists(OwnerInfo ownerInfo) {
        List<PriceList> priceLists = priceListRepository.findAllByOwnerInfoAndCourtIsNull(ownerInfo);

        return priceLists.stream()
                .map(pl -> new PriceListSummaryResponse(
                        pl.getId(),
                        pl.getName(),
                        pl.getVersion(),
                        courtRepository.countByPriceList(pl),
                        pl.isActive()
                ))
                .toList();
    }

    @Transactional
    public List<PriceListSummaryResponse> createPriceList(OwnerInfo ownerInfo, PriceListUpsertRequest request) {
        final int DEFAULT_VERSION = 1;

        savePriceList(ownerInfo, request, DEFAULT_VERSION);

        return getAllPriceLists(ownerInfo);
    }

    @Transactional(readOnly = true)
    public PriceListDetailResponse getPriceListDetail(Long id, OwnerInfo ownerInfo) {
        PriceList priceList = getPriceListById(id, ownerInfo);

        List<PriceSlotDto> slots = priceList.getPriceSlots().stream()
                .map(s -> new PriceSlotDto(
                        s.getFromTime(),
                        s.getToTime(),
                        s.getPrice()
                ))
                .toList();

        return new PriceListDetailResponse(
                priceList.getId(),
                priceList.getFacility() != null ? priceList.getFacility().getId() : null,
                priceList.getSport() != null ? priceList.getSport().getId() : null,
                priceList.getCourtType() != null ? priceList.getCourtType().getId() : null,
                priceList.getSurfaceType() != null ? priceList.getSurfaceType().getId() : null,
                priceList.getName(),
                priceList.getNote(),
                priceList.getVersion(),
                priceList.isActive(),
                slots
        );
    }

    @Transactional
    public List<PriceListSummaryResponse> updatePriceList(Long id, OwnerInfo ownerInfo, PriceListUpsertRequest request) {
        PriceList existingPriceList = getPriceListById(id, ownerInfo);
        List<PriceSlot> existingSlots = existingPriceList.getPriceSlots().stream().toList();

        boolean slotsChanged = hasSlotChanged(existingSlots, request.slots());

        if (slotsChanged) {
            int version = existingPriceList.getVersion() + 1;
            savePriceList(ownerInfo, request, version);
        } else {
            existingPriceList.setFacility(request.facilityId() != null ?
                    facilityService.findFacilityById(existingPriceList.getFacility().getId()) : null);
            existingPriceList.setSport(request.sportId() != null ?
                    catalogService.findSportById(existingPriceList.getSport().getId()) : null);
            existingPriceList.setCourtType(request.courtTypeId() != null ?
                    catalogService.findCourtTypeById(existingPriceList.getCourtType().getId()) : null);
            existingPriceList.setSurfaceType(request.surfaceTypeId() != null ?
                    catalogService.findSurfaceTypeById(existingPriceList.getSurfaceType().getId()) : null);
            existingPriceList.setName(request.name());
            existingPriceList.setNote(request.note());
            existingPriceList.setActive(request.isActive());

            priceListRepository.save(existingPriceList);
        }

        return getAllPriceLists(ownerInfo);
    }

    private boolean hasSlotChanged(
            List<PriceSlot> existingSlots, List<PriceSlotDto> newSlots
    ) {
        if (existingSlots.size() != newSlots.size()) return true;

        return !existingSlots.stream()
                .map(PriceSlotKey::from)
                .collect(Collectors.toSet())
                .equals(
                        newSlots.stream()
                                .map(PriceSlotKey::from)
                                .collect(Collectors.toSet())
                );
    }

    @Transactional
    public List<PriceListSummaryResponse> deletePriceList(Long id, OwnerInfo ownerInfo) {
        PriceList priceList = getPriceListById(id, ownerInfo);

        if (courtRepository.countByPriceList(priceList) > 0) {
            throw new AppException(ApiCode.PRICE_TEMPLATE_IN_USE);
        }

        List<PriceSlot> existingSlots = priceList.getPriceSlots().stream().toList();
        priceSlotRepository.deleteAll(existingSlots);

        priceListRepository.delete(priceList);

        return getAllPriceLists(ownerInfo);
    }

    @Transactional(readOnly = true)
    public List<PriceListOptionResponse> getAllPriceListOptions(OwnerInfo ownerInfo) {
        List<PriceList> priceLists = priceListRepository.findAllByOwnerInfoAndCourtIsNull(ownerInfo);

        return priceLists.stream()
                .map(pl -> new PriceListOptionResponse(
                        pl.getId(),
                        pl.getFacility() != null ? pl.getFacility().getId() : null,
                        pl.getSport() != null ? pl.getSport().getId() : null,
                        pl.getCourtType() != null ? pl.getCourtType().getId() : null,
                        pl.getSurfaceType() != null ? pl.getSurfaceType().getId() : null,
                        pl.getName()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    protected PriceList getPriceListById(Long id, OwnerInfo ownerInfo) {
        return priceListRepository.findByIdAndOwnerInfo(id, ownerInfo)
                .orElseThrow(() -> new AppException(ApiCode.PRICE_LIST_NOT_FOUND));
    }

    @Transactional
    protected void savePriceList(
            OwnerInfo ownerInfo, PriceListUpsertRequest request, int version
    ) {
        PriceList priceList = priceListRepository.save(
                PriceList.builder()
                        .ownerInfo(ownerInfo)
                        .facility(request.facilityId() != null ? facilityService.findFacilityById(request.facilityId()) : null)
                        .sport(request.sportId() != null ? catalogService.findSportById(request.sportId()) : null)
                        .courtType(request.courtTypeId() != null ? catalogService.findCourtTypeById(request.courtTypeId()) : null)
                        .surfaceType(request.surfaceTypeId() != null ? catalogService.findSurfaceTypeById(request.surfaceTypeId()) : null)
                        .name(request.name())
                        .note(request.note())
                        .version(version)
                        .isActive(request.isActive())
                        .build()
        );

        request.slots().forEach(s -> priceSlotRepository.save(
                PriceSlot.builder()
                        .priceList(priceList)
                        .fromTime(s.fromTime())
                        .toTime(s.toTime())
                        .price(s.price())
                        .build()
        ));
    }

    @Transactional
    public PriceList savePriceListForCourt(PriceList priceList, List<PriceSlotDto> priceSlots) {
        PriceList savedPriceList = priceListRepository.save(priceList);

        if (priceSlots != null && !priceSlots.isEmpty()) {
            priceSlots.forEach(s -> priceSlotRepository.save(
                    PriceSlot.builder()
                            .priceList(savedPriceList)
                            .fromTime(s.fromTime())
                            .toTime(s.toTime())
                            .price(s.price())
                            .build()
            ));
        }

        return savedPriceList;
    }

}
