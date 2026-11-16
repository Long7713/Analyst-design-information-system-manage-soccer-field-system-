package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "phieu_bao_tri") @Getter @Setter @NoArgsConstructor
public class PhieuBaoTri {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maBaoTri;
    @ManyToOne @JoinColumn(name = "ma_thiet_bi") private ThietBi thietBi;
    private Integer soLuong;
    private LocalDate ngayBatDauSua;
    private String noiDungSuaChua;
    private Long chiPhi = 0L;
    private LocalDate ngayHoanThanh;
    private String trangThai = "dang_sua"; // dang_sua / da_hoan_thanh
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
}
