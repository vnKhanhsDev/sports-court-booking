package com.example.scbbackend.modules.catalog.service;

import com.example.scbbackend.common.enums.ApiCode;
import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.modules.catalog.dto.response.CourtTypePublicResponse;
import com.example.scbbackend.modules.catalog.dto.response.SportPublicResponse;
import com.example.scbbackend.modules.catalog.dto.response.SurfaceTypePublicResponse;
import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    @Transactional(readOnly = true)
    public List<SportPublicResponse> getCatalog() {
        List<Sport> sports = sportRepository.findAll();
        
        // Fetch all court types and surface types once
        var allCourtTypes = courtTypeRepository.findAll();
        var allSurfaceTypes = surfaceTypeRepository.findAll();
        
        return sports.stream()
                .map(sport -> {
                    // Filter court types for this sport
                    List<CourtTypePublicResponse> courtTypes = allCourtTypes.stream()
                            .filter(courtType -> courtType.getSport().getId().equals(sport.getId()))
                            .map(courtType -> new CourtTypePublicResponse(
                                    courtType.getId(),
                                    courtType.getName()
                            ))
                            .collect(Collectors.toList());
                    
                    // Filter surface types for this sport
                    List<SurfaceTypePublicResponse> surfaceTypes = allSurfaceTypes.stream()
                            .filter(surfaceType -> surfaceType.getSport().getId().equals(sport.getId()))
                            .map(surfaceType -> new SurfaceTypePublicResponse(
                                    surfaceType.getId(),
                                    surfaceType.getName()
                            ))
                            .collect(Collectors.toList());
                    
                    return new SportPublicResponse(
                            sport.getId(),
                            sport.getName(),
                            courtTypes,
                            surfaceTypes
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Sport findSportById(Long id) {
        return sportRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public Sport getSportById(Long id) {
        return sportRepository.findById(id)
                .orElseThrow(() -> new AppException(ApiCode.SPORT_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Sport getSportByCode(String code) {
        return sportRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ApiCode.SPORT_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public CourtType findCourtTypeById(Long id) {
        return courtTypeRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public CourtType getCourtTypeById(Long id) {
        return courtTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ApiCode.COURT_TYPE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public CourtType getCourtTypeByCode(String code) {
        return courtTypeRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ApiCode.COURT_TYPE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public SurfaceType findSurfaceTypeById(Long id) {
        return surfaceTypeRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public SurfaceType getSurfaceTypeById(Long id) {
        return surfaceTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ApiCode.SURFACE_TYPE_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public SurfaceType getSurfaceTypeByCode(String code) {
        return surfaceTypeRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ApiCode.SURFACE_TYPE_NOT_FOUND));
    }

}
