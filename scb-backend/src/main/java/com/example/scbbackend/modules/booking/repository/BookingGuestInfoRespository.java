package com.example.scbbackend.modules.booking.repository;

import com.example.scbbackend.modules.booking.entity.BookingGuestInfo;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookingGuestInfoRespository extends JpaRepository<@NonNull BookingGuestInfo, @NonNull UUID> {
}
