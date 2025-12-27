package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.modules.address.entity.Province;
import com.example.scbbackend.modules.address.entity.Ward;
import com.example.scbbackend.modules.address.repository.ProvinceRepository;
import com.example.scbbackend.modules.address.repository.WardRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressInitialData {

    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    @Transactional
    public void initialize() {
        if (provinceRepository.count() > 0) {
            log.info("Address data already exists. Skipping...");
            return;
        }

        try {
            log.info("Start seeding address...");

            ObjectMapper mapper = new ObjectMapper();

            ClassPathResource resource = new ClassPathResource("/data/vietnam_address_data_minified.json");
            InputStream inputStream = resource.getInputStream();

            List<ProvinceJsonDto> provinceJsonDtos = mapper.readValue(inputStream, new TypeReference<>() {});

            List<Province> provinces = new ArrayList<>();
            List<Ward> wards = new ArrayList<>();

            for (ProvinceJsonDto p : provinceJsonDtos) {
                Province province = new Province();
                province.setCode(p.getCode());
                province.setName(p.getName());
                province.setFullName(p.getFullName());
                province.setCodeName(p.getCodeName());

                provinces.add(province);

                for (WardJsonDto w : p.getWards()) {
                    Ward ward = new Ward();
                    ward.setCode(w.getCode());
                    ward.setName(w.getName());
                    ward.setFullName(w.getFullName());
                    ward.setCodeName(w.getCodeName());
                    ward.setProvince(province);

                    wards.add(ward);
                }
            }

            provinceRepository.saveAll(provinces);
            wardRepository.saveAll(wards);

            log.info("Imported {} provinces, {} wards", provinces.size(), wards.size());
        } catch (Exception e) {
            log.error("Error while trying to seed database address data", e);
            throw new RuntimeException(e);
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class ProvinceJsonDto {
        private String code;
        private String name;
        private String fullName;
        private String codeName;
        List<WardJsonDto> wards = new ArrayList<>();
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class WardJsonDto {
        private String code;
        private String name;
        private String fullName;
        private String codeName;
    }

}