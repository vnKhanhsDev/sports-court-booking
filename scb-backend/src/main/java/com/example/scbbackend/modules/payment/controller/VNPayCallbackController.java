package com.example.scbbackend.modules.payment.controller;

import com.example.scbbackend.modules.booking.enums.BookingStatus;
import com.example.scbbackend.modules.booking.service.BookingService;
import com.example.scbbackend.modules.payment.services.VNPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1/payment/vnpay")
@RequiredArgsConstructor
public class VNPayCallbackController {

    private final VNPayService vnPayService;
    private final BookingService bookingService;

    @GetMapping("/return")
    public org.springframework.web.servlet.view.RedirectView vnpayReturn(@RequestParam Map<String, String> allParams) {
        try {
            log.info("VNPay return callback received with params: {}", allParams);
            
            Map<String, String> result = vnPayService.verifyPayment(new HashMap<>(allParams));
            
            boolean isValid = Boolean.parseBoolean(result.get("isValid"));
            String responseCode = result.get("responseCode");
            String transactionStatus = result.get("transactionStatus");
            
            // Response code "00" and transaction status "00" means successful payment
            boolean isSuccess = isValid && "00".equals(responseCode) && "00".equals(transactionStatus);
            
            if (isSuccess) {
                log.info("VNPay payment successful for txnRef: {}", result.get("txnRef"));
                
                // Extract booking ID from txnRef (format: bookingId-timestamp)
                String txnRef = result.get("txnRef");
                try {
                    // txnRef format: bookingId-timestamp where bookingId is a UUID
                    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (has 4 hyphens = 5 parts when split)
                    // If timestamp is present, there will be 6 parts (5 UUID parts + 1 timestamp part)
                    String bookingIdStr;
                    String[] parts = txnRef.split("-");
                    if (parts.length == 6) {
                        // UUID + timestamp: take first 5 parts to reconstruct UUID
                        bookingIdStr = String.join("-", Arrays.copyOf(parts, 5));
                    } else if (parts.length == 5) {
                        // Just UUID without timestamp
                        bookingIdStr = txnRef;
                    } else {
                        // Invalid format, try to parse as-is (might be just UUID in different format)
                        bookingIdStr = txnRef;
                    }
                    
                    UUID bookingId = UUID.fromString(bookingIdStr);
                    
                    // Update booking status to CONFIRMED
                    bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
                    log.info("Booking {} status updated to CONFIRMED after successful payment", bookingId);
                } catch (IllegalArgumentException e) {
                    log.error("Invalid booking ID format in txnRef {}: {}", txnRef, e.getMessage());
                } catch (Exception e) {
                    log.error("Error updating booking status from txnRef {}: {}", txnRef, e.getMessage(), e);
                }
            } else {
                log.warn("VNPay payment failed for txnRef: {}, responseCode: {}, transactionStatus: {}", 
                        result.get("txnRef"), responseCode, transactionStatus);
            }
            
            // Redirect to frontend with payment result as query parameters
            String frontendReturnUrl = "http://localhost:5173/payment/vnpay-return";
            String txnRef = result.get("txnRef") != null ? result.get("txnRef") : "";
            String transactionNo = result.get("transactionNo") != null ? result.get("transactionNo") : "";
            
            String redirectUrl = frontendReturnUrl + 
                "?vnp_ResponseCode=" + URLEncoder.encode(responseCode != null ? responseCode : "", StandardCharsets.UTF_8) +
                "&vnp_TxnRef=" + URLEncoder.encode(txnRef, StandardCharsets.UTF_8) +
                "&vnp_TransactionNo=" + URLEncoder.encode(transactionNo, StandardCharsets.UTF_8) +
                "&success=" + isSuccess;
            
            return new org.springframework.web.servlet.view.RedirectView(redirectUrl);
        } catch (Exception e) {
            log.error("Error processing VNPay return callback: {}", e.getMessage(), e);
            // Redirect to frontend with error
            String frontendReturnUrl = "http://localhost:5173/payment/vnpay-return";
            String redirectUrl = frontendReturnUrl + "?success=false&error=processing_error";
            return new org.springframework.web.servlet.view.RedirectView(redirectUrl);
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<?> vnpayIPN(@RequestParam Map<String, String> allParams) {
        Map<String, String> responseData = new HashMap<>();
        
        try {
            log.info("VNPay IPN callback received with params: {}", allParams);
            
            Map<String, String> result = vnPayService.verifyPayment(new HashMap<>(allParams));
            
            boolean isValid = Boolean.parseBoolean(result.get("isValid"));
            String responseCode = result.get("responseCode");
            String transactionStatus = result.get("transactionStatus");
            String txnRef = result.get("txnRef");
            
            // Response code "00" and transaction status "00" means successful payment
            boolean isSuccess = isValid && "00".equals(responseCode) && "00".equals(transactionStatus);
            
            if (isSuccess) {
                log.info("VNPay IPN payment successful for txnRef: {}", txnRef);
                
                // Extract booking ID from txnRef (format: bookingId-timestamp)
                try {
                    // txnRef format: bookingId-timestamp where bookingId is a UUID
                    // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (has 4 hyphens = 5 parts when split)
                    // If timestamp is present, there will be 6 parts (5 UUID parts + 1 timestamp part)
                    String bookingIdStr;
                    String[] parts = txnRef.split("-");
                    if (parts.length == 6) {
                        // UUID + timestamp: take first 5 parts to reconstruct UUID
                        bookingIdStr = String.join("-", Arrays.copyOf(parts, 5));
                    } else if (parts.length == 5) {
                        // Just UUID without timestamp
                        bookingIdStr = txnRef;
                    } else {
                        // Invalid format, try to parse as-is (might be just UUID in different format)
                        bookingIdStr = txnRef;
                    }
                    
                    UUID bookingId = UUID.fromString(bookingIdStr);
                    
                    // Update booking status to CONFIRMED
                    bookingService.updateBookingStatus(bookingId, BookingStatus.CONFIRMED);
                    log.info("Booking {} status updated to CONFIRMED after successful IPN payment", bookingId);
                    
                    // Return success response to VNPay
                    responseData.put("RspCode", "00");
                    responseData.put("Message", "Confirm Success");
                } catch (IllegalArgumentException e) {
                    log.error("Invalid booking ID format in txnRef {}: {}", txnRef, e.getMessage());
                    responseData.put("RspCode", "01");
                    responseData.put("Message", "Order not found");
                } catch (Exception e) {
                    log.error("Error updating booking status from txnRef {}: {}", txnRef, e.getMessage(), e);
                    responseData.put("RspCode", "99");
                    responseData.put("Message", "Unknown error");
                }
            } else {
                log.warn("VNPay IPN payment failed for txnRef: {}, responseCode: {}, transactionStatus: {}", 
                        txnRef, responseCode, transactionStatus);
                
                // Check if signature is invalid
                if (!isValid) {
                    responseData.put("RspCode", "97");
                    responseData.put("Message", "Invalid signature");
                } else {
                    responseData.put("RspCode", "99");
                    responseData.put("Message", "Payment failed");
                }
            }
        } catch (Exception e) {
            log.error("Error processing VNPay IPN callback: {}", e.getMessage(), e);
            responseData.put("RspCode", "99");
            responseData.put("Message", "Unknown error");
        }
        
        // Return JSON response to VNPay as per documentation
        return ResponseEntity.ok(responseData);
    }
}

