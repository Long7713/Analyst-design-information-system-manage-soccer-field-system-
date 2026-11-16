package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "ca_lam_viec") @Getter @Setter @NoArgsConstructor
public class CaLamViec {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maCa;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    private LocalDate ngayLam;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc;
    private Long mucLuongGio;

    public double getSoGio() {
        return (QuyDinh.phutKetThuc(gioKetThuc) - QuyDinh.phutBatDau(gioBatDau)) / 60.0;
    }
    public long getTienLuong() { return Math.round(getSoGio() * QuyDinh.nz(mucLuongGio)); }
    public String getBatDauStr() { return QuyDinh.gioBatDauStr(gioBatDau); }
    public String getKetThucStr() { return QuyDinh.gioKetThucStr(gioKetThuc); }
}
