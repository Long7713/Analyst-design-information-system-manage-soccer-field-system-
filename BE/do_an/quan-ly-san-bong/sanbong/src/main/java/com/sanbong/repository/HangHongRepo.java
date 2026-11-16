package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HangHongRepo extends JpaRepository<HangHong, Integer> {
    List<HangHong> findByThoiGianBetween(LocalDateTime tu, LocalDateTime den);
}
