package com.example.scbbackend.modules.court.repository;

import com.example.scbbackend.modules.court.entity.PriceTemplateItem;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PriceTemplateItemRepository extends JpaRepository<@NonNull PriceTemplateItem, @NonNull Long> {
}
