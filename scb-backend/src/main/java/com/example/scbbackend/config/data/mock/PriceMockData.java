package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.entity.PriceSlot;
import com.example.scbbackend.modules.court.repository.PriceListRepository;
import com.example.scbbackend.modules.court.repository.PriceSlotRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PriceMockData {

    private final PriceListRepository priceListRepository;
    private final PriceSlotRepository priceSlotRepository;

    private record PriceListData(
            String name,
            List<PriceSlotData> priceSlotList
    ) {}

    private record PriceSlotData(
            String fromTime,
            String toTime,
            BigDecimal price
    ) {}

    private static final List<PriceListData> PRICE_LISTS = List.of(
            new PriceListData(
                    "Bảng giá chung",
                    List.of(
                            new PriceSlotData("06:00", "13:00", BigDecimal.valueOf(150_000)),
                            new PriceSlotData("13:00", "18:00", BigDecimal.valueOf(250_000)),
                            new PriceSlotData("18:00", "23:00", BigDecimal.valueOf(350_000))
                    )
            ),
            new PriceListData(
                    "Bảng giá Pickfit",
                    List.of(
                            new PriceSlotData("06:00", "13:00", BigDecimal.valueOf(180_000)),
                            new PriceSlotData("13:00", "18:00", BigDecimal.valueOf(230_000)),
                            new PriceSlotData("18:00", "23:00", BigDecimal.valueOf(300_000))
                    )
            ),
            new PriceListData(
                    "Bảng giá Phenikaa_sân bóng_7_nhân tạo",
                    List.of(
                            new PriceSlotData("06:00", "13:00", BigDecimal.valueOf(200_000)),
                            new PriceSlotData("13:00", "18:00", BigDecimal.valueOf(250_000)),
                            new PriceSlotData("18:00", "23:00", BigDecimal.valueOf(350_000))
                    )
            ),
            new PriceListData(
                    "Bảng giá sân bóng_7_nhân tạo",
                    List.of(
                            new PriceSlotData("06:00", "13:00", BigDecimal.valueOf(180_000)),
                            new PriceSlotData("13:00", "18:00", BigDecimal.valueOf(250_000)),
                            new PriceSlotData("18:00", "23:00", BigDecimal.valueOf(300_000))
                    )
            ),
            new PriceListData(
                    "Bảng giá pickleball",
                    List.of(
                            new PriceSlotData("06:00", "13:00", BigDecimal.valueOf(200_000)),
                            new PriceSlotData("13:00", "18:00", BigDecimal.valueOf(280_000)),
                            new PriceSlotData("18:00", "23:00", BigDecimal.valueOf(400_000))
                    )
            )
    );

    public void mock(OwnerInfo ownerInfo) {
        if (priceListRepository.count() > 0) {
            log.info("Price list already exists. Skipping...");
            return;
        }

        PRICE_LISTS.forEach(l -> {
            PriceList priceList = priceListRepository.save(
                    PriceList.builder()
                            .ownerInfo(ownerInfo)
                            .name(l.name)
                            .version(1)
                            .isActive(true)
                            .build()
            );

            List<PriceSlot> priceSlots = l.priceSlotList.stream()
                    .map(s -> PriceSlot.builder()
                            .priceList(priceList)
                            .fromTime(LocalTime.parse(s.fromTime))
                            .toTime(LocalTime.parse(s.toTime))
                            .price(s.price)
                            .build()
                    )
                    .toList();
            priceSlotRepository.saveAll(priceSlots);
        });
    }
}
