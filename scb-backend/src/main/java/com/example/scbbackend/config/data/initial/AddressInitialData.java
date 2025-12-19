package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.modules.address.entity.District;
import com.example.scbbackend.modules.address.entity.Province;
import com.example.scbbackend.modules.address.entity.Ward;
import com.example.scbbackend.modules.address.repository.DistrictRepository;
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
    private final DistrictRepository districtRepository;
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

            // Đọc file từ thư mục resources/data/vietnam-address-data.json
            ClassPathResource resource = new ClassPathResource("/data/vietnam-address-data.json");
            InputStream inputStream = resource.getInputStream();

            // Map JSON vào DTO tạm thời
            List<ProvinceJsonDto> provinceJsonDtos = mapper.readValue(
                    inputStream, new TypeReference<>() {});

            List<Province> provinces = new ArrayList<>();
            List<District> districts = new ArrayList<>();
            List<Ward> wards = new ArrayList<>();

            for (ProvinceJsonDto pjDto : provinceJsonDtos) {
                Province province = new Province();
                province.setCode(String.valueOf(pjDto.getCode()));
                province.setName(pjDto.getName());
                province.setCodeName(pjDto.getCodename());
                provinces.add(province);

                for (DistrictJsonDto djDto : pjDto.getDistricts()) {
                    District district = new District();
                    district.setCode(String.valueOf(djDto.getCode()));
                    district.setName(djDto.getName());
                    district.setCodeName(djDto.getCodename());
                    district.setProvince(province);
                    districts.add(district);

                    for (WardJsonDto wjDto : djDto.getWards()) {
                        Ward ward = new Ward();
                        ward.setCode(String.valueOf(wjDto.getCode()));
                        ward.setName(wjDto.getName());
                        ward.setCodeName(wjDto.getCodename());
                        ward.setDistrict(district);
                        wards.add(ward);
                    }
                }
            }

            provinceRepository.saveAll(provinces);
            districtRepository.saveAll(districts);
            wardRepository.saveAll(wards);

            log.info("Imported {} provinces, {} districts, {} wards", provinces.size(), districts.size(), wards.size());
        } catch (Exception e) {
            log.error("Error while trying to seed database address data", e);
            throw new RuntimeException(e);
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class ProvinceJsonDto {
        private String name;
        private int code;
        private String codename;
        List<DistrictJsonDto> districts = new ArrayList<>();
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class DistrictJsonDto {
        private String name;
        private int code;
        private String codename;
        List<WardJsonDto> wards = new ArrayList<>();
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    static class WardJsonDto {
        private String name;
        private int code;
        private String codename;
    }

}