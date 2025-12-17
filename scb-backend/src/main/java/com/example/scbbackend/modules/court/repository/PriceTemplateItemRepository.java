package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceTemplate;
import com.example.scbbackend.modules.court.entity.PriceTemplateItem;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceTemplateItemRepository extends JpaRepository<@NonNull PriceTemplateItem, @NonNull Long> {

    List<PriceTemplateItem> findByPriceTemplate(PriceTemplate priceTemplate);

}
