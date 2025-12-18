package com.example.scbbackend.modules.court.domain.valueobject;

import com.example.scbbackend.modules.court.dto.shared.PriceItemDto;
import com.example.scbbackend.modules.court.entity.CourtPriceItem;
import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceItemKey(
        @NonNull LocalTime startTime,
        @NonNull LocalTime endTime,
        @NonNull BigDecimal price
) {
    public static PriceItemKey from(CourtPriceItem item) {
        return new PriceItemKey(
                item.getStartTime(),
                item.getEndTime(),
                normalizePrice(item.getPrice())
        );
    }

    public static PriceItemKey from(PriceItemDto itemDto) {
        return new PriceItemKey(
                itemDto.startTime(),
                itemDto.endTime(),
                normalizePrice(itemDto.price())
        );
    }

    private static BigDecimal normalizePrice(BigDecimal price) {
        return price.stripTrailingZeros();
    }
}
