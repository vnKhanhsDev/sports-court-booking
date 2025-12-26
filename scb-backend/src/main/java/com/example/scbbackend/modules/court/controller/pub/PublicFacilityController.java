package com.example.scbbackend.modules.court.controller.pub;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityDetailResponse;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilitySummaryResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
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
    public ApiResponse<List<PublicFacilitySummaryResponse>> getAllPublicFacilities() {
        return ApiResponse.success(
                ApiCode.GET_ALL_PUBLIC_FACILITIES_SUCCESS,
                facilityService.getAllPublicFacilities()
        );
    }

    @GetMapping("/featured")
    public ApiResponse<List<PublicFacilitySummaryResponse>> getFeaturedFacilities(
            @RequestParam Long sportId
    ) {
        return ApiResponse.success(
                ApiCode.GET_ALL_PUBLIC_FACILITIES_SUCCESS,
                facilityService.getFeaturedFacilitiesBySportId(sportId)
        );
    }

    @GetMapping("/nearby")
    public ApiResponse<List<PublicFacilitySummaryResponse>> getAllNearbyFacilities(
            @RequestParam Double geoLatitude, @RequestParam Double geoLongitude
    ) {
        return ApiResponse.success(
                ApiCode.GET_ALL_NEARBY_FACILITIES_SUCCESS,
                facilityService.getAllNearbyFacilities(geoLatitude, geoLongitude)
        );
    }

    @GetMapping("/{facilityId}")
    public ApiResponse<PublicFacilityDetailResponse> getPublicFacilityDetail(
            @PathVariable Long facilityId,
            @RequestParam Long sportId
    ) {
        return ApiResponse.success(
                ApiCode.GET_PUBLIC_FACILITY_DETAIL_SUCCESS,
                facilityService.getPublicFacilityDetail(facilityId, sportId)
        );
    }

}
