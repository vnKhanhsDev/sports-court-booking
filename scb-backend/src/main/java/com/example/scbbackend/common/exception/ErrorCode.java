package com.example.scbbackend.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorCode {

    ACCOUNT_EXISTED_WRONG_PASSWORD(HttpStatus.CONFLICT, "Account already exists & wrong password"),
    ACCOUNT_EXISTED_WITH_ROLE(HttpStatus.CONFLICT, "Account already exists & with the role"),
    ACCOUNT_PENDING_VERIFICATION(HttpStatus.FORBIDDEN, "Account pending verification"),
    ACCOUNT_BANNED(HttpStatus.FORBIDDEN, "Account banned"),

    ROLE_INVALID(HttpStatus.BAD_REQUEST, "Role invalid"),

    OTP_EXPIRED(HttpStatus.BAD_REQUEST, "OTP expired"),
    OTP_EXCEEDED(HttpStatus.TOO_MANY_REQUESTS, "OTP exceeded"),
    OTP_INCORRECT(HttpStatus.BAD_REQUEST, "OTP incorrect"),

    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid credentials"),

    ;

    private HttpStatus httpStatus;
    private String message;

}
