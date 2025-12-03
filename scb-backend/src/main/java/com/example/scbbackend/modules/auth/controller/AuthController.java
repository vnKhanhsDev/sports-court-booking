package com.example.scbbackend.modules.auth.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/register/availability")
    public ApiResponse<?> checkRegisterAvailability(@RequestParam String contact, @RequestParam String role) {
        AuthFlowStepsResponse stepsResponse = authService.checkRegisterAvailability(contact, role);
        return ApiResponse.success(ApiCode.REGISTER_AVAILABILITY, stepsResponse);
    }

}
