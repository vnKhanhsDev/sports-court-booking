package com.example.scbbackend.modules.user.entity;

import com.example.scbbackend.modules.user.enums.AccountStatus;
import com.example.scbbackend.modules.user.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Email(message = "Email invalid")
    @Column(unique = true, length = 100)
    private String email;

    @Column(unique = true, length = 15)
    private String phone;

    private String password;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @Column(name = "phone_verified")
    private boolean phoneVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private AccountStatus status = AccountStatus.ACTIVE;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private Set<AccountRole> roles;

    @OneToOne(mappedBy = "account")
    private UserProfile userProfile;

    @OneToOne(mappedBy = "account")
    private PlayerInfo playerInfo;

    @OneToOne(mappedBy = "account")
    private OwnerInfo ownerInfo;

    @Transient
    public boolean hasRole(UserRole role) {
        return roles.stream().map(AccountRole::getRole).anyMatch(role::equals);
    }
}
