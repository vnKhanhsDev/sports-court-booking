package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.court.dto.response.FacilityOptionResponse;
import com.example.scbbackend.modules.court.service.FacilityService;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.security.annotation.CurrentAccount;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @GetMapping("/options")
    public ApiResponse<List<FacilityOptionResponse>> getFacilityOptions(@CurrentAccount Account account) {
        if (account.getOwnerInfo() == null) throw new AppException(ApiCode.UNAUTHENTICATED);

        return ApiResponse.success(
                ApiCode.GET_FACILITIES_SUCCESS,
                facilityService.getFacilityOptions(account.getOwnerInfo())
        );
    }

}
