package com.example.scbbackend.config.data.mock;

import com.example.scbbackend.modules.catalog.service.CatalogService;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.CourtImage;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceList;
import com.example.scbbackend.modules.court.enums.CourtStatus;
import com.example.scbbackend.modules.court.repository.CourtImageRepository;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourtMockData {

    private final CourtRepository courtRepository;
    private final CourtImageRepository courtImageRepository;
    private final CatalogService catalogService;

    private record CourtData(
            int facilityIndex,
            String sportCode,
            String courtTypeCode,
            String surfaceTypeCode,
            String courtName,
            int priceListIndex,
            List<String> imageUrls
    ) {}

    private static final List<CourtData> COURT_DATA = List.of(
            new CourtData(
                    0,
                    "football",
                    "7v7",
                    "artificial_grass",
                    "Sân 7A",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            ),
            new CourtData(
                    0,
                    "football",
                    "7v7",
                    "artificial_grass",
                    "Sân 7B",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            ),
            new CourtData(
                    0,
                    "football",
                    "7v7",
                    "artificial_grass",
                    "Sân 7C",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            ),
            new CourtData(
                    0,
                    "tennis",
                    "singles_doubles",
                    "hard_court",
                    "Sân tennis A",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            ),
            new CourtData(
                    0,
                    "tennis",
                    "singles_doubles",
                    "hard_court",
                    "Sân tennis B",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            ),
            new CourtData(
                    0,
                    "basketball",
                    "5v5",
                    "hard_court",
                    "Sân bóng rổ",
                    1,
                    List.of(
                            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
                            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
                    )
            )
    );

    @Transactional
    public void mock(List<Facility> facilities, List<PriceList> priceLists) {
        if (facilities == null || facilities.isEmpty()) {
            log.info("Court data already exists. Skipping...");
            return;
        }

        List<Court> courts = new ArrayList<>();
        List<CourtImage> courtImages = new ArrayList<>();

        for (CourtData cd : COURT_DATA) {
            Court court = Court.builder()
                    .facility(facilities.get(cd.facilityIndex()))
                    .sport(catalogService.getSportByCode(cd.sportCode()))
                    .courtType(catalogService.getCourtTypeByCode(cd.courtTypeCode()))
                    .surfaceType(catalogService.getSurfaceTypeByCode(cd.surfaceTypeCode()))
                    .name(cd.courtName())
                    .priceList(priceLists.get(cd.priceListIndex()))
                    .status(CourtStatus.ACTIVE)
                    .build();
            courts.add(court);
        }
        courtRepository.saveAll(courts);

        for (int i = 0; i < COURT_DATA.size(); i++) {
            Court court = courts.get(i);
            CourtData cd = COURT_DATA.get(i);

            for (int j = 0; j < cd.imageUrls().size(); j++) {
                courtImages.add(
                        CourtImage.builder()
                                .court(court)
                                .imageUrl(cd.imageUrls().get(j))
                                .displayOrder(j + 1)
                                .build()
                );
            }
        }
        courtImageRepository.saveAll(courtImages);

        log.info("Created {} courts successfully.", courts.size());
    }

}

