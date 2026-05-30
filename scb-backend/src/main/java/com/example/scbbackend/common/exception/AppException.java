package com.example.scbbackend.common.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AppException extends RuntimeException {

    private final ErrorCode errorCode;
    private final HttpServletRequest request;

    /*
    * @param errorCode: USER_NOT_FOUND
    * @param detail: "id=123"
    * @return: "User not found: id=123"
    * */
    public AppException(ErrorCode errorCode, String detail, HttpServletRequest request) {
        super(errorCode.getMessage() + ": " + detail);
        this.errorCode = errorCode;
        this.request = request;
    }

}
