package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "chi_tiet_phieu_nhap") @Getter @Setter @NoArgsConstructor
public class ChiTietPhieuNhap {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maChiTiet;
    @ManyToOne @JoinColumn(name = "ma_phieu_nhap") private PhieuNhap phieuNhap;
    @ManyToOne @JoinColumn(name = "ma_san_pham") private SanPham sanPham;
    @ManyToOne @JoinColumn(name = "ma_thiet_bi") private ThietBi thietBi;
    private Integer soLuong;
    private Long donGia;
    public long getThanhTien() { return soLuong * QuyDinh.nz(donGia); }
    public String getTenHang() {
        return sanPham != null ? sanPham.getTenSanPham() + " (sản phẩm)" : thietBi.getTenThietBi() + " (thiết bị)";
    }
}
