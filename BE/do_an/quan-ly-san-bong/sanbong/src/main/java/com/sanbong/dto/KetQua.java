package com.sanbong.dto;

/** Kết quả kiểm tra (trả JSON cho giao diện): ok=true -> xanh, ok=false -> đỏ. */
public record KetQua(boolean ok, String message, long tienSan, long tienCoc, int phutToiDa) {
    public static KetQua loi(String m) { return new KetQua(false, m, 0, 0, 0); }
}
