package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewAccountRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewRoleRequest;
import com.example.scbbackend.modules.auth.dto.request.VerifyOtpRequest;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.enums.AuthFlowStep;
import com.example.scbbackend.modules.auth.enums.OtpType;
import com.example.scbbackend.modules.user.dto.request.UserCreationRequest;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.service.AccountService;
import com.example.scbbackend.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthFlowService authFlowService;
    private final AccountService accountService;
    private final UserService userService;
    private final OtpCodeService otpCodeService;

    public void registerNewAccount(RegisterNewAccountRequest request) {
        UserCreationRequest userCreationRequest = UserCreationRequest.builder()
                .contact(request.contact())
                .role(request.role())
                .fullName(request.fullName())
                .gender(request.gender())
                .dob(request.dob())
                .password(request.password())
                .build();

        userService.createUser(userCreationRequest);
    }

    public void registerNewRole(RegisterNewRoleRequest request) {
        accountService.addNewRoleToAccount(request.accountId(), request.role());
    }

    public Object verifyOtp(VerifyOtpRequest request) {
        OtpType type = OtpType.fromString(request.type());

        otpCodeService.verifyOtpCode(request.contact(), type, request.code());

        if (type == OtpType.REGISTER)
            return userService.getUserRegistration(request.contact());

        return null;
    }

    public void resendOtp(String contact, String type) {
        otpCodeService.resendOtpCode(contact, type);
    }

    public AuthFlowStepsResponse checkRegisterAvailability(String contact, String role) {
        Account account = accountService.findAccountByContact(contact);
        UserRole userRole = UserRole.fromString(role);

        if (account != null && account.hasRole(userRole))
            throw new AppException(ApiCode.ACCOUNT_EXISTED);

        otpCodeService.sendOtpCode(contact, OtpType.REGISTER);

        List<AuthFlowStep> steps = authFlowService.determineRegisterSteps(account);

        return new AuthFlowStepsResponse(steps);
    }

}
