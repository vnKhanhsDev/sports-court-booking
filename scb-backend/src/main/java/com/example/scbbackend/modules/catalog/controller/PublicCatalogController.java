package com.example.scbbackend.modules.catalog.controller;

import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.catalog.dto.response.PublicSportResponse;
import com.example.scbbackend.modules.catalog.service.CatalogService;
import jakarta.servlet.http.HttpServletRequest;
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
    public ApiResponse<List<PublicSportResponse>> getAllCatalog(HttpServletRequest httpRequest) {
        return ApiResponse.success(catalogService.getAllPublicCatalog(), httpRequest);
    }

    @GetMapping("/sports")
    public ApiResponse<List<PublicSportResponse>> getOnlySportCatalog(HttpServletRequest httpRequest) {
        return ApiResponse.success(catalogService.getOnlyPublicSportCatalog(), httpRequest);
    }

}
