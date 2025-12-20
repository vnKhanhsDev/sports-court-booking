package com.example.scbbackend.modules.court.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.court.dto.response.PublicCourtResponse;
import com.example.scbbackend.modules.court.dto.response.PublicCourtDetailResponse;
import com.example.scbbackend.modules.court.service.CourtService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/public/courts")
@RequiredArgsConstructor
public class PublicCourtController {

    private final CourtService courtService;

    @GetMapping
    public ApiResponse<List<PublicCourtResponse>> getPublicCourts() {
        return ApiResponse.success(
                ApiCode.GET_PUBLIC_COURTS_SUCCESS,
                courtService.getPublicCourts()
        );
    }

    @GetMapping("/{id}")
    public ApiResponse<PublicCourtDetailResponse> getPublicCourtDetail(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "#{T(java.time.LocalDate).now()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        // If date is not provided, use today's date
        if (date == null) {
            date = LocalDate.now();
        }
        
        return ApiResponse.success(
                ApiCode.GET_PUBLIC_COURT_DETAIL_SUCCESS,
                courtService.getPublicCourtDetail(id, date)
        );
    }

}
