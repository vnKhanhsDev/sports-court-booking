package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.modules.court.domain.valueobject.PriceItemKey;
import com.example.scbbackend.modules.court.dto.shared.PriceItemDto;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.CourtPrice;
import com.example.scbbackend.modules.court.entity.CourtPriceItem;
import com.example.scbbackend.modules.court.repository.CourtPriceItemRepository;
import com.example.scbbackend.modules.court.repository.CourtPriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceService {

    private final CourtPriceRepository courtPriceRepository;
    private final CourtPriceItemRepository courtPriceItemRepository;

    public void saveCourtPrices(Court court, List<PriceItemDto> newItems) {
        if (newItems == null || newItems.isEmpty()) {
            return;
        }

        // Check if a CourtPrice already exists for this court in the database
        // This handles the case where the entity was deleted but not yet flushed
        List<CourtPrice> existingPrices = courtPriceRepository.findAllByCourt(court);
        CourtPrice courtPrice;
        
        if (!existingPrices.isEmpty()) {
            // Use existing CourtPrice (should only be one due to unique constraint)
            courtPrice = existingPrices.get(0);
            
            // Delete existing items
            if (courtPrice.getItems() != null && !courtPrice.getItems().isEmpty()) {
                courtPriceItemRepository.deleteAll(courtPrice.getItems());
            }
        } else {
            // Create new CourtPrice if none exists
            courtPrice = courtPriceRepository.save(
                    CourtPrice.builder()
                            .court(court)
                            .build()
            );
        }

        // Save new price items
        List<CourtPriceItem> newPriceItems = newItems.stream()
                .map(i -> CourtPriceItem.builder()
                        .courtPrice(courtPrice)
                        .startTime(i.startTime())
                        .endTime(i.endTime())
                        .price(i.price())
                        .build()
                )
                .toList();
        courtPriceItemRepository.saveAll(newPriceItems);
        
        // Update the court entity to reference the court price
        court.setCourtPrice(courtPrice);
    }

    public boolean hasPriceItemChanged(
            List<CourtPriceItem> existingItems, List<PriceItemDto> newItems
    ) {
        if (existingItems.size() != newItems.size()) return true;

        return !existingItems.stream()
                .map(PriceItemKey::from)
                .collect(Collectors.toSet())
                .equals(
                        newItems.stream()
                                .map(PriceItemKey::from)
                                .collect(Collectors.toSet())
                );
    }

}
