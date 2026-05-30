package com.example.scbbackend.modules.court.controller.admin;

import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.court.dto.response.AdminFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/facilities")
@RequiredArgsConstructor
public class AdminFacilityController {

    private final FacilityService facilityService;

    @GetMapping
    public ApiResponse<List<AdminFacilitySummaryResponse>> getAllAdminFacilities(
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(facilityService.getAllAdminFacilities(), httpRequest);
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<List<AdminFacilitySummaryResponse>> approveFacility(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(facilityService.approveFacility(id), httpRequest);
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<List<AdminFacilitySummaryResponse>> rejectFacility(
            @PathVariable Long id,
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(facilityService.rejectFacility(id), httpRequest);
    }

    @PutMapping("/approve-all")
    public ApiResponse<List<AdminFacilitySummaryResponse>> approveAllFacilities(
            HttpServletRequest httpRequest
    ) {
        return ApiResponse.success(facilityService.approveAllFacilities(), httpRequest);
    }

}
