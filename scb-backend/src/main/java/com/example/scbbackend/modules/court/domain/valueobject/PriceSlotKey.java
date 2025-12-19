package com.example.scbbackend.modules.court.domain.valueobject;

import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;
import com.example.scbbackend.modules.court.entity.PriceSlot;
import lombok.NonNull;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceSlotKey(
        @NonNull LocalTime fromTime,
        @NonNull LocalTime toTime,
        @NonNull BigDecimal price
) {
    public static PriceSlotKey from(PriceSlot priceSlot) {
        return new PriceSlotKey(
                priceSlot.getFromTime(),
                priceSlot.getToTime(),
                normalizePrice(priceSlot.getPrice())
        );
    }

    public static PriceSlotKey from(PriceSlotDto priceSlotDto) {
        return new PriceSlotKey(
                priceSlotDto.fromTime(),
                priceSlotDto.toTime(),
                normalizePrice(priceSlotDto.price())
        );
    }

    private static BigDecimal normalizePrice(BigDecimal price) {
        return price.stripTrailingZeros();
    }
}
