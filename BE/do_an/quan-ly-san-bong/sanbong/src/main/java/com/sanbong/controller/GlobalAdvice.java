package com.sanbong.controller;

import com.sanbong.entity.NhanVien;
import com.sanbong.entity.SanBong;
import com.sanbong.repository.SanBongRepo;
import com.sanbong.service.NguoiDungService;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/** Dữ liệu dùng chung cho mọi trang + bắt lỗi nghiệp vụ (hiện thông báo đỏ và quay lại trang trước). */
@ControllerAdvice(basePackages = "com.sanbong.controller")
@RequiredArgsConstructor
public class GlobalAdvice {
    private final NguoiDungService nguoiDung;
    private final SanBongRepo sanRepo;

    @ModelAttribute("nvHienTai")
    public NhanVien nvHienTai() { return nguoiDung.hienTai(); }

    @ModelAttribute("dsSan")
    public List<SanBong> dsSan() { return sanRepo.findAllByOrderByMaSanAsc(); }

    @ModelAttribute("hnay")
    public java.time.LocalDate hnay() { return java.time.LocalDate.now(); }

    @ModelAttribute("gioDat")
    public List<String> gioDat() { return QuyDinh.danhSachGio(QuyDinh.PHUT_MO_CUA, 23 * 60, 30); }

    @ExceptionHandler(NghiepVuException.class)
    public String loiNghiepVu(NghiepVuException e, HttpServletRequest req, RedirectAttributes ra) {
        ra.addFlashAttribute("loi", e.getMessage());
        String dich = "/lich-san";
        String ref = req.getHeader("Referer");
        if (ref != null) {
            try {
                URI u = URI.create(ref);
                String p = u.getRawPath() + (u.getRawQuery() != null ? "?" + u.getRawQuery() : "");
                if (p.startsWith("/") && !p.startsWith("//")) dich = p;
            } catch (Exception ignored) { }
        }
        return "redirect:" + dich;
    }
}
