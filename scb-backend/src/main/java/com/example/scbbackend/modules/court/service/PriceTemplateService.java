package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.modules.court.dto.response.PriceTemplateDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateItemResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateResponse;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
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

    @Transactional(readOnly = true)
    public List<PriceTemplateResponse> getPriceTemplates(OwnerInfo ownerInfo) {
        List<PriceTemplate> priceTemplates = priceTemplateRepository.findByOwnerInfo(ownerInfo);

        return priceTemplates.stream()
                .map(template -> PriceTemplateResponse.builder()
                        .id(template.getId())
                        .facilityName(template.getFacility() != null ? template.getFacility().getName() : null)
                        .sportName(template.getSport() != null ? template.getSport().getName() : null)
                        .name(template.getName())
                        .version(template.getVersion())
                        .isActive(template.isActive())
                        .build()
                ).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PriceTemplateDetailResponse getPriceTemplateById(Long id, OwnerInfo ownerInfo) {
        PriceTemplate template = priceTemplateRepository.findByIdAndOwnerInfo(id, ownerInfo);
        if (template == null) {
            return null;
        }

        List<PriceTemplateItemResponse> items = template.getPriceTemplateItems() != null
                ? template.getPriceTemplateItems().stream()
                        .map(item -> PriceTemplateItemResponse.builder()
                                .id(item.getId())
                                .startTime(item.getStartTime().toString())
                                .endTime(item.getEndTime().toString())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        return PriceTemplateDetailResponse.builder()
                .id(template.getId())
                .facilityName(template.getFacility() != null ? template.getFacility().getName() : null)
                .sportName(template.getSport() != null ? template.getSport().getName() : null)
                .name(template.getName())
                .version(template.getVersion())
                .isActive(template.isActive())
                .items(items)
                .build();
    }

}
