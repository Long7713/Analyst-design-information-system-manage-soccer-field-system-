package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "them_gio") @Getter @Setter @NoArgsConstructor
public class ThemGio {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maThemGio;
    @ManyToOne @JoinColumn(name = "ma_dat_san") private DatSan datSan;
    private LocalTime gioKetThucMoi;
    private Integer soPhutThem;
    private Long tienThemGio;
    private LocalDateTime thoiDiemThem;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    public String getKetThucMoiStr() { return QuyDinh.gioKetThucStr(gioKetThucMoi); }
}
