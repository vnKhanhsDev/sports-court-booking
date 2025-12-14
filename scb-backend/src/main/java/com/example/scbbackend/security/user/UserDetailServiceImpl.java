package com.example.scbbackend.security.user;

import com.example.scbbackend.modules.user.repository.AccountRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    @NonNull
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(@NonNull String accountId) throws UsernameNotFoundException {
        return accountRepository.findByIdWithRoles(UUID.fromString(accountId))
                .orElseThrow(() -> new UsernameNotFoundException("Account not found: " + accountId));
    }

}
