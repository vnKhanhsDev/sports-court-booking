package com.example.scbbackend.modules.address.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.address.entity.Province;
import com.example.scbbackend.modules.address.entity.Ward;
import com.example.scbbackend.modules.address.repository.ProvinceRepository;
import com.example.scbbackend.modules.address.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    @Transactional(readOnly = true)
    public List<Province> findAllProvinces() {
        return provinceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Ward> findAllWardsByProvinceCode(String provinceCode) {
        return wardRepository.findByProvinceCode(provinceCode);
    }

    @Transactional(readOnly = true)
    public Province findProvinceByCode(String provinceCode) {
        return provinceRepository.findByCode(provinceCode)
                .orElseThrow(() -> new AppException(ApiCode.PROVINCE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Province getProvinceByCodeName(String provinceCodeName) {
        return provinceRepository.findByCodeName(provinceCodeName)
                .orElseThrow(() -> new AppException(ApiCode.PROVINCE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Ward findWardByCode(String wardCode) {
        return wardRepository.findByCode(wardCode)
                .orElseThrow(() -> new AppException(ApiCode.WARD_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Ward getWardByCodeName(String wardCodeName) {
        return wardRepository.findByCodeName(wardCodeName)
                .orElseThrow(() -> new AppException(ApiCode.WARD_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Ward getWardByProvinceCodeNameAndWardCodeName(String provinceCodeName, String wardCodeName) {
        Province province = getProvinceByCodeName(provinceCodeName);
        return wardRepository.findByProvinceAndCodeName(province, wardCodeName)
                .orElseThrow(() -> new AppException(ApiCode.WARD_NOT_FOUND));
    }

}
