package com.example.scbbackend.security.resolver;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import com.example.scbbackend.security.annotation.CurrentAccount;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.UUID;

/**
 * Argument resolver that automatically injects the current authenticated Account
 * into controller method parameters annotated with @CurrentAccount.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CurrentAccountArgumentResolver implements HandlerMethodArgumentResolver {

    private final AccountRepository accountRepository;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentAccount.class) &&
               parameter.getParameterType().equals(Account.class);
    }

    @Override
    public Object resolveArgument(
            MethodParameter parameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || authentication.getPrincipal() == null) {
            log.warn("No authentication found in SecurityContext");
            throw new AppException(ApiCode.UNAUTHENTICATED);
        }

        String accountId = authentication.getPrincipal().toString();
        
        try {
            UUID uuid = UUID.fromString(accountId);
            return accountRepository.findByIdWithRoles(uuid)
                    .orElseThrow(() -> {
                        log.warn("Account not found for ID: {}", accountId);
                        return new AppException(ApiCode.ACCOUNT_NOT_FOUND);
                    });
        } catch (IllegalArgumentException e) {
            log.error("Invalid account ID format: {}", accountId, e);
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }
    }
}
