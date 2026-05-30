package com.example.scbbackend.modules.court.controller.pub;

import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/facilities")
@RequiredArgsConstructor
public class PublicFacilityController {

    private final FacilityService facilityService;

    @GetMapping
        public ApiResponse<List<PublicFacilitySummaryResponse>> getAllPublicFacilities(
                        HttpServletRequest httpRequest
        ) {
                return ApiResponse.success(facilityService.getAllPublicFacilities(), httpRequest);
    }

    @GetMapping("/featured")
    public ApiResponse<List<PublicFacilitySummaryResponse>> getFeaturedFacilities(
                        @RequestParam Long sportId,
                        HttpServletRequest httpRequest
    ) {
                return ApiResponse.success(facilityService.getFeaturedFacilitiesBySportId(sportId), httpRequest);
    }

    @GetMapping("/nearby")
    public ApiResponse<List<PublicFacilitySummaryResponse>> getAllNearbyFacilities(
                        @RequestParam Double latitude,
                        @RequestParam Double longitude,
                        HttpServletRequest httpRequest
    ) {
                return ApiResponse.success(facilityService.getAllNearbyFacilities(latitude, longitude), httpRequest);
    }

    @GetMapping("/{facilityId}")
    public ApiResponse<PublicFacilityDetailResponse> getPublicFacilityDetail(
            @PathVariable Long facilityId,
                        @RequestParam Long sportId,
                        HttpServletRequest httpRequest
    ) {
                return ApiResponse.success(facilityService.getPublicFacilityDetail(facilityId, sportId), httpRequest);
    }

}
