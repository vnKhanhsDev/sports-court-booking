package com.example.scbbackend.modules.auth.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.auth.dto.request.LoginRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewAccountRequest;
import com.example.scbbackend.modules.auth.dto.request.RegisterNewRoleRequest;
import com.example.scbbackend.modules.auth.dto.request.VerifyOtpRequest;
import com.example.scbbackend.modules.auth.dto.response.AuthFlowStepsResponse;
import com.example.scbbackend.modules.auth.dto.response.AuthResponse;
import com.example.scbbackend.modules.auth.entity.RefreshToken;
import com.example.scbbackend.modules.auth.enums.AuthFlowStep;
import com.example.scbbackend.modules.auth.enums.OtpType;
import com.example.scbbackend.modules.user.dto.request.UserCreationRequest;
import com.example.scbbackend.modules.user.dto.response.UserLoginResponse;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.enums.AccountStatus;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.service.AccountService;
import com.example.scbbackend.modules.user.service.UserService;
import com.example.scbbackend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthFlowService authFlowService;
    private final AccountService accountService;
    private final UserService userService;
    private final OtpCodeService otpCodeService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    /*******************
     *  LOGIN SERVICE  *
     *******************/
    public AuthResponse login(LoginRequest request) {
        Account account = accountService.findAccountByContact(request.contact());

        if (account == null || !account.hasRole(UserRole.fromString(request.role()))) {
            log.warn("Invalid login request. Account not found.");
            throw new AppException(ApiCode.ACCOUNT_NOT_FOUND);
        }
        if (!passwordEncoder.matches(request.password(), account.getPassword()))
            throw new AppException(ApiCode.PASSWORD_INCORRECT);
        if (account.getStatus() == AccountStatus.BANNED)
            throw new AppException(ApiCode.ACCOUNT_BANNED);

        String accessToken = jwtService.generateAccessToken(account);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(account);

        String avatarUrl = account.getUserProfile() != null ? account.getUserProfile().getAvatarUrl() : null;

        UserLoginResponse userLoginResponse = UserLoginResponse.builder()
                .accountId(account.getId())
                .username(account.getUsername())
                .avatarUrl(avatarUrl)
                .roles(account.getRoleNames())
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken.getToken())
                .user(userLoginResponse)
                .build();
    }

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

    /**************************
     *  REFRESH TOKEN SERVICE  *
     **************************/
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken refreshTokenObj = refreshTokenService.verifyRefreshToken(refreshToken);
        Account account = refreshTokenObj.getAccount();

        if (account.getStatus() == AccountStatus.BANNED) {
            refreshTokenService.deleteByAccountId(account.getId());
            throw new AppException(ApiCode.ACCOUNT_BANNED);
        }

        String newAccessToken = jwtService.generateAccessToken(account);

        refreshTokenService.deleteByAccountId(account.getId());
        RefreshToken newRefreshTokenObj = refreshTokenService.createRefreshToken(account);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenObj.getToken())
                .user(null)
                .build();
    }

}
