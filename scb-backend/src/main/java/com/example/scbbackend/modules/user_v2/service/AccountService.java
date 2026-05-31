package com.example.scbbackend.modules.user_v2.service;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.modules.user_v2.entity.Account;
import com.example.scbbackend.modules.user_v2.entity.AccountRole;
import com.example.scbbackend.modules.user_v2.enums.UserRole;
import com.example.scbbackend.modules.user_v2.repository.AccountRepository;
import com.example.scbbackend.modules.user_v2.repository.AccountRoleRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;

    public void registerLocalAccount(String email, String password, String strRole, HttpServletRequest request) {
        UserRole role = UserRole.fromString(strRole, request);

        boolean existed = accountRoleRepository.existsByAccountEmailAndRole(email, role);

        if (existed)
            throw new AppException(ErrorCode.ACCOUNT_EXISTED_WITH_ROLE, request);

        createLocalAccount(email, password, role);
    }

    private void createLocalAccount(String email, String password, UserRole role) {
        Account newAccount = accountRepository.save(
                Account.builder()
                        .email(email)
                        .passwordHash(passwordEncoder.encode(password))
                        .build());

        accountRoleRepository.save(
                AccountRole.builder()
                        .account(newAccount)
                        .role(role)
                        .build());
    }

}
