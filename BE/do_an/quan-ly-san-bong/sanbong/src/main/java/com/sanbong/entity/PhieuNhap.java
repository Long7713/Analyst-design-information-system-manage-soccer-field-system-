package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "phieu_nhap") @Getter @Setter @NoArgsConstructor
public class PhieuNhap {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maPhieuNhap;
    private LocalDate ngayNhap;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    @ManyToOne @JoinColumn(name = "ma_ncc") private NhaCungCap nhaCungCap;
    private String trangThai = "nhap"; // nhap / cho_xac_nhan / da_xac_nhan / da_huy
    private String ghiChu;
    @OneToMany(mappedBy = "phieuNhap", cascade = CascadeType.ALL)
    private List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
    public long getTongTien() {
        long s = 0;
        for (ChiTietPhieuNhap c : chiTiet) s += c.getThanhTien();
        return s;
    }
    public String getNhanTrangThai() {
        switch (trangThai) {
            case "nhap": return "Nháp";
            case "cho_xac_nhan": return "Chờ xác nhận";
            case "da_xac_nhan": return "Đã xác nhận";
            case "da_huy": return "Đã hủy";
            default: return trangThai;
        }
    }
}
