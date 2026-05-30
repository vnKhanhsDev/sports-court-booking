package com.example.scbbackend.modules.payment.controller;

import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.common.response.ApiResponse;
import com.example.scbbackend.modules.payment.dto.request.InitPaymentRequest;
import com.example.scbbackend.modules.payment.services.PaymentService;
import com.example.scbbackend.modules.payment.utils.RequestUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/vnpay/init")
    public ApiResponse<?> initVNPayPayment(
            @Valid @RequestBody InitPaymentRequest request,
            jakarta.servlet.http.HttpServletRequest httpRequest
    ) {
        try {
            log.info("Initializing VNPay payment for bookingId: {}, amount: {}", 
                    request.getBookingId(), request.getAmount());
            
            // Get client IP address
            String ipAddress = RequestUtil.getIpAddress(httpRequest);
            request.setIpAddress(ipAddress);

            var response = paymentService.initPayment(request);
            log.info("VNPay payment initialized successfully, txnRef: {}", response.getTxnRef());
            return ApiResponse.success(response, httpRequest);
        } catch (IllegalArgumentException e) {
            log.error("Invalid payment request: {}", e.getMessage());
            return ApiResponse.error(ErrorCode.INVALID_CREDENTIALS, httpRequest);
        } catch (Exception e) {
            log.error("Error initializing VNPay payment: {}", e.getMessage(), e);
            return ApiResponse.error(ErrorCode.INVALID_CREDENTIALS, httpRequest);
        }
    }
}

