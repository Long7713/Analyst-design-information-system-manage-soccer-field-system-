package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "dat_san") @Getter @Setter @NoArgsConstructor
public class DatSan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maDatSan;
    @ManyToOne @JoinColumn(name = "ma_kh") private KhachHang khachHang;
    @ManyToOne @JoinColumn(name = "ma_san") private SanBong sanBong;
    private LocalDate ngayDat;
    private LocalTime gioBatDau;
    private LocalTime gioKetThuc; // 00:00 = 24:00
    private Long tienSan;
    private Long tienCoc;
    private String trangThai = QuyDinh.CHO_XAC_NHAN;
    @ManyToOne @JoinColumn(name = "ma_nv_tao") private NhanVien nvTao;
    private LocalDateTime thoiGianHuy;
    @ManyToOne @JoinColumn(name = "ma_nv_huy") private NhanVien nvHuy;
    private LocalDateTime thoiGianBoom;
    @ManyToOne @JoinColumn(name = "ma_nv_boom") private NhanVien nvBoom;
    private Long tienCocGiuLai;
    private String ghiChu;
    private LocalDateTime thoiGianTao;

    @OneToMany(mappedBy = "datSan", cascade = CascadeType.ALL)
    @OrderBy("thoiDiemThem ASC")
    private List<ThemGio> dsThemGio = new ArrayList<>();

    // ---- Các giá trị tính từ dữ liệu (không lưu) ----
    public int getSoPhut() { return QuyDinh.phutKetThuc(gioKetThuc) - QuyDinh.phutBatDau(gioBatDau); }
    public String getSoGioStr() {
        double h = getSoPhut() / 60.0;
        return h == Math.floor(h) ? String.valueOf((int) h) : String.valueOf(h).replace('.', ',');
    }
    public long getTongTienThemGio() {
        long s = 0;
        for (ThemGio t : dsThemGio) s += QuyDinh.nz(t.getTienThemGio());
        return s;
    }
    public long getTongTien() { return QuyDinh.nz(tienSan) + getTongTienThemGio(); }
    public long getTienThuTaiSan() { return getTongTien() - QuyDinh.nz(tienCoc); }
    public String getBatDauStr() { return QuyDinh.gioBatDauStr(gioBatDau); }
    public String getKetThucStr() { return QuyDinh.gioKetThucStr(gioKetThuc); }
    public LocalDateTime getBatDauDt() { return ngayDat.atTime(gioBatDau); }
    public LocalDateTime getKetThucDt() {
        return QuyDinh.phutKetThuc(gioKetThuc) >= 1440 ? ngayDat.plusDays(1).atStartOfDay() : ngayDat.atTime(gioKetThuc);
    }
    public boolean isDangChiemSan() {
        return !QuyDinh.DA_HUY.equals(trangThai) && !QuyDinh.KHACH_BOOM.equals(trangThai);
    }
}
