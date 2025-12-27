package com.example.scbbackend.modules.payment.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class InitPaymentRequest {

    private String requestId;

    private String ipAddress;

    private Long userId;

    private UUID bookingId;

    private String txnRef;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    private String orderInfo;

    private String orderType;

}

