package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.request.FacilityCreationRequest;
import com.example.scbbackend.modules.court.dto.request.FacilityUpdationRequest;
import com.example.scbbackend.modules.court.dto.response.FacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.dto.response.OwnerFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
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
            @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_FACILITIES_SUCCESS,
                facilityService.getAllFacilities(account.getOwnerInfo())
        );
    }

    @PostMapping
    public ApiResponse<List<OwnerFacilitySummaryResponse>> createFacility(
            @CurrentAccount Account account, @RequestBody FacilityCreationRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.CREATE_FACILITY_SUCCESS,
                facilityService.createFacility(account.getOwnerInfo(), request)
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<FacilityDetailResponse> getFacilityById(
            @PathVariable Long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_FACILITY_SUCCESS,
                facilityService.getFacilityDetail(id, account.getOwnerInfo())
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<List<OwnerFacilitySummaryResponse>> updateFacility(
            @PathVariable Long id, @CurrentAccount Account account, @RequestBody FacilityUpdationRequest request
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.UPDATE_FACILITY_SUCCESS,
                facilityService.updateFacility(id, account.getOwnerInfo(), request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<List<OwnerFacilitySummaryResponse>> deleteFacility(
            @PathVariable Long id, @CurrentAccount Account account
    ) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.DELETE_FACILITY_SUCCESS,
                facilityService.deleteFacility(id, account.getOwnerInfo())
        );
    }

    @GetMapping("/options")
    public ApiResponse<List<FacilityOptionResponse>> getFacilityOptions(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_FACILITIES_SUCCESS,
                facilityService.getFacilityOptions(account.getOwnerInfo())
        );
    }

}
