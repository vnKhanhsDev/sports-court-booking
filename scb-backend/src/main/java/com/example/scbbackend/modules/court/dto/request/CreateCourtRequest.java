package com.example.scbbackend.modules.court.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder(toBuilder = true)
public record CreateCourtRequest(
        @NotNull(message = "Facility ID is required")
        Long facilityId,
        
        @NotNull(message = "Sport ID is required")
        Long sportId,
        
        @NotNull(message = "Court type ID is required")
        Long courtTypeId,
        
        @NotNull(message = "Surface type ID is required")
        Long surfaceTypeId,
        
        @NotBlank(message = "Court name is required")
        String name,
        
        Long priceTemplateId,
        
        List<CourtPriceItemRequest> priceItems,
        
        List<String> imageUrls
) {}
