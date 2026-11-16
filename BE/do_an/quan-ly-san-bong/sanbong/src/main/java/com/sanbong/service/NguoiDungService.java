package com.sanbong.service;

import com.sanbong.entity.NhanVien;
import com.sanbong.entity.TaiKhoan;
import com.sanbong.repository.TaiKhoanRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/** Lấy nhân viên đang đăng nhập. */
@Service
@RequiredArgsConstructor
public class NguoiDungService {
    private final TaiKhoanRepo taiKhoanRepo;

    public TaiKhoan taiKhoanHienTai() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a == null || a instanceof AnonymousAuthenticationToken || !a.isAuthenticated()) return null;
        return taiKhoanRepo.findByTenDangNhap(a.getName()).orElse(null);
    }

    public NhanVien hienTai() {
        TaiKhoan tk = taiKhoanHienTai();
        return tk == null ? null : tk.getNhanVien();
    }

    public boolean laQuanLy() {
        TaiKhoan tk = taiKhoanHienTai();
        return tk != null && "QUAN_LY".equals(tk.getVaiTro());
    }
}
