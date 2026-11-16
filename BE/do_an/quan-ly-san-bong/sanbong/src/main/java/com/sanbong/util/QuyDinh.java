package com.sanbong.util;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/** Hằng số quy định nghiệp vụ + hàm tiện ích về giờ / tiền. */
public final class QuyDinh {
    private QuyDinh() {}

    // ---- Trạng thái đơn đặt sân ----
    public static final String CHO_XAC_NHAN = "cho_xac_nhan";
    public static final String DA_XAC_NHAN = "da_xac_nhan";
    public static final String DANG_DA = "dang_da";
    public static final String DA_DA_XONG = "da_da_xong";
    public static final String DA_HUY = "da_huy";
    public static final String KHACH_BOOM = "khach_boom";

    // ---- Quy định ----
    public static final int PHUT_MO_CUA = 7 * 60;      // 07:00
    public static final int PHUT_DONG_CUA = 24 * 60;   // 24:00
    public static final int TY_LE_COC = 40;            // % tiền cọc mặc định
    public static final int TY_LE_GIU_COC_HUY_SOM = 60;// hủy >= 3h: giữ 60% cọc, hoàn 40%
    public static final int GIO_HUY_SOM = 3;           // hủy/đổi giờ phải trước giờ đá >= 3 tiếng
    public static final int PHUT_BOOM = 20;            // sau giờ bắt đầu 20 phút mới được báo boom
    public static final int PHUT_GIO_VANG = 10;        // còn 10 phút -> màu vàng
    public static final int PHUT_THEM_GIO_TOI_DA = 20; // chỉ thêm giờ khi còn <= 20 phút
    public static final long TIEN_30_PHUT = 50000;     // 30 phút thêm giờ
    public static final long LUONG_GIO_MAC_DINH = 50000;
    public static final int[] THOI_LUONG = {60, 90, 120};

    public static String nhan(String tt) {
        if (tt == null) return "";
        switch (tt) {
            case CHO_XAC_NHAN: return "Chờ cọc";
            case DA_XAC_NHAN: return "Đã cọc";
            case DANG_DA: return "Đang đá";
            case DA_DA_XONG: return "Đã đá xong";
            case DA_HUY: return "Đã hủy";
            case KHACH_BOOM: return "Khách boom";
            default: return tt;
        }
    }

    // ---- Giờ: LocalTime 00:00 ở cột "kết thúc" nghĩa là 24:00 ----
    public static int phutBatDau(LocalTime t) { return t.getHour() * 60 + t.getMinute(); }
    public static int phutKetThuc(LocalTime t) { int p = phutBatDau(t); return p == 0 ? 1440 : p; }
    public static LocalTime gioTuPhut(int p) { return p >= 1440 ? LocalTime.MIDNIGHT : LocalTime.of(p / 60, p % 60); }
    public static String gioStr(int phut) { return String.format("%02d:%02d", phut / 60, phut % 60); }
    public static String gioKetThucStr(LocalTime t) { return gioStr(phutKetThuc(t)); }
    public static String gioBatDauStr(LocalTime t) { return gioStr(phutBatDau(t)); }

    /** Chuỗi "HH:mm" (cho phép "24:00") -> LocalTime. */
    public static LocalTime parseGio(String s) {
        if (s == null || s.isBlank()) throw new NghiepVuException("Vui lòng chọn giờ.");
        s = s.trim();
        if (s.startsWith("24")) return LocalTime.MIDNIGHT;
        return LocalTime.parse(s.length() == 4 ? "0" + s : s);
    }

    public static List<String> danhSachGio(int tuPhut, int denPhut, int buoc) {
        List<String> ds = new ArrayList<>();
        for (int p = tuPhut; p <= denPhut; p += buoc) ds.add(gioStr(p));
        return ds;
    }

    public static boolean cuoiTuan(LocalDate d) {
        int w = d.getDayOfWeek().getValue();
        return w == 6 || w == 7;
    }

    public static String thu(LocalDate d) {
        String[] t = {"", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"};
        return t[d.getDayOfWeek().getValue()];
    }

    public static String tien(long v) {
        return String.format("%,d", v).replace(',', '.') + "đ";
    }

    public static long nz(Long v) { return v == null ? 0 : v; }

    public static String chuanHoaSdt(String s) {
        if (s == null) return "";
        return s.replaceAll("[\\s.\\-()]", "");
    }
}
