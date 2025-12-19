package com.example.scbbackend.modules.court.controller.admin;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/facilities")
@RequiredArgsConstructor
public class AdminFacilityController {

    private final FacilityService facilityService;

    @GetMapping
    public ApiResponse<List<AdminFacilitySummaryResponse>> getAllAdminFacilities() {
        return ApiResponse.success(
                ApiCode.GET_ALL_ADMIN_FACILITIES_SUCCESS,
                facilityService.getAllAdminFacilities()
        );
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<List<AdminFacilitySummaryResponse>> approveFacility(@PathVariable Long id) {
        return ApiResponse.success(
                ApiCode.APPROVE_FACILITY_SUCCESS,
                facilityService.approveFacility(id)
        );
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<List<AdminFacilitySummaryResponse>> rejectFacility(@PathVariable Long id) {
        return ApiResponse.success(
                ApiCode.REJECT_FACILITY_SUCCESS,
                facilityService.rejectFacility(id)
        );
    }

    @PutMapping("/approve-all")
    public ApiResponse<List<AdminFacilitySummaryResponse>> approveAllFacilities() {
        return ApiResponse.success(
                ApiCode.APPROVE_ALL_FACILITIES_SUCCESS,
                facilityService.approveAllFacilities()
        );
    }

}
