package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhieuBaoTriRepo extends JpaRepository<PhieuBaoTri, Integer> {
    List<PhieuBaoTri> findAllByOrderByMaBaoTriDesc();
}
