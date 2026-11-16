package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "khach_hang") @Getter @Setter @NoArgsConstructor
public class KhachHang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maKh;
    private String tenKh;
    private String soDienThoai;
    private String ghiChu;
}
