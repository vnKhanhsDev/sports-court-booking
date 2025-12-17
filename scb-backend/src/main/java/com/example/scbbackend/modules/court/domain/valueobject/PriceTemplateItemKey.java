package com.example.scbbackend.modules.court.domain.valueobject;

import com.example.scbbackend.modules.court.dto.shared.PriceTemplateItemDto;
import com.example.scbbackend.modules.court.entity.PriceTemplateItem;

import java.math.BigDecimal;
import java.time.LocalTime;

public record PriceTemplateItemKey(
        LocalTime startTime,
        LocalTime endTime,
        BigDecimal price
) {
    public static PriceTemplateItemKey from(PriceTemplateItem item) {
        return new PriceTemplateItemKey(
                item.getStartTime(),
                item.getEndTime(),
                normalize(item.getPrice())
        );
    }

    public static PriceTemplateItemKey from(PriceTemplateItemDto itemDto) {
        return new PriceTemplateItemKey(
                itemDto.startTime(),
                itemDto.endTime(),
                normalize(itemDto.price())
        );
    }

    private static BigDecimal normalize(BigDecimal price) {
        return price.stripTrailingZeros();
    }
}
