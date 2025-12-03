package com.example.scbbackend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ApiCode {

    /* SUCCESS */
    REGISTER_AVAILABILITY(2000, "Register availability", HttpStatus.OK),

    /* BUSINESS ERRORS */
    INPUT_INVALID(1000, "Input invalid", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(1000, "Gender invalid", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1000, "Role invalid", HttpStatus.BAD_REQUEST),
    ACCOUNT_EXISTED(1000, "Account existed", HttpStatus.BAD_REQUEST),

    /* SYSTEM ERRORS */

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

}
