package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.enums.AuthFlowStep;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthFlowService authFlowService;
    private final AccountService accountService;

    public AuthFlowStepsResponse checkRegisterAvailability(String contact, String role) {
        Account account = accountService.findAccountByContact(contact);
        UserRole userRole = UserRole.fromString(role);

        if (account != null && account.hasRole(userRole))
            throw new AppException(ApiCode.ACCOUNT_EXISTED);

        List<AuthFlowStep> steps = authFlowService.determineRegisterSteps(account);

        return new AuthFlowStepsResponse(steps);
    }

}
