package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HoaDonDatSanRepo extends JpaRepository<HoaDonDatSan, Integer> {
    Optional<HoaDonDatSan> findByDatSan_MaDatSan(Integer maDatSan);
    List<HoaDonDatSan> findByNgayLapBetween(LocalDate tu, LocalDate den);
}
