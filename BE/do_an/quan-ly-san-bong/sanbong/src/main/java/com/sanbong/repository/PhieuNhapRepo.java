package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhieuNhapRepo extends JpaRepository<PhieuNhap, Integer> {
    List<PhieuNhap> findAllByOrderByMaPhieuNhapDesc();
    List<PhieuNhap> findByNgayNhapBetweenAndTrangThai(LocalDate tu, LocalDate den, String trangThai);
}
