package com.example.scbbackend.security.jwt;

import com.example.scbbackend.common.dto.ApiResponse;
import com.example.scbbackend.common.enums.ApiCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * JwtAuthenticationEntryPoint
 * Xử lý khi người dùng chưa xác thực mà cố truy cập tài nguyên cần xác thực.
 * Tự đônng gọi lớp này khi gặp lỗi Authentication (401)
 * */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    // Convert object Java to JSON
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(
            @NonNull HttpServletRequest request,
            HttpServletResponse response,
            @NonNull AuthenticationException authException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        String exceptionType = (String) request.getAttribute("exception");
        ApiCode apiCode = mapExceptionToApiCode(exceptionType);

        response.getWriter().write(mapper.writeValueAsString(ApiResponse.error(apiCode)));
        response.flushBuffer();
    }

    private ApiCode mapExceptionToApiCode(String exceptionType) {
        if (exceptionType == null) return ApiCode.UNAUTHENTICATED;

        return switch (exceptionType) {
            case "TOKEN_EXPIRED" -> ApiCode.TOKEN_EXPIRED;
            case "TOKEN_INVALID" -> ApiCode.TOKEN_INVALID;
            case "USER_NOT_FOUND" -> ApiCode.USER_NOT_FOUND;
            default -> ApiCode.UNAUTHENTICATED;
        };
    }

}
