package com.sanbong.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class DongDoanhThu {
    private String nhan;
    private long san;      // tiền sân + thêm giờ
    private long cocGiuLai;// cọc giữ lại (hủy/boom)
    private long dichVu;
    public long getDoanhThuSan() { return san + cocGiuLai; }
    public long getTong() { return san + cocGiuLai + dichVu; }
}
