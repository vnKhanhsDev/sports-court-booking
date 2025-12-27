package com.example.scbbackend.modules.address.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "provinces")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Province {
    @Id
    @Column(unique = true, nullable = false)
    private String code;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(name = "full_name", unique = true, nullable = false)
    private String fullName;

    @Column(name = "code_name", unique = true, nullable = false)
    private String codeName;

    @JsonIgnore
    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<Ward> wards;
}
