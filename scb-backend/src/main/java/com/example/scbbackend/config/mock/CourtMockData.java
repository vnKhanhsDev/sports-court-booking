package com.example.scbbackend.config.mock;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import com.example.scbbackend.modules.court.entity.Court;
import com.example.scbbackend.modules.court.entity.Facility;
import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.court.entity.PriceTemplateItem;
import com.example.scbbackend.modules.court.repository.CourtRepository;
import com.example.scbbackend.modules.court.repository.FacilityRepository;
import com.example.scbbackend.modules.court.repository.PriceTemplateItemRepository;
import com.example.scbbackend.modules.court.repository.PriceTemplateRepository;
import com.example.scbbackend.modules.user.entity.OwnerInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourtMockData {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    private final FacilityRepository facilityRepository;
    private final PriceTemplateRepository priceTemplateRepository;
    private final PriceTemplateItemRepository priceTemplateItemRepository;
    private final CourtRepository courtRepository;

    private record FacilityData(
            String name,
            LocalTime openingTime,
            LocalTime closingTime
    ) {}

    private static final List<FacilityData> FACILITY_DATA = List.of(
            new FacilityData("Sân Đầm Hồng", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Tsunami", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Pickfit", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Văn Phú X7", LocalTime.parse("06:00"), LocalTime.parse("23:00")),
            new FacilityData("Sân Đại học Phenikaa", LocalTime.parse("06:00"), LocalTime.parse("23:00"))
    );

    private record PriceTemplateData(
            String name,
            int version,
            List<Integer> itemIndexs
    ) {}

    private static final List<PriceTemplateData> PRICE_TEMPLATE_DATA = List.of(
            new PriceTemplateData("Bảng giá chung", 1, List.of(0, 4, 8)),
            new PriceTemplateData("Bảng giá Pickfit", 1, List.of(1, 3, 6)),
            new PriceTemplateData("Bảng giá sân bóng_7_nhân tạo", 1, List.of(0, 5, 7)),
            new PriceTemplateData("Bảng giá Phenikaa_sân bóng_11_nhân tạo", 1, List.of(2, 3, 8))
    );

    private record PriceTemplateItemData(
            LocalTime startTime,
            LocalTime endTime,
            BigDecimal price
    ) {}

    private static final List<PriceTemplateItemData> PRICE_TEMPLATE_ITEM_DATA = List.of(
            new PriceTemplateItemData(LocalTime.parse("06:00"), LocalTime.parse("13:00"), BigDecimal.valueOf(200_000)),
            new PriceTemplateItemData(LocalTime.parse("06:00"), LocalTime.parse("13:00"), BigDecimal.valueOf(230_000)),
            new PriceTemplateItemData(LocalTime.parse("06:00"), LocalTime.parse("13:00"), BigDecimal.valueOf(300_000)),
            new PriceTemplateItemData(LocalTime.parse("13:00"), LocalTime.parse("18:00"), BigDecimal.valueOf(250_000)),
            new PriceTemplateItemData(LocalTime.parse("13:00"), LocalTime.parse("18:00"), BigDecimal.valueOf(300_000)),
            new PriceTemplateItemData(LocalTime.parse("13:00"), LocalTime.parse("18:00"), BigDecimal.valueOf(350_000)),
            new PriceTemplateItemData(LocalTime.parse("18:00"), LocalTime.parse("23:00"), BigDecimal.valueOf(350_000)),
            new PriceTemplateItemData(LocalTime.parse("18:00"), LocalTime.parse("23:00"), BigDecimal.valueOf(400_000)),
            new PriceTemplateItemData(LocalTime.parse("18:00"), LocalTime.parse("23:00"), BigDecimal.valueOf(450_000))
    );

    private record CourtData(
            int facilityIndex,
            int sportIndex,
            int courtTypeIndex,
            int surfaceTypeIndex,
            int priceTemplateIndex,
            String name
    ) {}

    private static final List<CourtData> COURT_DATA = List.of(
            new CourtData(0, 0, 1, 1, 0, "Sân 7A"),
            new CourtData(0, 0, 1, 1, 0, "Sân 7B"),
            new CourtData(0, 0, 1, 1, 0, "Sân 7C"),
            new CourtData(0, 0, 1, 1, 0, "Sân 7D"),
            new CourtData(0, 0, 1, 1, 0, "Sân 7E")
    );

    public void mockData(OwnerInfo owner) {
        List<Facility> facilities = createFacilities(owner);

        List<PriceTemplate> priceTemplates = createPriceTemplates(owner);

        List<Sport> sports = sportRepository.findAll();
        
        // Fetch all court types and surface types to avoid lazy loading issues
        List<CourtType> allCourtTypes = courtTypeRepository.findAll();
        List<SurfaceType> allSurfaceTypes = surfaceTypeRepository.findAll();

        createCourts(facilities, sports, priceTemplates, allCourtTypes, allSurfaceTypes);
    }

    /*****************************
     *      CREATE FACILITY      *
     *****************************/
    private List<Facility> createFacilities(OwnerInfo owner) {
        List<Facility> facilities = FACILITY_DATA.stream()
                .map(item -> Facility.builder()
                        .ownerInfo(owner)
                        .name(item.name)
                        .openingTime(item.openingTime)
                        .closingTime(item.closingTime)
                        .build()
                ).toList();

        return facilityRepository.saveAll(facilities);
    }

    /***********************************
     *      CREATE PRICE TEMPLATE      *
     ***********************************/
    private List<PriceTemplate> createPriceTemplates(OwnerInfo owner) {
        return PRICE_TEMPLATE_DATA.stream()
                .map(template -> {
                    // Save the PriceTemplate itself
                    PriceTemplate templateSaved = priceTemplateRepository.save(
                            PriceTemplate.builder()
                                    .ownerInfo(owner)
                                    .name(template.name)
                                    .version(template.version)
                                    .build()
                    );

                    // Create PriceTemplateItems and associate with PriceTemplate
                    template.itemIndexs.forEach(index -> {
                        PriceTemplateItemData itemData = PRICE_TEMPLATE_ITEM_DATA.get(index);

                        // Create PriceTemplateItem entity
                        PriceTemplateItem priceTemplateItem = PriceTemplateItem.builder()
                                .startTime(itemData.startTime)
                                .endTime(itemData.endTime)
                                .price(itemData.price)
                                .priceTemplate(templateSaved)  // associate with PriceTemplate
                                .build();

                        // Save the PriceTemplateItem
                        priceTemplateItemRepository.save(priceTemplateItem);
                    });

                    return templateSaved;
                }).toList();
    }

    /**************************
     *      CREATE COURT      *
     **************************/
    /**
     * Creates courts based on COURT_DATA.
     * 
     * How to specify sport, court type, and surface type:
     * 
     * Sport Index (sportIndex):
     *   0 = "Bóng đá" (Football)
     *   1 = "Cầu lông" (Badminton)
     *   2 = "Pickleball"
     * 
     * Court Type Index (courtTypeIndex) - within the selected sport:
     *   For "Bóng đá" (index 0):
     *     0 = "Sân 5"
     *     1 = "Sân 7"
     *     2 = "Sân 9"
     *     3 = "Sân 11"
     *   For "Cầu lông" (index 1):
     *     0 = "Sân đơn/đôi"
     *   For "Pickleball" (index 2):
     *     0 = "Sân đơn/dôi"
     * 
     * Surface Type Index (surfaceTypeIndex) - within the selected sport:
     *   For "Bóng đá" (index 0):
     *     0 = "Cỏ tự nhiên"
     *     1 = "Cỏ nhân tạo"
     *   For "Cầu lông" (index 1):
     *     0 = "Thảm PVC"
     *     1 = "Gỗ"
     *   For "Pickleball" (index 2):
     *     0 = "Acrylic"
     *     1 = "Gỗ"
     * 
     * Example: To create a "Bóng đá" court with "Sân 7" and "Cỏ nhân tạo":
     *   new CourtData(0, 0, 1, 1, 0, "Sân 7A")
     *   - facilityIndex: 0 (first facility)
     *   - sportIndex: 0 ("Bóng đá")
     *   - courtTypeIndex: 1 ("Sân 7")
     *   - surfaceTypeIndex: 1 ("Cỏ nhân tạo")
     *   - priceTemplateIndex: 0 (first price template)
     *   - name: "Sân 7A"
     */
    private void createCourts(
            List<Facility> facilities, 
            List<Sport> sports, 
            List<PriceTemplate> priceTemplates,
            List<CourtType> allCourtTypes,
            List<SurfaceType> allSurfaceTypes
    ) {
        List<Court> courts = COURT_DATA.stream().map(dataRow -> {
            Sport sport = sports.get(dataRow.sportIndex);
            
            // Filter court types and surface types for this sport, then sort by ID
            List<CourtType> courtTypes = allCourtTypes.stream()
                    .filter(courtType -> courtType.getSport().getId().equals(sport.getId()))
                    .sorted((a, b) -> Long.compare(a.getId(), b.getId())) // Sort by ID for consistent ordering
                    .toList();
            List<SurfaceType> surfaceTypes = allSurfaceTypes.stream()
                    .filter(surfaceType -> surfaceType.getSport().getId().equals(sport.getId()))
                    .sorted((a, b) -> Long.compare(a.getId(), b.getId())) // Sort by ID for consistent ordering
                    .toList();
            
            // Validate indices
            if (dataRow.courtTypeIndex >= courtTypes.size()) {
                throw new IndexOutOfBoundsException(
                    String.format("CourtType index %d out of bounds for sport '%s' (available: %d)", 
                        dataRow.courtTypeIndex, sport.getName(), courtTypes.size())
                );
            }
            if (dataRow.surfaceTypeIndex >= surfaceTypes.size()) {
                throw new IndexOutOfBoundsException(
                    String.format("SurfaceType index %d out of bounds for sport '%s' (available: %d)", 
                        dataRow.surfaceTypeIndex, sport.getName(), surfaceTypes.size())
                );
            }
            
            CourtType courtType = courtTypes.get(dataRow.courtTypeIndex);
            SurfaceType surfaceType = surfaceTypes.get(dataRow.surfaceTypeIndex);

            return Court.builder()
                    .facility(facilities.get(dataRow.facilityIndex))
                    .sport(sport)
                    .courtType(courtType)
                    .surfaceType(surfaceType)
                    .priceTemplate(priceTemplates.get(dataRow.priceTemplateIndex))
                    .name(dataRow.name)
                    .build();
        }).toList();

        courtRepository.saveAll(courts);
    }

}
