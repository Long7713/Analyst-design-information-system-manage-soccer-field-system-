package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SanPhamRepo extends JpaRepository<SanPham, Integer> {
    List<SanPham> findAllByOrderByLoaiSanPhamAscTenSanPhamAsc();
    List<SanPham> findByTrangThaiKinhDoanhNotOrderByLoaiSanPhamAscTenSanPhamAsc(String trangThai);
}
