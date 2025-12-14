package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.modules.booking.service.BookingService;
import com.example.scbbackend.modules.court.dto.response.CourtBasicForOwner;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    
    private final BookingService bookingService;

    @Transactional(readOnly = true)
    public List<CourtBasicForOwner> getCourtBasicForOwnerByFacility(Facility facility) {
        List<Court> courts = courtRepository.findByFacility(facility);
        
        if (courts.isEmpty()) return new ArrayList<>();
        
        return courts.stream()
                .map(court -> CourtBasicForOwner.builder()
                        .id(court.getId())
                        .facilityName(facility.getName())
                        .sportName(court.getSport().getName())
                        .courtTypeName(court.getCourtType().getName())
                        .name(court.getName())
                        .status(court.getStatus())
                        .isBooked(bookingService.isCourtBooked(court))
                        .build()
                ).collect(Collectors.toList());
    }

}
