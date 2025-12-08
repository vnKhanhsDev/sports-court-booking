package com.example.scbbackend.modules.auth.controller;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewAccountRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewRoleRequest;
import com.example.scbbackend.modules.auth.dto.request.VerifyOtpRequest;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<?> registerNewAccount(@Valid @RequestBody RegisterNewAccountRequest request) {
        authService.registerNewAccount(request);
        return ApiResponse.success(ApiCode.REGISTER_SUCCESS);
    }

    @PostMapping("/register/new-role")
    public ApiResponse<?> registerNewRole(@Valid @RequestBody RegisterNewRoleRequest request) {
        authService.registerNewRole(request);
        return ApiResponse.success(ApiCode.REGISTER_SUCCESS);
    }

    @PostMapping("/verify-otp")
    public ApiResponse<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Object user = authService.verifyOtp(request);
        return ApiResponse.success(ApiCode.VERIFY_OTP_SUCCESS, user);
    }

    @PostMapping("/resend-otp")
    public ApiResponse<?> resendOtp(@RequestParam String contact, @RequestParam String type) {
        authService.resendOtp(contact, type);
        return ApiResponse.success(ApiCode.RESEND_OTP_SUCCESS);
    }

    @GetMapping("/register/availability")
    public ApiResponse<?> checkRegisterAvailability(@RequestParam String contact, @RequestParam String role) {
        AuthFlowStepsResponse stepsResponse = authService.checkRegisterAvailability(contact, role);
        return ApiResponse.success(ApiCode.REGISTER_AVAILABILITY, stepsResponse);
    }

}
