package com.sanbong.repository;

import com.sanbong.entity.*;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SanBongRepo extends JpaRepository<SanBong, Integer> {
    List<SanBong> findAllByOrderByMaSanAsc();
}
