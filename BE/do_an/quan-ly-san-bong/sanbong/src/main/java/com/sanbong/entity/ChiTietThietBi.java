package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "chi_tiet_thiet_bi") @Getter @Setter @NoArgsConstructor
public class ChiTietThietBi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maCtTb;
    @ManyToOne @JoinColumn(name = "ma_thiet_bi") private ThietBi thietBi;
    private String tenChiTiet;
    @ManyToOne @JoinColumn(name = "ma_san") private SanBong sanBong;
    private String tinhTrang = "dang_dung";
    private String ghiChu;
}
