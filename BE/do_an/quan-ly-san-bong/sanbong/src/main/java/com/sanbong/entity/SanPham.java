package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "san_pham") @Getter @Setter @NoArgsConstructor
public class SanPham {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maSanPham;
    private String tenSanPham;
    private String loaiSanPham;
    private String donViTinh = "cái";
    private Long giaBan = 0L;
    private Integer soLuongTon = 0;
    private Integer mucTonToiThieu = 5;
    private String trangThaiKinhDoanh = "dang_ban"; // dang_ban / ngung_ban / het_hang
    private String ghiChu;
    public boolean isSapHet() { return soLuongTon != null && soLuongTon > 0 && soLuongTon <= mucTonToiThieu; }
    public boolean isHetHang() { return soLuongTon == null || soLuongTon <= 0; }
}
