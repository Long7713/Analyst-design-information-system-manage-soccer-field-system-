package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BangGiaRepo extends JpaRepository<BangGia, Integer> {
    List<BangGia> findAllByOrderByLoaiNgayAscGioBatDauAsc();
    List<BangGia> findByKichHoatTrue();
}
