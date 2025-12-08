package com.example.scbbackend.modules.user.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.user.dto.request.UserCreationRequest;
import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.entity.AccountRole;
import com.example.scbbackend.modules.user.enums.UserRole;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import com.example.scbbackend.modules.user.repository.AccountRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Account findAccountByContact(String contact) {
        return contact.contains("@") ?
                accountRepository.findByEmail(contact).orElse(null) :
                accountRepository.findByPhone(contact).orElse(null);
    }

    @Transactional(readOnly = true)
    public UUID getAccountIdByContact(String contact) {
        Account account = findAccountByContact(contact);
        return account != null ? account.getId() : null;
    }

    @Transactional
    public Account createAccount(UserCreationRequest request) {
        boolean isEmail = request.contact().contains("@");

        Account account = accountRepository.save(
                Account.builder()
                        .username(generateUsername())
                        .email(isEmail ? request.contact() : null)
                        .phone(!isEmail ? request.contact() : null)
                        .password(passwordEncoder.encode(request.password()))
                        .emailVerified(isEmail)
                        .phoneVerified(!isEmail)
                        .build()
        );

        saveAccountRole(account, request.role());

        return account;
    }

    @Transactional
    public void addNewRoleToAccount(String accountId, String role) {
        Account account = accountRepository.findById(UUID.fromString(accountId))
                .orElseThrow(() -> new AppException(ApiCode.ACCOUNT_NOT_FOUND));

        saveAccountRole(account, role);
    }

    private void saveAccountRole(Account account, String role) {
        accountRoleRepository.save(
                AccountRole.builder()
                        .account(account)
                        .role(UserRole.fromString(role))
                        .build()
        );
    }

    private String generateUsername() {
        final int USERNAME_LENGTH = 8;
        final String CHAR_POOL = "abcdefghijklmnopqrstuvwxyz0123456789";

        Random random = new SecureRandom();

        String username;
        do {
            StringBuilder sb = new StringBuilder(USERNAME_LENGTH);
            for (int i = 0; i < USERNAME_LENGTH; i++) {
                int index = random.nextInt(CHAR_POOL.length());
                sb.append(CHAR_POOL.charAt(index));
            }
            username = sb.toString();
        } while (accountRepository.existsByUsername(username));

        return username;
    }

}
