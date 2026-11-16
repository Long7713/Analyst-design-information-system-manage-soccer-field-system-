package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KhachHangRepo extends JpaRepository<KhachHang, Integer> {
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);
    List<KhachHang> findByTenKhContainingIgnoreCaseOrSoDienThoaiContaining(String ten, String sdt);
}
