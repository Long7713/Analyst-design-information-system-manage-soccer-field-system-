package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "tai_khoan") @Getter @Setter @NoArgsConstructor
public class TaiKhoan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maTk;
    @OneToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    private String tenDangNhap;
    private String matKhau;
    private String vaiTro = "NHAN_VIEN"; // QUAN_LY / NHAN_VIEN
    private String trangThai = "hoat_dong"; // hoat_dong / tam_khoa
}
