package com.example.scbbackend.common.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ApiCode {

    /* SUCCESS */

    /* BUSINESS ERRORS */
    INPUT_INVALID(1000, "Input invalid", HttpStatus.BAD_REQUEST),

    /* SYSTEM ERRORS */

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

}
