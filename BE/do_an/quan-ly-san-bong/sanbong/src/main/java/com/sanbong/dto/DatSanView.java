package com.sanbong.dto;

import lombok.Getter;
import lombok.Setter;

/** Dữ liệu 1 đơn đặt sân để hiển thị (đã tính màu, cờ cho phép thao tác...). */
@Getter @Setter
public class DatSanView {
    private Integer maDatSan, maSan;
    private String tenSan, tenKh, sdt, ngay, batDau, ketThuc, soGio, trangThai, nhan, css, tenNvTao, ghiChu;
    private long tienSan, tienThemGio, tongTien, tienCoc, tienThu, tienGiuLai;
    private double left, width;
    private boolean quaGio;
    private boolean canXacNhanCoc, canNhanSan, canKetThuc, canThemGio, canDoiGio, canHuy, canBoom, canHoaDon;
    private long soLanBoom;
    private boolean daCoHoaDon;
}
