package com.example.scbbackend.modules.payment.services;

import com.example.scbbackend.modules.payment.dto.request.InitPaymentRequest;
import com.example.scbbackend.modules.payment.dto.response.InitPaymentResponse;
import com.example.scbbackend.modules.payment.utils.VNPayUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class VNPayService implements PaymentService {

    private static final String VERSION = "2.1.0";
    private static final String COMMAND = "pay";
    private static final String ORDER_TYPE = "190000";
    private static final String CURRENCY_CODE = "VND";
    private static final String LOCALE = "vn";
    private static final Long DEFAULT_MULTIPLIER = 100L;

    @Value("${payment.vnpay.tmn-code}")
    private String tmnCode;

    @Value("${payment.vnpay.secret-key}")
    private String secretKey;

    @Value("${payment.vnpay.init-payment-url}")
    private String initPaymentUrl;

    @Value("${payment.vnpay.return-url}")
    private String returnUrl;

    @Value("${payment.vnpay.timeout}")
    private Integer paymentTimeout;

    @Override
    public InitPaymentResponse initPayment(InitPaymentRequest request) {
        try {
            // Validate secret key is configured
            if (secretKey == null || secretKey.isEmpty()) {
                throw new IllegalStateException("VNPay secret key is not configured");
            }
            // Generate transaction reference if not provided
            // If bookingId is provided, use it as txnRef prefix
            String txnRef = request.getTxnRef();
            if (txnRef == null || txnRef.isEmpty()) {
                if (request.getBookingId() != null) {
                    // Use bookingId-timestamp format for txnRef
                    txnRef = request.getBookingId().toString() + "-" + System.currentTimeMillis();
                } else {
                    txnRef = generateTxnRef();
                }
            }

            // Convert amount to VNPay format (multiply by 100)
            BigDecimal amount = request.getAmount();
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Payment amount must be greater than zero");
            }
            long vnpAmount = amount.multiply(BigDecimal.valueOf(DEFAULT_MULTIPLIER)).longValue();

            // Create payment parameters
            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", VERSION);
            vnpParams.put("vnp_Command", COMMAND);
            vnpParams.put("vnp_TmnCode", tmnCode);
            vnpParams.put("vnp_Amount", String.valueOf(vnpAmount));
            vnpParams.put("vnp_CurrCode", CURRENCY_CODE);
            vnpParams.put("vnp_TxnRef", txnRef);
            vnpParams.put("vnp_OrderInfo", request.getOrderInfo() != null ? request.getOrderInfo() : "Thanh toan don hang");
            vnpParams.put("vnp_OrderType", request.getOrderType() != null ? request.getOrderType() : ORDER_TYPE);
            vnpParams.put("vnp_Locale", LOCALE);
            vnpParams.put("vnp_ReturnUrl", returnUrl);
            vnpParams.put("vnp_IpAddr", request.getIpAddress() != null ? request.getIpAddress() : "127.0.0.1");
            
            // Create date - VNPay requires GMT+7 timezone (Vietnam time, UTC+7)
            // Using "Asia/Ho_Chi_Minh" which is UTC+7 (Vietnam timezone)
            // This is more reliable than "Etc/GMT+7" which has inverted sign notation
            TimeZone vnTimeZone = TimeZone.getTimeZone("Asia/Ho_Chi_Minh");
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(vnTimeZone);
            
            // Get current time in Vietnam timezone - get fresh instance each time
            Calendar createCalendar = Calendar.getInstance(vnTimeZone);
            Date currentTime = createCalendar.getTime();
            String createDate = formatter.format(currentTime);
            vnpParams.put("vnp_CreateDate", createDate);
            
            // Expire date (current time + timeout minutes) - create fresh calendar
            Calendar expireCalendar = Calendar.getInstance(vnTimeZone);
            expireCalendar.setTime(currentTime);
            expireCalendar.add(Calendar.MINUTE, paymentTimeout);
            Date expireTime = expireCalendar.getTime();
            String expireDate = formatter.format(expireTime);
            vnpParams.put("vnp_ExpireDate", expireDate);
            
            // Validate that expire date is in the future
            long timeDiff = expireTime.getTime() - currentTime.getTime();
            long minutesDiff = timeDiff / (1000 * 60);
            if (expireTime.before(currentTime) || expireTime.equals(currentTime)) {
                log.error("Invalid expire date: expireTime {} is not after currentTime {}. Difference: {} minutes", 
                        expireDate, createDate, minutesDiff);
                throw new IllegalArgumentException("Expire date must be in the future");
            }
            
            // Additional validation: ensure we have at least the configured timeout
            if (minutesDiff < paymentTimeout) {
                log.warn("Expire date difference ({}) is less than configured timeout ({}). This might cause issues.", 
                        minutesDiff, paymentTimeout);
            }
            
            log.info("VNPay payment dates - CreateDate: {} ({}), ExpireDate: {} ({}), Timeout: {} minutes, Actual diff: {} minutes, Timezone: {}", 
                    createDate, currentTime, expireDate, expireTime, paymentTimeout, minutesDiff, vnTimeZone.getID());

            // Build query string and generate secure hash
            // IMPORTANT: vnp_SecureHash should NOT be included in the query string for hash calculation
            String queryString = VNPayUtil.createQueryString(vnpParams);
            log.info("VNPay query string for hash: {}", queryString);
            log.info("VNPay secret key length: {}", secretKey != null ? secretKey.length() : 0);
            
            String vnpSecureHash = VNPayUtil.hmacSHA512(secretKey, queryString);
            if (vnpSecureHash == null) {
                throw new RuntimeException("Failed to generate secure hash");
            }
            log.info("VNPay secure hash generated: {}", vnpSecureHash);
            
            vnpParams.put("vnp_SecureHash", vnpSecureHash);

            // Build final payment URL
            String paymentUrl = buildPaymentUrl(vnpParams);

            log.info("VNPay payment URL generated for txnRef: {}", txnRef);

            return new InitPaymentResponse(paymentUrl, txnRef);
        } catch (Exception e) {
            log.error("Error initializing VNPay payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to initialize payment", e);
        }
    }

    /**
     * Verify payment callback from VNPay
     */
    public Map<String, String> verifyPayment(Map<String, String> vnpParams) {
        String vnpSecureHash = vnpParams.remove("vnp_SecureHash");
        String vnpSecureHashType = vnpParams.remove("vnp_SecureHashType");

        // Verify secure hash
        boolean isValid = VNPayUtil.verifySecureHash(vnpParams, secretKey, vnpSecureHash);
        
        Map<String, String> result = new HashMap<>();
        result.put("isValid", String.valueOf(isValid));
        result.put("responseCode", vnpParams.get("vnp_ResponseCode"));
        result.put("transactionStatus", vnpParams.get("vnp_TransactionStatus"));
        result.put("txnRef", vnpParams.get("vnp_TxnRef"));
        result.put("amount", vnpParams.get("vnp_Amount"));
        result.put("orderInfo", vnpParams.get("vnp_OrderInfo"));
        result.put("bankCode", vnpParams.get("vnp_BankCode"));
        result.put("payDate", vnpParams.get("vnp_PayDate"));
        result.put("transactionNo", vnpParams.get("vnp_TransactionNo"));
        
        return result;
    }

    /**
     * Generate unique transaction reference
     */
    private String generateTxnRef() {
        return String.valueOf(System.currentTimeMillis());
    }

    /**
     * Build payment URL with parameters
     */
    private String buildPaymentUrl(Map<String, String> params) {
        StringBuilder url = new StringBuilder(initPaymentUrl);
        boolean first = true;
        
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (first) {
                    url.append("?");
                    first = false;
                } else {
                    url.append("&");
                }
                url.append(entry.getKey())
                   .append("=")
                   .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
            }
        }
        
        return url.toString();
    }
}

