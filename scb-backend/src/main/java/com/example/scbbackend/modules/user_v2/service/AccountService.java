package com.example.scbbackend.modules.user_v2.service;

import com.example.scbbackend.modules.user_v2.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

}
