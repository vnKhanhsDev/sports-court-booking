package com.example.scbbackend.common.exception;

import com.example.scbbackend.common.enums.ApiCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppException extends RuntimeException {
    private ApiCode apiCode;
}
