package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "nha_cung_cap") @Getter @Setter @NoArgsConstructor
public class NhaCungCap {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maNcc;
    private String tenNcc;
    private String soDienThoai;
    private String diaChi;
    private String email;
    private String nguoiLienHe;
    private String ghiChu;
}
