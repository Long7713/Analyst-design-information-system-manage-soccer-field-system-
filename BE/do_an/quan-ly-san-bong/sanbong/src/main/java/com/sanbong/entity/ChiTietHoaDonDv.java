package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "chi_tiet_hoa_don_dv") @Getter @Setter @NoArgsConstructor
public class ChiTietHoaDonDv {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maCt;
    @ManyToOne @JoinColumn(name = "ma_hd_dv") private HoaDonDichVu hoaDon;
    @ManyToOne @JoinColumn(name = "ma_san_pham") private SanPham sanPham;
    private Integer soLuong;
    private Long donGia;
    public long getThanhTien() { return soLuong * QuyDinh.nz(donGia); }
}
