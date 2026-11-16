package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "nhan_vien") @Getter @Setter @NoArgsConstructor
public class NhanVien {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maNv;
    private String hoTen;
    private String soDienThoai;
    private LocalDate ngaySinh;
    private String diaChi;
    private LocalDate ngayVaoLam;
    private Long mucLuongGio = QuyDinh.LUONG_GIO_MAC_DINH;
    private String trangThai = "dang_lam"; // dang_lam / nghi_viec / tam_khoa
}
