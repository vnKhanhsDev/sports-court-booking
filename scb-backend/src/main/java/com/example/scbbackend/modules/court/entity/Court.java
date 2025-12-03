package com.example.scbbackend.modules.court.entity;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "courts")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class Court {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private Facility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_type_id", nullable = false)
    private CourtType courtType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surface_type_id", nullable = false)
    private SurfaceType surfaceType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_price_template_id", nullable = false)
    private FacilityPriceTemplate facilityPriceTemplate;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CourtStatus status;

    private boolean isOverridePrice = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
