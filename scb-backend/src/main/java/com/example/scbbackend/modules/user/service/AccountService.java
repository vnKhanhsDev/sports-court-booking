package com.example.scbbackend.modules.user.service;

import com.example.scbbackend.modules.user.entity.Account;
import com.example.scbbackend.modules.user.repository.AccountRepository;
import com.example.scbbackend.modules.user.repository.AccountRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final AccountRoleRepository accountRoleRepository;

    @Transactional(readOnly = true)
    public Account findAccountByContact(String contact) {
        return contact.contains("@") ?
                accountRepository.findByEmail(contact).orElse(null) :
                accountRepository.findByPhone(contact).orElse(null);
    }

}
