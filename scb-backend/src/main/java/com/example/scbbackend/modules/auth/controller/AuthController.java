package com.example.scbbackend.modules.auth.controller;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.auth.dto.request.LoginRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewAccountRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewRoleRequest;
import com.example.scbbackend.modules.auth.dto.request.VerifyOtpRequest;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.dto.response.LoginResponse;
import com.example.scbbackend.modules.auth.service.AuthService;
import com.example.scbbackend.modules.auth.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtils cookieUtils;

    @PostMapping("/login")
    public ApiResponse<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpServletResponse
    ) {
        var authResponse = authService.login(request);

        cookieUtils.setRefreshTokenCookie(httpServletResponse, authResponse.refreshToken());

        LoginResponse loginResponse = LoginResponse.builder()
                .accessToken(authResponse.accessToken())
                .user(authResponse.user())
                .build();

        return ApiResponse.success(loginResponse, httpRequest);
    }

    @PostMapping("/register")
    public ApiResponse<?> registerNewAccount(
            @Valid @RequestBody RegisterNewAccountRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.registerNewAccount(request);
        return ApiResponse.success(null, httpRequest);
    }

    @PostMapping("/register/new-role")
    public ApiResponse<?> registerNewRole(
            @Valid @RequestBody RegisterNewRoleRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.registerNewRole(request);
        return ApiResponse.success(null, httpRequest);
    }

    @PostMapping("/verify-otp")
    public ApiResponse<?> verifyOtp(
            @RequestBody VerifyOtpRequest request,
            HttpServletRequest httpRequest
    ) {
        Object user = authService.verifyOtp(request);
        return ApiResponse.success(user, httpRequest);
    }

    @PostMapping("/resend-otp")
    public ApiResponse<?> resendOtp(
            @RequestParam String contact,
            @RequestParam String type,
            HttpServletRequest httpRequest
    ) {
        authService.resendOtp(contact, type);
        return ApiResponse.success(null, httpRequest);
    }

    @GetMapping("/register/availability")
    public ApiResponse<?> checkRegisterAvailability(
            @RequestParam String contact,
            @RequestParam String role,
            HttpServletRequest httpRequest
    ) {
        AuthFlowStepsResponse stepsResponse = authService.checkRegisterAvailability(contact, role);
        return ApiResponse.success(stepsResponse, httpRequest);
    }

    @PostMapping("/refresh-token")
    public ApiResponse<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("refreshToken")) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
        if (refreshToken == null) throw new AppException(ErrorCode.INVALID_CREDENTIALS, request);

        var authResponse = authService.refreshToken(refreshToken);
        cookieUtils.setRefreshTokenCookie(response, authResponse.refreshToken());

        Map<String, String> token = new HashMap<>();
        token.put("accessToken", authResponse.accessToken());
        return ApiResponse.success(token, request);
    }

}
