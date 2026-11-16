package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "bang_gia") @Getter @Setter @NoArgsConstructor
public class BangGia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maBangGia;
    private String loaiNgay; // ngay_thuong / cuoi_tuan
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc; // 00:00 = 24:00
    private Long giaMoiGio;
    private LocalDate apDungTu;
    private LocalDate apDungDen;
    private Boolean kichHoat = true;
    public String getBatDauStr() { return QuyDinh.gioBatDauStr(gioBatDau); }
    public String getKetThucStr() { return QuyDinh.gioKetThucStr(gioKetThuc); }
}
