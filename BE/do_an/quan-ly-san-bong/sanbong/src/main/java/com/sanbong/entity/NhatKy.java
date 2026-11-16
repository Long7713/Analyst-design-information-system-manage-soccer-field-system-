package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "nhat_ky") @Getter @Setter @NoArgsConstructor
public class NhatKy {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maNhatKy;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    private String thaoTac;
    private String doiTuong;
    private String noiDung;
    private LocalDateTime thoiGian;
}
