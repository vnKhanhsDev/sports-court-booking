package com.example.scbbackend.common.response;

import com.example.scbbackend.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;

import java.time.Instant;

@Builder
public class ApiResponse <T> {

    private boolean success;
    private T data;
    private String errorCode;
    private String message;
    private Instant timestamp;
    private String path;

    public static <T> ApiResponse<T> success(T data, HttpServletRequest request) {
        return ApiResponse.<T>builder()
                .success(true)
                .data(data)
                .message("Success")
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
    }

    public static <T> ApiResponse<T> error(ErrorCode errorCode, HttpServletRequest request) {
        return ApiResponse.<T>builder()
                .success(false)
                .errorCode(errorCode.name())
                .message(errorCode.getMessage())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
    }

}
