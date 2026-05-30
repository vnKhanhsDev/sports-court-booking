package com.example.scbbackend.modules.court.controller.owner;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.court.dto.request.PriceListUpsertRequest;
import com.example.scbbackend.modules.court.dto.response.PriceListDetailResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListOptionResponse;
import com.example.scbbackend.modules.court.dto.response.PriceListSummaryResponse;
import com.example.scbbackend.modules.court.service.PriceListService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import com.example.scbbackend.security.annotation.CurrentAccount;
import jakarta.servlet.http.HttpServletRequest;
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
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(priceListService.getAllPriceLists(account.getOwnerInfo()), httpRequest);
    }

    @GetMapping("/{id}")
    public ApiResponse<PriceListDetailResponse> getPriceListDetail(
            @PathVariable long id,
            @CurrentAccount Account account,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(
                priceListService.getPriceListDetail(id, getOwnerInfo(account, httpRequest)),
                httpRequest
        );
    }

    @GetMapping("/options")
    public ApiResponse<List<PriceListOptionResponse>> getPriceListOptions(
            @CurrentAccount Account account,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(
                priceListService.getAllPriceListOptions(getOwnerInfo(account, httpRequest)),
                httpRequest
        );
    }

    @PostMapping
    public ApiResponse<List<PriceListSummaryResponse>> createPriceList(
            @CurrentAccount Account account,
            @RequestBody PriceListUpsertRequest request,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(
                priceListService.createPriceList(getOwnerInfo(account, httpRequest), request),
                httpRequest
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<List<PriceListSummaryResponse>> updatePriceList(
            @PathVariable long id,
            @CurrentAccount Account account,
            @RequestBody PriceListUpsertRequest request,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(
                priceListService.updatePriceList(id, getOwnerInfo(account, httpRequest), request),
                httpRequest
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<PriceListSummaryResponse>> deletePriceList(
                        @PathVariable long id,
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                return ApiResponse.success(
                                priceListService.deletePriceList(id, getOwnerInfo(account, httpRequest)),
                                httpRequest
                );
    }

        private OwnerInfo getOwnerInfo(Account account, HttpServletRequest httpRequest) {
        if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
        }
        return account.getOwnerInfo();
    }

}
