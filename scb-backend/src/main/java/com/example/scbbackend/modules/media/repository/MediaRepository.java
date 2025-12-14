package com.example.scbbackend.modules.media.repository;

import com.example.scbbackend.modules.media.entity.Media;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MediaRepository extends JpaRepository<@NonNull Media, @NonNull Long> {
}
