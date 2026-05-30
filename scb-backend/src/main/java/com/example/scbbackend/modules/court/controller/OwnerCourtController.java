package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.court.dto.request.CourtCreationRequest;
import com.example.scbbackend.modules.court.dto.request.CourtUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtDetailResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerCourtSummaryResponse;
import com.example.scbbackend.modules.court.service.CourtService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import jakarta.servlet.http.HttpServletRequest;
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
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(courtService.getAllCourts(account.getOwnerInfo()), httpRequest);
    }

    @PostMapping
    public ApiResponse<List<OwnerCourtSummaryResponse>> createCourt(
                        @CurrentAccount Account account,
                        @RequestBody CourtCreationRequest request,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(courtService.createCourt(account.getOwnerInfo(), request), httpRequest);
    }

    @GetMapping("/{id}")
    public ApiResponse<OwnerCourtDetailResponse> getCourtById(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(courtService.getCourtDetail(id, account.getOwnerInfo()), httpRequest);
    }

    @PutMapping("/{id}")
    public ApiResponse<List<OwnerCourtSummaryResponse>> updateCourt(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        @RequestBody CourtUpdationRequest request,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(
                                courtService.updateCourt(id, account.getOwnerInfo(), request),
                                httpRequest
                );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<OwnerCourtSummaryResponse>> deleteCourt(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(courtService.deleteCourt(id, account.getOwnerInfo()), httpRequest);
    }

}
