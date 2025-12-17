package com.example.scbbackend.modules.court.service;

import com.example.scbbackend.modules.booking.service.BookingService;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import com.example.scbbackend.modules.court.dto.response.CourtBasicForOwner;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.court.repository.CourtImageRepository;
import com.example.scbbackend.modules.court.repository.CourtPriceOverrideRepository;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.court.repository.PriceTemplateRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
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
    private final FacilityRepository facilityRepository;
    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;
    private final PriceTemplateRepository priceTemplateRepository;
    private final CourtImageRepository courtImageRepository;
    private final CourtPriceOverrideRepository courtPriceOverrideRepository;
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

    @Transactional(readOnly = true)
    public List<Court> getAllCourtsByPriceTemplate(PriceTemplate priceTemplate) {
        return courtRepository.findByPriceTemplate(priceTemplate);
    }

//    @Transactional
//    public Court createCourt(CreateCourtRequest request, OwnerInfo ownerInfo) {
//        return null;
        // Validate and fetch entities
//        Facility facility = facilityRepository.findById(request.facilityId())
//                .orElseThrow(() -> new AppException(ApiCode.INPUT_INVALID));
//
//        // Verify facility belongs to owner
//        if (!facility.getOwnerInfo().getId().equals(ownerInfo.getId())) {
//            throw new AppException(ApiCode.INPUT_INVALID);
//        }
//
//        Sport sport = sportRepository.findById(request.sportId())
//                .orElseThrow(() -> new AppException(ApiCode.INPUT_INVALID));
//
//        CourtType courtType = courtTypeRepository.findById(request.courtTypeId())
//                .orElseThrow(() -> new AppException(ApiCode.INPUT_INVALID));
//
//        SurfaceType surfaceType = surfaceTypeRepository.findById(request.surfaceTypeId())
//                .orElseThrow(() -> new AppException(ApiCode.INPUT_INVALID));
//
//        // Build court entity
//        Court.CourtBuilder courtBuilder = Court.builder()
//                .facility(facility)
//                .sport(sport)
//                .courtType(courtType)
//                .surfaceType(surfaceType)
//                .name(request.name());
//
//        // Handle price template
//        if (request.priceTemplateId() != null && request.priceTemplateId() > 0) {
//            var priceTemplate = priceTemplateRepository.findByIdAndOwnerInfo(
//                    request.priceTemplateId(), ownerInfo);
//            if (priceTemplate == null) {
//                throw new AppException(ApiCode.PRICE_TEMPLATE_NOT_FOUND);
//            }
////            courtBuilder.priceTemplate(priceTemplate);
//        }
//
//        Court court = courtRepository.save(courtBuilder.build());
//        final Court savedCourt = court;
//
//        // Create price overrides if no template is used
//        if (request.priceTemplateId() == null && request.priceItems() != null && !request.priceItems().isEmpty()) {
//            List<CourtPriceOverride> priceOverrides = request.priceItems().stream()
//                    .map(item -> CourtPriceOverride.builder()
//                            .court(savedCourt)
//                            .startTime(LocalTime.parse(item.startTime()))
//                            .endTime(LocalTime.parse(item.endTime()))
//                            .price(item.price())
//                            .build())
//                    .collect(Collectors.toList());
//            courtPriceOverrideRepository.saveAll(priceOverrides);
//        }
//
//        // Create court images
//        if (request.imageUrls() != null && !request.imageUrls().isEmpty()) {
//            List<CourtImage> images = new ArrayList<>();
//            for (int i = 0; i < request.imageUrls().size(); i++) {
//                images.add(CourtImage.builder()
//                        .court(savedCourt)
//                        .imageUrl(request.imageUrls().get(i))
//                        .displayOrder(i)
//                        .build());
//            }
//            courtImageRepository.saveAll(images);
//        }
//
//        return court;
//    }

}
