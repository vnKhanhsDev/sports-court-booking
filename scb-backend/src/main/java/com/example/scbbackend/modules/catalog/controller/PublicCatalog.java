package com.example.scbbackend.modules.catalog.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.catalog.dto.response.SportPublicResponse;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/catalog")
@RequiredArgsConstructor
public class PublicCatalog {

    private final CatalogService catalogService;

    @GetMapping
    public ApiResponse<List<SportPublicResponse>> getCatalog() {
        var catalog = catalogService.getCatalog();
        return ApiResponse.success(ApiCode.GET_CATALOG_SUCCESS, catalog);
    }

}
