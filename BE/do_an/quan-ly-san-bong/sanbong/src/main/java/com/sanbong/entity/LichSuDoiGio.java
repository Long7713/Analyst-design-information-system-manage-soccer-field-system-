package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "lich_su_doi_gio") @Getter @Setter @NoArgsConstructor
public class LichSuDoiGio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maDoi;
    @ManyToOne @JoinColumn(name = "ma_dat_san") private DatSan datSan;
    private LocalTime batDauCu;
    private LocalTime ketThucCu;
    private LocalTime batDauMoi;
    private LocalTime ketThucMoi;
    private Long tienSanCu;
    private Long tienSanMoi;
    private LocalDateTime thoiDiemDoi;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    public String getCuStr() { return QuyDinh.gioBatDauStr(batDauCu) + " → " + QuyDinh.gioKetThucStr(ketThucCu); }
    public String getMoiStr() { return QuyDinh.gioBatDauStr(batDauMoi) + " → " + QuyDinh.gioKetThucStr(ketThucMoi); }
}
