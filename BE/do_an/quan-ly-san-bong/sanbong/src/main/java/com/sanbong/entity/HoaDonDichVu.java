package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "hoa_don_dich_vu") @Getter @Setter @NoArgsConstructor
public class HoaDonDichVu {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Integer maHdDv;
    private LocalDateTime thoiGian;
    @ManyToOne @JoinColumn(name = "ma_nv") private NhanVien nhanVien;
    private Long tongTien;
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL)
    private List<ChiTietHoaDonDv> chiTiet = new ArrayList<>();
}
