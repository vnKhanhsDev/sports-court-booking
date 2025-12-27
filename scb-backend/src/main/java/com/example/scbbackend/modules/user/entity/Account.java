package com.example.scbbackend.modules.user.entity;

import com.example.scbbackend.modules.user.enums.AccountStatus;
import com.example.scbbackend.modules.user.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "accounts")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Account implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String username;

    @Email
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
    @Column(length = 20)
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

    @Transient
    public Set<String> getRoleNames() {
        return roles.stream()
                .map(AccountRole::getRole)
                .map(UserRole::name)
                .collect(Collectors.toUnmodifiableSet());
    }

    @Transient
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoleNames().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                .toList();
    }

}
