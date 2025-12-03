package com.example.scbbackend.modules.user.repository;

import com.example.scbbackend.modules.user.entity.AccountRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccountRoleRepository extends JpaRepository<AccountRole, UUID> {
}
