package com.example.scbbackend.modules.court.controller.pub;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.court.dto.response.pub.PublicCourtPriceResponse;
import com.example.scbbackend.modules.court.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/public/courts")
@RequiredArgsConstructor
public class PublicCourtController {

    private final CourtService courtService;

    @GetMapping("/{id}/prices")
    public ApiResponse<PublicCourtPriceResponse> getCourtPrice(@PathVariable Long id){
        return ApiResponse.success(
                ApiCode.GET_PUBLIC_COURTS_SUCCESS,
                courtService.getPublicCourtPrice(id)
        );
    }

}
