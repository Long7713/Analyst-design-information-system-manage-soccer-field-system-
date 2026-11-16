package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaLamViecRepo extends JpaRepository<CaLamViec, Integer> {
    List<CaLamViec> findByNgayLamBetweenOrderByNgayLamAscGioBatDauAsc(LocalDate tu, LocalDate den);
}
