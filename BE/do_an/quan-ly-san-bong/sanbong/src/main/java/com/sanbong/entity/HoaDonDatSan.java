package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "hoa_don_dat_san") @Getter @Setter @NoArgsConstructor
public class HoaDonDatSan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maHoaDon;
    @OneToOne @JoinColumn(name = "ma_dat_san") private DatSan datSan;
    private LocalDate ngayLap;
    @ManyToOne @JoinColumn(name = "ma_nv_lap") private NhanVien nvLap;
    private String ghiChu;
}
