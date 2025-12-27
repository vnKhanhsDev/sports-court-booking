package com.example.scbbackend.modules.address.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.address.entity.Province;
import com.example.scbbackend.modules.address.entity.Ward;
import com.example.scbbackend.modules.address.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/address")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/provinces")
    public ApiResponse<List<Province>> getAllProvinces() {
        return ApiResponse.success(
                ApiCode.GET_ALL_PROVINCES_SUCCESS,
                addressService.findAllProvinces()
        );
    }

    @GetMapping("/wards/{provinceCode}")
    public ApiResponse<List<Ward>> getAllWardsByProvinceCode(@PathVariable String provinceCode) {
        return ApiResponse.success(
                ApiCode.GET_WARDS_SUCCESS,
                addressService.findAllWardsByProvinceCode(provinceCode)
        );
    }

}
