package com.sanbong.dto;

import com.sanbong.entity.KhachHang;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class KhachThongKe {
    private KhachHang khach;
    private int soLanDat, soLanDa, soLanHuy, soLanBoom;
    private double tongGio;
    private long tongChi;
    private LocalDate ngayGanNhat;
    public String getTongGioStr() {
        return tongGio == Math.floor(tongGio) ? String.valueOf((int) tongGio) : String.valueOf(tongGio).replace('.', ',');
    }
}
