package com.example.scbbackend.modules.payment.utils;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
public class VNPayUtil {

    private static final String HMAC_SHA512 = "HmacSHA512";

    /**
     * Generate HMAC SHA512 hash
     */
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance(HMAC_SHA512);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), HMAC_SHA512);
            hmac512.init(secretKey);
            byte[] hash = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (Exception e) {
            log.error("Error generating HMAC SHA512: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * Convert bytes to hexadecimal string (lowercase)
     * VNPay accepts both uppercase and lowercase, but we'll use lowercase for consistency
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    /**
     * Create query string from parameters for hash calculation
     * Excludes vnp_SecureHash and vnp_SecureHashType as per VNPay documentation
     * IMPORTANT: Both keys and values must be URL-encoded for hash calculation
     * This matches VNPay's PHP example: urlencode($key) . "=" . urlencode($value)
     */
    public static String createQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder queryString = new StringBuilder();
        int i = 0;
        for (String fieldName : fieldNames) {
            // Exclude vnp_SecureHash and vnp_SecureHashType from hash calculation
            if ("vnp_SecureHash".equals(fieldName) || "vnp_SecureHashType".equals(fieldName)) {
                continue;
            }
            
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    // URL encode both key and value as per VNPay documentation
                    String encodedKey = URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString());
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString());
                    
                    if (i == 0) {
                        queryString.append(encodedKey).append("=").append(encodedValue);
                        i = 1;
                    } else {
                        queryString.append("&").append(encodedKey).append("=").append(encodedValue);
                    }
                } catch (Exception e) {
                    log.error("Error URL encoding parameter {}: {}", fieldName, e.getMessage());
                    // Fallback to non-encoded if encoding fails
                    if (i == 0) {
                        queryString.append(fieldName).append("=").append(fieldValue);
                        i = 1;
                    } else {
                        queryString.append("&").append(fieldName).append("=").append(fieldValue);
                    }
                }
            }
        }
        return queryString.toString();
    }

    /**
     * Verify secure hash from VNPay callback
     */
    public static boolean verifySecureHash(Map<String, String> params, String secretKey, String vnpSecureHash) {
        String queryString = createQueryString(params);
        String hashValue = hmacSHA512(secretKey, queryString);
        return hashValue != null && hashValue.equalsIgnoreCase(vnpSecureHash);
    }

}

