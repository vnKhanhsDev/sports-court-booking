package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.entity.PriceSlot;
import com.example.scbbackend.modules.court.repository.PriceListRepository;
import com.example.scbbackend.modules.court.repository.PriceSlotRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceMockData {

    private final PriceListRepository priceListRepository;
    private final PriceSlotRepository priceSlotRepository;

    private final CatalogService catalogService;

    private record PriceListData(
            int facilityIndex,
            String sportCode,
            String courtTypeCode,
            String surfaceTypeCode,
            String name,
            List<PriceSlotData> slots
    ) {}

    private record PriceSlotData(
            LocalTime fromTime,
            LocalTime toTime,
            BigDecimal price
    ) {}

    private static final List<PriceListData> PRICE_LIST_DATA = List.of(
            new PriceListData(
                    -1,
                    "",
                    "",
                    "",
                    "Bảng giá chung",
                    List.of(
                            new PriceSlotData(LocalTime.parse("06:00"), LocalTime.parse("13:00"), BigDecimal.valueOf(120_000)),
                            new PriceSlotData(LocalTime.parse("13:00"), LocalTime.parse("18:00"), BigDecimal.valueOf(180_000)),
                            new PriceSlotData(LocalTime.parse("18:00"), LocalTime.parse("23:00"), BigDecimal.valueOf(250_000))
                    )
            ),
            new PriceListData(
                    -1,
                    "football",
                    "7_a_side",
                    "artificial_grass",
                    "Bảng giá bóng đá_sân 7_nhân tạo",
                    List.of(
                            new PriceSlotData(LocalTime.parse("06:00"), LocalTime.parse("13:00"), BigDecimal.valueOf(150_000)),
                            new PriceSlotData(LocalTime.parse("13:00"), LocalTime.parse("18:00"), BigDecimal.valueOf(200_000)),
                            new PriceSlotData(LocalTime.parse("18:00"), LocalTime.parse("23:00"), BigDecimal.valueOf(300_000))
                    )
            )
    );

    @Transactional
    public List<PriceList> mock(OwnerInfo ownerInfo) {
        if (priceListRepository.existsByOwnerInfo(ownerInfo)) {
            log.info("Price list already exists. Skipping...");
            return List.of();
        }

        List<PriceList> priceLists = new ArrayList<>();
        List<PriceSlot> priceSlots = new ArrayList<>();

        for (PriceListData pld : PRICE_LIST_DATA) {
            PriceList priceList = PriceList.builder()
                    .ownerInfo(ownerInfo)
                    .facility(null)
                    .sport(pld.sportCode().isEmpty() ? null : catalogService.getSportByCode(pld.sportCode()))
                    .courtType(pld.courtTypeCode().isEmpty() || pld.sportCode().isEmpty() 
                            ? null 
                            : catalogService.getCourtTypeBySportCodeAndCode(pld.sportCode(), pld.courtTypeCode()))
                    .surfaceType(pld.surfaceTypeCode().isEmpty() || pld.sportCode().isEmpty() 
                            ? null 
                            : catalogService.getSurfaceTypeBySportCodeAndCode(pld.sportCode(), pld.surfaceTypeCode()))
                    .name(pld.name().isEmpty() ? null : pld.name())
                    .version(1)
                    .isActive(true)
                    .build();
            priceLists.add(priceList);
        }
        priceListRepository.saveAll(priceLists);

        for (int i = 0; i < PRICE_LIST_DATA.size(); i++) {
            PriceList savedPriceList = priceLists.get(i);
            PriceListData pld = PRICE_LIST_DATA.get(i);

            for (PriceSlotData psd : pld.slots()) {
                priceSlots.add(
                        PriceSlot.builder()
                                .priceList(savedPriceList)
                                .fromTime(psd.fromTime())
                                .toTime(psd.toTime())
                                .price(psd.price())
                                .build()
                );
            }
        }
        priceSlotRepository.saveAll(priceSlots);

        log.info("Mocked {} price lists and {} price slots", priceLists.size(), priceSlots.size());

        return priceLists;
    }

}
