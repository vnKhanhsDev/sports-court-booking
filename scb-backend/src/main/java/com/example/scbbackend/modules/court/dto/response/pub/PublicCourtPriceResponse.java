package com.example.scbbackend.modules.court.dto.response.pub;

import com.example.scbbackend.modules.court.dto.shared.PriceSlotDto;

import java.util.List;

public record PublicCourtPriceResponse(
        List<PriceSlotDto> slots
) {}
