package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.request.CreateCourtRequest;
import com.example.scbbackend.modules.court.dto.response.FacilityBasicForOwner;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateResponse;
import com.example.scbbackend.modules.court.service.CourtService;
import com.example.scbbackend.modules.court.service.FacilityService;
import com.example.scbbackend.modules.court.service.PriceTemplateService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/courts")
@RequiredArgsConstructor
public class CourtControllerForOwner {

    private final FacilityService facilityService;
    private final PriceTemplateService priceTemplateService;
    private final CourtService courtService;

    @GetMapping
    public ApiResponse<List<FacilityBasicForOwner>> getFacilitiesWithCourts(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }

        var facilitiesWithCourts = facilityService.getFacilitiesWithCourtsByOwner(account.getOwnerInfo());
        return ApiResponse.success(ApiCode.GET_FACILITIES_WITH_COURTS_SUCCESS, facilitiesWithCourts);
    }

    @GetMapping("/price-templates")
    public ApiResponse<List<PriceTemplateResponse>> getPriceTemplates(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }

        var priceTemplates = priceTemplateService.getPriceTemplates(account.getOwnerInfo());
        return ApiResponse.success(ApiCode.GET_PRICE_TEMPLATES_SUCCESS, priceTemplates);
    }

    @GetMapping("/price-templates/{id}")
    public ApiResponse<PriceTemplateDetailResponse> getPriceTemplateById(
            @PathVariable Long id,
            @CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }

        var priceTemplate = priceTemplateService.getPriceTemplateById(id, account.getOwnerInfo());
        if (priceTemplate == null) {
            throw new AppException(ApiCode.PRICE_TEMPLATE_NOT_FOUND);
        }

        return ApiResponse.success(ApiCode.GET_PRICE_TEMPLATE_SUCCESS, priceTemplate);
    }

    @PostMapping
    public ApiResponse<Long> createCourt(
            @Valid @RequestBody CreateCourtRequest request,
            @CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }

        var court = courtService.createCourt(request, account.getOwnerInfo());
        return ApiResponse.success(ApiCode.CREATE_COURT_SUCCESS, court.getId());
    }

}
