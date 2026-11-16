package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "hang_hong") @Getter @Setter @NoArgsConstructor
public class HangHong {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maHangHong;
    @ManyToOne @JoinColumn(name = "ma_san_pham") private SanPham sanPham;
    private Integer soLuong;
    private String lyDo;
    private LocalDateTime thoiGian;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
}
