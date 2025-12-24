package com.example.scbbackend.modules.payment.services;

import com.example.scbbackend.modules.payment.dto.request.InitPaymentRequest;
import com.example.scbbackend.modules.payment.dto.response.InitPaymentResponse;

public interface PaymentService {

    InitPaymentResponse initPayment(InitPaymentRequest request);

}

