package com.example.scbbackend.modules.court.controller.owner;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.request.PriceListUpsertRequest;
import com.example.scbbackend.modules.court.dto.response.PriceListDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListOptionResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListSummaryResponse;
import com.example.scbbackend.modules.court.service.PriceListService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.security.annotation.CurrentAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/price-lists")
@RequiredArgsConstructor
public class PriceListController {

    private final PriceListService priceListService;

    @GetMapping
    public ApiResponse<List<PriceListSummaryResponse>> getAllPriceLists(
            @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_ALL_PRICE_LISTS_SUCCESS,
                priceListService.getAllPriceLists(account.getOwnerInfo())
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<PriceListDetailResponse> getPriceListDetail(
            @PathVariable long id, @CurrentAccount Account account
    ) {
        return ApiResponse.success(
                ApiCode.GET_PRICE_LIST_SUCCESS,
                priceListService.getPriceListDetail(id, getOwnerInfo(account))
        );
    }

    @GetMapping("/options")
    public ApiResponse<List<PriceListOptionResponse>> getPriceListOptions(
            @CurrentAccount Account account
    ) {
        return ApiResponse.success(
                ApiCode.GET_PRICE_LIST_OPTIONS_SUCCESS,
                priceListService.getAllPriceListOptions(getOwnerInfo(account))
        );
    }

    @PostMapping
    public ApiResponse<List<PriceListSummaryResponse>> createPriceList(
            @CurrentAccount Account account, @RequestBody PriceListUpsertRequest request
    ) {
        return ApiResponse.success(
                ApiCode.CREATE_PRICE_LIST_SUCCESS,
                priceListService.createPriceList(getOwnerInfo(account), request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<List<PriceListSummaryResponse>> updatePriceList(
            @PathVariable long id, @CurrentAccount Account account, @RequestBody PriceListUpsertRequest request
    ) {
        return ApiResponse.success(
                ApiCode.UPDATE_PRICE_LIST_SUCCESS,
                priceListService.updatePriceList(id, getOwnerInfo(account), request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<PriceListSummaryResponse>> deletePriceList(
            @PathVariable long id, @CurrentAccount Account account
    ) {
        return ApiResponse.success(
                ApiCode.DELETE_PRICE_LIST_SUCCESS,
                priceListService.deletePriceList(id, getOwnerInfo(account))
        );
    }

    private OwnerInfo getOwnerInfo(Account account) {
        if (account.getOwnerInfo() == null) {
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }
        return account.getOwnerInfo();
    }

}
