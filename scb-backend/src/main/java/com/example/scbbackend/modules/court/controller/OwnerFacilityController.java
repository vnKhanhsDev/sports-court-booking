package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.court.dto.request.FacilityCreationRequest;
import com.example.scbbackend.modules.court.dto.request.FacilityUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.FacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/facilities")
@RequiredArgsConstructor
public class OwnerFacilityController {

    private final FacilityService facilityService;

    @GetMapping
    public ApiResponse<List<OwnerFacilitySummaryResponse>> getAllFacilities(
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(facilityService.getAllFacilities(account.getOwnerInfo()), httpRequest);
    }

    @PostMapping
    public ApiResponse<List<OwnerFacilitySummaryResponse>> createFacility(
                        @CurrentAccount Account account,
                        @RequestBody FacilityCreationRequest request,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(facilityService.createFacility(account.getOwnerInfo(), request), httpRequest);
    }

    @GetMapping("/{id}")
    public ApiResponse<FacilityDetailResponse> getFacilityById(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(facilityService.getFacilityDetail(id, account.getOwnerInfo()), httpRequest);
    }

    @PutMapping("/{id}")
    public ApiResponse<List<OwnerFacilitySummaryResponse>> updateFacility(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        @RequestBody FacilityUpdationRequest request,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(
                                facilityService.updateFacility(id, account.getOwnerInfo(), request),
                                httpRequest
                );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<OwnerFacilitySummaryResponse>> deleteFacility(
                        @PathVariable Long id,
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
    ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(facilityService.deleteFacility(id, account.getOwnerInfo()), httpRequest);
    }

    @GetMapping("/options")
        public ApiResponse<List<FacilityOptionResponse>> getFacilityOptions(
                        @CurrentAccount Account account,
                        HttpServletRequest httpRequest
        ) {
                if (account.getOwnerInfo() == null) {
                        throw new AppException(ErrorCode.INVALID_CREDENTIALS, httpRequest);
                }

                return ApiResponse.success(facilityService.getFacilityOptions(account.getOwnerInfo()), httpRequest);
    }

}
