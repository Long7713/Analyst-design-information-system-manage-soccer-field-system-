package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DatSanRepo extends JpaRepository<DatSan, Integer> {
    List<DatSan> findByNgayDat(LocalDate ngay);
    List<DatSan> findByNgayDatBetween(LocalDate tu, LocalDate den);
    List<DatSan> findBySanBong_MaSanAndNgayDat(Integer maSan, LocalDate ngay);
    List<DatSan> findByKhachHang_MaKh(Integer maKh);
    long countByKhachHang_MaKhAndTrangThai(Integer maKh, String trangThai);
}
