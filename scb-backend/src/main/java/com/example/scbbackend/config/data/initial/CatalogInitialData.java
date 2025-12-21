package com.example.scbbackend.config.data.initial;

import com.example.scbbackend.modules.catalog.entity.CourtType;
import com.example.scbbackend.modules.catalog.entity.Sport;
import com.example.scbbackend.modules.catalog.entity.SurfaceType;
import com.example.scbbackend.modules.catalog.repository.CourtTypeRepository;
import com.example.scbbackend.modules.catalog.repository.SportRepository;
import com.example.scbbackend.modules.catalog.repository.SurfaceTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogInitialData {

    private final SportRepository sportRepository;
    private final CourtTypeRepository courtTypeRepository;
    private final SurfaceTypeRepository surfaceTypeRepository;

    @Transactional
    public void initialize() {
        if (sportRepository.count() > 0) {
            log.info("Catalog already exists. Skipping...");
            return;
        }

        log.info("Initializing catalog data...");

        // Define all sports data
        List<SportData> sportsData = List.of(
                new SportData("Bóng đá", "football",
                        List.of(
                                new CourtTypeData("Sân 5", "5v5", "Sân bóng đá 5 người, phù hợp cho các trận đấu nhỏ và tập luyện"),
                                new CourtTypeData("Sân 7", "7v7", "Sân bóng đá 7 người, kích thước trung bình phổ biến"),
                                new CourtTypeData("Sân 9", "9v9", "Sân bóng đá 9 người, kích thước lớn hơn sân 7"),
                                new CourtTypeData("Sân 11", "11v11", "Sân bóng đá tiêu chuẩn 11 người, kích thước đầy đủ")
                        ),
                        List.of(
                                new SurfaceTypeData("Cỏ tự nhiên", "natural_grass", "Mặt sân cỏ tự nhiên, mềm mại và tự nhiên"),
                                new SurfaceTypeData("Cỏ nhân tạo", "artificial_grass", "Mặt sân cỏ nhân tạo, bền và dễ bảo trì")
                        )
                ),
                new SportData("Tennis", "tennis",
                        List.of(
                                new CourtTypeData("Sân đơn/đôi", "singles_doubles", "Sân tennis có thể chơi cả đơn và đôi")
                        ),
                        List.of(
                                new SurfaceTypeData("Sân cứng", "hard_court", "Mặt sân cứng làm bằng bê tông hoặc acrylic"),
                                new SurfaceTypeData("Sân đất nện", "clay_court", "Mặt sân đất nện, tốc độ chậm hơn"),
                                new SurfaceTypeData("Sân cỏ", "grass_court", "Mặt sân cỏ tự nhiên, tốc độ nhanh"),
                                new SurfaceTypeData("Sân thảm", "carpet_court", "Mặt sân thảm nhân tạo")
                        )
                ),
                new SportData("Bóng rổ", "basketball",
                        List.of(
                                new CourtTypeData("Sân 5 người", "5v5", "Sân bóng rổ tiêu chuẩn 5 người mỗi đội"),
                                new CourtTypeData("Sân 3 người", "3v3", "Sân bóng rổ 3x3, kích thước nhỏ hơn")
                        ),
                        List.of(
                                new SurfaceTypeData("Sân cứng", "hard_court", "Mặt sân cứng làm bằng bê tông hoặc gỗ"),
                                new SurfaceTypeData("Sân gỗ", "wooden_court", "Mặt sân gỗ chuyên nghiệp"),
                                new SurfaceTypeData("Sân nhựa", "rubber_court", "Mặt sân nhựa cao su, an toàn và đàn hồi")
                        )
                ),
                new SportData("Cầu lông", "badminton",
                        List.of(
                                new CourtTypeData("Sân đơn/đôi", "singles_doubles", "Sân cầu lông có thể chơi cả đơn và đôi")
                        ),
                        List.of(
                                new SurfaceTypeData("Thảm PVC", "pvc_mat", "Mặt sân thảm PVC, chống trượt và dễ vệ sinh"),
                                new SurfaceTypeData("Gỗ", "wooden", "Mặt sân gỗ tự nhiên, chuyên nghiệp"),
                                new SurfaceTypeData("Nhựa", "plastic", "Mặt sân nhựa, bền và dễ bảo trì")
                        )
                ),
                new SportData("Pickleball", "pickleball",
                        List.of(
                                new CourtTypeData("Sân đơn/đôi", "singles_doubles", "Sân pickleball có thể chơi cả đơn và đôi")
                        ),
                        List.of(
                                new SurfaceTypeData("Acrylic", "acrylic", "Mặt sân acrylic, bền và chống trượt"),
                                new SurfaceTypeData("Gỗ", "wooden", "Mặt sân gỗ tự nhiên"),
                                new SurfaceTypeData("Nhựa", "plastic", "Mặt sân nhựa composite")
                        )
                ),
                new SportData("Bóng chuyền", "volleyball",
                        List.of(
                                new CourtTypeData("Sân 6 người", "6v6", "Sân bóng chuyền tiêu chuẩn 6 người mỗi đội"),
                                new CourtTypeData("Sân bãi biển", "beach", "Sân bóng chuyền bãi biển 2 người mỗi đội")
                        ),
                        List.of(
                                new SurfaceTypeData("Sân cứng", "hard_court", "Mặt sân cứng trong nhà"),
                                new SurfaceTypeData("Cát", "sand", "Mặt sân cát cho bóng chuyền bãi biển"),
                                new SurfaceTypeData("Nhựa", "rubber", "Mặt sân nhựa cao su")
                        )
                ),
                new SportData("Bóng bàn", "table_tennis",
                        List.of(
                                new CourtTypeData("Bàn đơn/đôi", "singles_doubles", "Bàn bóng bàn có thể chơi cả đơn và đôi")
                        ),
                        List.of(
                                new SurfaceTypeData("Bàn tiêu chuẩn", "standard_table", "Bàn bóng bàn tiêu chuẩn ITTF"),
                                new SurfaceTypeData("Bàn ngoài trời", "outdoor_table", "Bàn bóng bàn ngoài trời chống nước")
                        )
                )
        );

        // Step 1: Create all sports in a single batch
        List<Sport> sports = sportsData.stream()
                .map(sd -> Sport.builder()
                        .name(sd.name())
                        .code(sd.code())
                        .build())
                .toList();
        List<Sport> savedSports = sportRepository.saveAll(sports);
        log.debug("Saved {} sports", savedSports.size());

        // Step 2: Collect all court types and surface types
        List<CourtType> allCourtTypes = new ArrayList<>();
        List<SurfaceType> allSurfaceTypes = new ArrayList<>();

        for (int i = 0; i < sportsData.size(); i++) {
            SportData sd = sportsData.get(i);
            Sport sport = savedSports.get(i);

            // Build court types for this sport
            for (CourtTypeData ctd : sd.courtTypes()) {
                allCourtTypes.add(CourtType.builder()
                        .sport(sport)
                        .name(ctd.name())
                        .code(ctd.code())
                        .description(ctd.description())
                        .build());
            }

            // Build surface types for this sport
            for (SurfaceTypeData std : sd.surfaceTypes()) {
                allSurfaceTypes.add(SurfaceType.builder()
                        .sport(sport)
                        .name(std.name())
                        .code(std.code())
                        .description(std.description())
                        .build());
            }
        }

        // Step 4: Save all court types and surface types in single batches
        courtTypeRepository.saveAll(allCourtTypes);
        log.debug("Saved {} court types", allCourtTypes.size());

        surfaceTypeRepository.saveAll(allSurfaceTypes);
        log.debug("Saved {} surface types", allSurfaceTypes.size());

        log.info("Catalog initialization completed successfully. Created {} sports, {} court types, {} surface types",
                savedSports.size(), allCourtTypes.size(), allSurfaceTypes.size());
    }

    private record SportData(
            String name,
            String code,
            List<CourtTypeData> courtTypes,
            List<SurfaceTypeData> surfaceTypes
    ) {}

    private record CourtTypeData(String name, String code, String description) {}

    private record SurfaceTypeData(String name, String code, String description) {}

}
