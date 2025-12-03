package com.example.scbbackend.modules.user.entity;

import com.example.scbbackend.modules.user.enums.UserRole;

import java.io.Serializable;
import java.util.UUID;

public class AccountRoleId implements Serializable {
    UUID id;
    UserRole role;
}
