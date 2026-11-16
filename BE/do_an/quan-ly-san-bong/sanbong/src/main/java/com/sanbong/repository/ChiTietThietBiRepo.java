package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChiTietThietBiRepo extends JpaRepository<ChiTietThietBi, Integer> {
    List<ChiTietThietBi> findByThietBi_MaThietBiOrderByTenChiTietAsc(Integer maThietBi);
}
