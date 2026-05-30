package com.example.scbbackend.modules.catalog.service;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import com.example.scbbackend.modules.catalog.dto.response.PublicCourtTypeResponse;
import com.example.scbbackend.modules.catalog.dto.response.PublicSportResponse;
import com.example.scbbackend.modules.catalog.dto.response.PublicSurfaceTypeResponse;
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

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    @Transactional(readOnly = true)
    public List<PublicSportResponse> getAllPublicCatalog() {
        var sports = sportRepository.findAll();
        var courtTypes = courtTypeRepository.findAll();
        var surfaceTypes = surfaceTypeRepository.findAll();

        return sports.stream()
                .map(s -> {
                    List<PublicCourtTypeResponse> ctr = courtTypes.stream()
                            .filter(ct -> ct.getSport().getId().equals(s.getId()))
                            .map(ct -> new PublicCourtTypeResponse(
                                    ct.getId(),
                                    ct.getName()
                            ))
                            .toList();

                    List<PublicSurfaceTypeResponse> str = surfaceTypes.stream()
                            .filter(st -> st.getSport().getId().equals(s.getId()))
                            .map(st -> new PublicSurfaceTypeResponse(
                                    st.getId(),
                                    st.getName()
                            ))
                            .toList();

                    return new PublicSportResponse(
                            s.getId(),
                            s.getName(),
                            s.getIconUrl(),
                            s.getImageUrl(),
                            ctr,
                            str
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PublicSportResponse> getOnlyPublicSportCatalog() {
        return sportRepository.findAll().stream()
                .map(s -> new PublicSportResponse(
                        s.getId(),
                        s.getName(),
                        s.getIconUrl(),
                        s.getImageUrl(),
                        null,
                        null
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public Sport findSportById(Long id) {
        return sportRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public Sport getSportById(Long id) {
        return sportRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public Sport getSportByCode(String code) {
        return sportRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public CourtType findCourtTypeById(Long id) {
        return courtTypeRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public CourtType getCourtTypeById(Long id) {
        return courtTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public CourtType getCourtTypeByCode(String code) {
        return courtTypeRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public CourtType getCourtTypeBySportCodeAndCode(String sportCode, String code) {
        Sport sport = getSportByCode(sportCode);
        return courtTypeRepository.findBySportAndCode(sport, code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public SurfaceType findSurfaceTypeById(Long id) {
        return surfaceTypeRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public SurfaceType getSurfaceTypeById(Long id) {
        return surfaceTypeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public SurfaceType getSurfaceTypeByCode(String code) {
        return surfaceTypeRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

    @Transactional(readOnly = true)
    public SurfaceType getSurfaceTypeBySportCodeAndCode(String sportCode, String code) {
        Sport sport = getSportByCode(sportCode);
        return surfaceTypeRepository.findBySportAndCode(sport, code)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS, null));
    }

}
