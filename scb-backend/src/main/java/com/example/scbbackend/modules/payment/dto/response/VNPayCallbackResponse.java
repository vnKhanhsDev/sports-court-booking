package com.example.scbbackend.modules.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VNPayCallbackResponse {

    private boolean success;

    private String txnRef;

    private String responseCode;

    private String message;

    private String transactionNo;

    private String bankCode;

    private String payDate;

}

