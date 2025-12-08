package com.example.scbbackend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ApiCode {

    /* SUCCESS */
    VERIFY_OTP_SUCCESS(2000, "Verify otp successfully", HttpStatus.OK),
    RESEND_OTP_SUCCESS(2001, "Resend otp successfully", HttpStatus.OK),
    REGISTER_AVAILABILITY(2000, "Register availability", HttpStatus.OK),
    REGISTER_SUCCESS(2001, "Register successfully", HttpStatus.OK),

    /* BUSINESS ERRORS */
    INPUT_INVALID(1000, "Input invalid", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(1000, "Gender invalid", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1000, "Role invalid", HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED(1001, "Account existed", HttpStatus.BAD_REQUEST),
    OTP_CHANNEL_INVALID(1000, "Otp channel invalid", HttpStatus.BAD_REQUEST),
    OTP_INVALID(1000, "Otp invalid", HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(1000, "Otp expired", HttpStatus.BAD_REQUEST),
    OTP_MAX_ATTEMPTS(1000, "Otp max attempts", HttpStatus.BAD_REQUEST),
    OTP_INCORRECT(1000, "Otp incorrect", HttpStatus.BAD_REQUEST),
    ACCOUNT_NOT_FOUND(1001, "Account not found", HttpStatus.NOT_FOUND),

    /* SYSTEM ERRORS */

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

}
