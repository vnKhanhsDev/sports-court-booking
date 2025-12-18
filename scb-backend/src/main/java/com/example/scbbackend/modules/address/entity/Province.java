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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Province {
    @Id
    private String code;

    private String name;
    private String codeName;

    @JsonIgnore
    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<District> districts;
}
