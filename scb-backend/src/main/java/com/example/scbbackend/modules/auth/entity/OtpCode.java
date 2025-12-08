package com.example.scbbackend.modules.auth.entity;

import com.example.scbbackend.modules.auth.enums.OtpChannel;
import com.example.scbbackend.modules.auth.enums.OtpType;
import com.example.scbbackend.modules.user.entity.Account;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "otp_codes",
        indexes = {
                @Index(name = "idx_contact_type_used", columnList = "contact, type, used")
        }
)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class OtpCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String contact;

    @Column(nullable = false, length = 10)
    private String code;

    @Column(nullable = false, length = 10)
    private OtpChannel channel;

    @Column(nullable = false, length = 20)
    private OtpType type;

    @Column(name = "expiry_at", nullable = false, updatable = false)
    private LocalDateTime expiryAt;

    private boolean used = false;

    private int attempts = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
