package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.request.CourtCreationRequest;
import com.example.scbbackend.modules.court.dto.request.CourtUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtDetailResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.service.CourtService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/courts")
@RequiredArgsConstructor
public class OwnerCourtController {

    private final CourtService courtService;

    @GetMapping
    public ApiResponse<List<OwnerCourtSummaryResponse>> getAllCourts(
            @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_ALL_COURTS_SUCCESS,
                courtService.getAllCourts(account.getOwnerInfo())
        );
    }

    @PostMapping
    public ApiResponse<List<OwnerCourtSummaryResponse>> createCourt(
            @CurrentAccount Account account, @RequestBody CourtCreationRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.CREATE_COURT_SUCCESS,
                courtService.createCourt(account.getOwnerInfo(), request)
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<OwnerCourtDetailResponse> getCourtById(
            @PathVariable Long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_COURT_SUCCESS,
                courtService.getCourtDetail(id, account.getOwnerInfo())
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<List<OwnerCourtSummaryResponse>> updateCourt(
            @PathVariable Long id, @CurrentAccount Account account, @RequestBody CourtUpdationRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.UPDATE_COURT_SUCCESS,
                courtService.updateCourt(id, account.getOwnerInfo(), request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<OwnerCourtSummaryResponse>> deleteCourt(
            @PathVariable Long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.DELETE_COURT_SUCCESS,
                courtService.deleteCourt(id, account.getOwnerInfo())
        );
    }

}
