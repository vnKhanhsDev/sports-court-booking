package com.example.scbbackend.modules.catalog.service;

import com.example.scbbackend.modules.catalog.dto.response.CourtTypePublicResponse;
import com.example.scbbackend.modules.catalog.dto.response.SportPublicResponse;
import com.example.scbbackend.modules.catalog.dto.response.SurfaceTypePublicResponse;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

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

}
