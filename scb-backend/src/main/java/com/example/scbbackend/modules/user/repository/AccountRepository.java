package com.example.scbbackend.modules.user.repository;

import com.example.scbbackend.modules.user.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByPhone(String phone);
}
