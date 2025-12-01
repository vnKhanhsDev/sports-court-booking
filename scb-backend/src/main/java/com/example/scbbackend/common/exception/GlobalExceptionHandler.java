package com.example.scbbackend.common.exception;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = AppException.class)
    public ApiResponse<?> handleAppException(AppException e) {
        return ApiResponse.error(e.getApiCode());
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ApiResponse<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, Object> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach((fieldError) -> {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        });

        return ApiResponse.error(ApiCode.INPUT_INVALID, errors);
    }

}
