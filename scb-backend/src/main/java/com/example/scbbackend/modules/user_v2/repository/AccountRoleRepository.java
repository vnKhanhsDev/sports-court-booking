package com.example.scbbackend.modules.user_v2.repository;

import com.example.scbbackend.modules.user_v2.entity.AccountRole;
import com.example.scbbackend.modules.user_v2.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AccountRoleRepository extends JpaRepository<AccountRole, UUID> {

    boolean existsByAccountEmailAndRole(String email, UserRole role);

}
