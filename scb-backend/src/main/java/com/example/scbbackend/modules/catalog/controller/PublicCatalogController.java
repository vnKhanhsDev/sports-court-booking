package com.example.scbbackend.modules.catalog.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.catalog.dto.response.PublicSportResponse;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/catalog")
@RequiredArgsConstructor
public class PublicCatalogController {

    private final CatalogService catalogService;

    @GetMapping
    public ApiResponse<List<PublicSportResponse>> getAllCatalog() {
        return ApiResponse.success(
                ApiCode.GET_ALL_CATALOG_SUCCESS,
                catalogService.getAllPublicCatalog()
        );
    }

    @GetMapping("/sports")
    public ApiResponse<List<PublicSportResponse>> getOnlySportCatalog() {
        return ApiResponse.success(
                ApiCode.GET_SPORT_CATALOG_SUCCESS,
                catalogService.getOnlyPublicSportCatalog()
        );
    }

}
