package com.sanbong.controller;

/** Hàm dùng chung: chỉ cho phép quay lại đường dẫn nội bộ (tránh open-redirect). */
final class Dieuhuong {
    private Dieuhuong() {}
    static String ve(String ve, String macDinh) {
        if (ve != null && ve.startsWith("/") && !ve.startsWith("//")) return "redirect:" + ve;
        return "redirect:" + macDinh;
    }
}
