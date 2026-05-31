package com.example.scbbackend.modules.user_v2.entity;

import com.example.scbbackend.common.entity.BaseEntity;
import com.example.scbbackend.modules.user_v2.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account_roles")
@AllArgsConstructor
@NoArgsConstructor
@Builder(toBuilder = true)
public class AccountRole extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

}
