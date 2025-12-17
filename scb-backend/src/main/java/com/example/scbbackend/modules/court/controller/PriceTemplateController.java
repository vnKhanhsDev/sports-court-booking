package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.request.PriceTemplateUpsertRequest;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateOptionResponse;
import com.example.scbbackend.modules.court.dto.response.PriceTemplateSummaryResponse;
import com.example.scbbackend.modules.court.dto.shared.PriceTemplateItemDto;
import com.example.scbbackend.modules.court.service.PriceTemplateService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/price-templates")
@RequiredArgsConstructor
public class PriceTemplateController {

    private final PriceTemplateService priceTemplateService;

    @GetMapping
    public ApiResponse<List<PriceTemplateSummaryResponse>> getAllPriceTemplates(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_ALL_PRICE_TEMPLATES_SUCCESS,
                priceTemplateService.getAllPriceTemplates(account.getOwnerInfo())
        );
    }

    @PostMapping
    public ApiResponse<List<PriceTemplateSummaryResponse>> createPriceTemplate(
            @CurrentAccount Account account, @RequestBody PriceTemplateUpsertRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.CREATE_PRICE_TEMPLATE_SUCCESS,
                priceTemplateService.createPriceTemplate(account.getOwnerInfo(), request)
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<PriceTemplateDetailResponse> getPriceTemplateById(
            @PathVariable long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_PRICE_TEMPLATE_SUCCESS,
                priceTemplateService.getPriceTemplateById(id, account.getOwnerInfo())
        );
    }

    @GetMapping("/{id}/items")
    public ApiResponse<List<PriceTemplateItemDto>> getAllPriceTemplateItemsByPriceTemplateId(
            @PathVariable long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_PRICE_TEMPLATE_ITEMS_SUCCESS,
                priceTemplateService.getAllPriceTemplateItemsByPriceTemplateId(id, account.getOwnerInfo())
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<List<PriceTemplateSummaryResponse>> updatePriceTemplate(
            @PathVariable long id, @CurrentAccount Account account, @RequestBody PriceTemplateUpsertRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.UPDATE_PRICE_TEMPLATE_SUCCESS,
                priceTemplateService.updatePriceTemplate(id, account.getOwnerInfo(), request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<PriceTemplateSummaryResponse>> deletePriceTemplate(
            @PathVariable long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.DELETE_PRICE_TEMPLATE_SUCCESS,
                priceTemplateService.deletePriceTemplate(id, account.getOwnerInfo())
        );
    }

    @GetMapping("/options")
    public ApiResponse<List<PriceTemplateOptionResponse>> getAllPriceTemplateOptions(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_ALL_PRICE_TEMPLATE_OPTIONS_SUCCESS,
                priceTemplateService.getAllPriceTemplateOptions(account.getOwnerInfo())
        );
    }

}
