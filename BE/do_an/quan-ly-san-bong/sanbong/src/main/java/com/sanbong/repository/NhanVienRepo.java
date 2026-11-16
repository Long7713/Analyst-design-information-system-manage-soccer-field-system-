package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhanVienRepo extends JpaRepository<NhanVien, Integer> {
    List<NhanVien> findByTrangThai(String trangThai);
}
