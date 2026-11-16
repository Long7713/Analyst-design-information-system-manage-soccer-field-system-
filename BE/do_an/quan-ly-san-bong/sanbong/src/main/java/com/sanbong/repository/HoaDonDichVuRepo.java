package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoaDonDichVuRepo extends JpaRepository<HoaDonDichVu, Integer> {
    List<HoaDonDichVu> findByThoiGianBetweenOrderByThoiGianDesc(LocalDateTime tu, LocalDateTime den);
}
