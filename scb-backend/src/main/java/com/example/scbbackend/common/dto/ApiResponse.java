package com.example.scbbackend.common.dto;

import com.example.scbbackend.common.enums.ApiCode;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.http.HttpStatus;

import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse <T> {

    private boolean success;
    private int code;
    private String message;
    private T data;
    private Map<String, Object> errors;

    @JsonIgnore
    private HttpStatus httpStatus;


    public static <T> ApiResponse<T> success(ApiCode apiCode, T data) {
        return new ApiResponse<T>().toBuilder()
                .success(true)
                .code(apiCode.getCode())
                .message(apiCode.getMessage())
                .data(data)
                .httpStatus(apiCode.getHttpStatus())
                .build();
    }

    public static <T> ApiResponse<T> success(ApiCode apiCode) {
        return new ApiResponse<T>().toBuilder()
                .success(true)
                .code(apiCode.getCode())
                .message(apiCode.getMessage())
                .httpStatus(apiCode.getHttpStatus())
                .build();
    }

    public static <T> ApiResponse<T> error(ApiCode apiCode, Map<String, Object> errors) {
        return new ApiResponse<T>().toBuilder()
                .success(false)
                .code(apiCode.getCode())
                .message(apiCode.getMessage())
                .errors(errors)
                .httpStatus(apiCode.getHttpStatus())
                .build();
    }

    public static <T> ApiResponse<T> error(ApiCode apiCode) {
        return new ApiResponse<T>().toBuilder()
                .success(false)
                .code(apiCode.getCode())
                .message(apiCode.getMessage())
                .httpStatus(apiCode.getHttpStatus())
                .build();
    }
}
