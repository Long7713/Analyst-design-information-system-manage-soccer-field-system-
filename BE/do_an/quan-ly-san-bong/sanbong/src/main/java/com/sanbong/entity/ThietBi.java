package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "thiet_bi") @Getter @Setter @NoArgsConstructor
public class ThietBi {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maThietBi;
    private String tenThietBi;
    private String loaiThietBi;
    private Integer soLuong = 0;
    private Integer slDangDung = 0;
    private Integer slTrongKho = 0;
    private Integer slHong = 0;
    private Integer slDangSua = 0;
    private Integer slThanhLy = 0;
    private LocalDate ngayNhap;
    private String ghiChu;

    public int lay(String tinhTrang) {
        switch (tinhTrang) {
            case "dang_dung": return slDangDung;
            case "trong_kho": return slTrongKho;
            case "hong": return slHong;
            case "dang_sua": return slDangSua;
            case "thanh_ly": return slThanhLy;
            default: throw new IllegalArgumentException("Tình trạng không hợp lệ: " + tinhTrang);
        }
    }
    public void dat(String tinhTrang, int v) {
        switch (tinhTrang) {
            case "dang_dung": slDangDung = v; break;
            case "trong_kho": slTrongKho = v; break;
            case "hong": slHong = v; break;
            case "dang_sua": slDangSua = v; break;
            case "thanh_ly": slThanhLy = v; break;
            default: throw new IllegalArgumentException("Tình trạng không hợp lệ: " + tinhTrang);
        }
        tinhLaiTong();
    }
    public void tinhLaiTong() { soLuong = slDangDung + slTrongKho + slHong + slDangSua + slThanhLy; }
}
