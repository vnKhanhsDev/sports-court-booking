package com.example.scbbackend.modules.court.controller.pub;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.court.dto.response.pub.PublicFacilityResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/facilities")
@RequiredArgsConstructor
public class PublicFacilityController {

    private final FacilityService facilityService;

    @GetMapping
    public ApiResponse<List<PublicFacilityResponse>> getAllPublicFacilities() {
        return ApiResponse.success(
                ApiCode.GET_ALL_PUBLIC_FACILITIES_SUCCESS,
                facilityService.getAllPublicFacilities()
        );
    }

}
