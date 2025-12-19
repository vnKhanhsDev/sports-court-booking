package com.example.scbbackend.modules.court.entity;

import com.example.scbbackend.modules.address.entity.District;
import com.example.scbbackend.modules.address.entity.Province;
import com.example.scbbackend.modules.address.entity.Ward;
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
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_code")
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_code")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_code")
    private Ward ward;

    @Column(name = "address_detail")
    private String addressDetail;

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

    @PrePersist
    public void prePersist() {
        this.status = FacilityStatus.PENDING;
    }

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (addressDetail != null) sb.append(addressDetail);
        if (ward != null) sb.append(", ").append(ward.getName());
        if (district != null) sb.append(", ").append(district.getName());
        if (province != null) sb.append(", ").append(province.getName());
        return sb.toString();
    }
}
