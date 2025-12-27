package com.example.scbbackend.modules.payment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InitPaymentResponse {

    private String vnpUrl;

    private String txnRef;

}

