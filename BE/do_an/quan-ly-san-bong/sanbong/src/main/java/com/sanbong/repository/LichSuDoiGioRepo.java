package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LichSuDoiGioRepo extends JpaRepository<LichSuDoiGio, Integer> {
    List<LichSuDoiGio> findByDatSan_MaDatSanOrderByThoiDiemDoiDesc(Integer maDatSan);
}
