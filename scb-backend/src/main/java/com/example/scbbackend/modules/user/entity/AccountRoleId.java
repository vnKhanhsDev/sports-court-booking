package com.example.scbbackend.modules.user.entity;

import com.example.scbbackend.modules.user.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
public class AccountRoleId implements Serializable {

    private UUID account;
    private UserRole role;

}
