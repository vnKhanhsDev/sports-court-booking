package com.example.scbbackend.modules.court.entity;

import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.court.enums.FacilityStatus;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name = "facilities")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Facility {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_account_id", nullable = false)
    private OwnerInfo ownerInfo;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "province_code", nullable = false)
    private String provinceCode;

    @Column(name = "ward_code", nullable = false)
    private String wardCode;

    @Column(name = "address_detail", nullable = false)
    private String addressDetail;

    @Column(name = "full_address", nullable = false)
    private String fullAddress;

    @Column(name = "geo_latitude")
    private Double geoLatitude;

    @Column(name = "geo_longitude")
    private Double geoLongitude;

    @Enumerated(EnumType.STRING)
    @Column(length = 15, nullable = false)
    private FacilityStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "facility", fetch = FetchType.LAZY)
    private Set<Court> courts;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "facility_sports",
        joinColumns = @JoinColumn(name = "facility_id"),
        inverseJoinColumns = @JoinColumn(name = "sport_id")
    )
    private Set<Sport> activeSports;

    @PrePersist
    public void prePersist() {
        this.status = FacilityStatus.PENDING;
    }
}
