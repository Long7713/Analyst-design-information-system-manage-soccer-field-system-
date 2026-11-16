package com.sanbong.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;
import lombok.*;
import com.sanbong.util.QuyDinh;

@Entity @Table(name = "san_bong") @Getter @Setter @NoArgsConstructor
public class SanBong {
    @Id private Integer maSan;
    private String trangThai = "hoat_dong"; // hoat_dong / ngung_hoat_dong
    private String ghiChu;
    public String getTen() { return String.format("Sân %02d", maSan); }
}
