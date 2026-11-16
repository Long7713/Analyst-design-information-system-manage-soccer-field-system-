package com.sanbong.controller;

import com.sanbong.entity.CaLamViec;
import com.sanbong.repository.*;
import com.sanbong.service.NhanSuService;
import com.sanbong.service.ThongKeService;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/nhan-su")
@RequiredArgsConstructor
public class NhanSuController {
    private final NhanSuService service;
    private final NhanVienRepo nvRepo;
    private final TaiKhoanRepo tkRepo;
    private final CaLamViecRepo caRepo;
    private final ThongKeService thongKe;

    @GetMapping
    public String nhanSu(@RequestParam(defaultValue = "thang") String kieu,
                         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate moc, Model m) {
        if (moc == null) moc = LocalDate.now();
        LocalDate tu, den;
        switch (kieu) {
            case "ngay": tu = moc; den = moc; break;
            case "tuan": tu = moc.with(DayOfWeek.MONDAY); den = tu.plusDays(6); break;
            default: kieu = "thang"; tu = moc.withDayOfMonth(1); den = tu.plusMonths(1).minusDays(1);
        }
        List<CaLamViec> ca = caRepo.findByNgayLamBetweenOrderByNgayLamAscGioBatDauAsc(tu, den);
        m.addAttribute("dsNv", nvRepo.findAll());
        m.addAttribute("dsTk", tkRepo.findAll());
        m.addAttribute("dsCa", ca);
        m.addAttribute("luong", thongKe.thongKeNhanVien(tu, den));
        m.addAttribute("kieu", kieu);
        m.addAttribute("moc", moc);
        m.addAttribute("tu", tu);
        m.addAttribute("den", den);
        m.addAttribute("homNay", LocalDate.now());
        m.addAttribute("gioKetThuc", com.sanbong.util.QuyDinh.danhSachGio(8 * 60, 24 * 60, 30));
        return "nhan-su";
    }

    @PostMapping("/luu")
    public String luu(@RequestParam(required = false) Integer maNv, @RequestParam String hoTen,
                      @RequestParam(required = false) String soDienThoai,
                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngaySinh,
                      @RequestParam(required = false) String diaChi,
                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayVaoLam,
                      @RequestParam(required = false) Long mucLuongGio,
                      @RequestParam(required = false) String tenDangNhap, @RequestParam(required = false) String matKhau,
                      @RequestParam(defaultValue = "NHAN_VIEN") String vaiTro, RedirectAttributes ra) {
        service.luu(maNv, hoTen, soDienThoai, ngaySinh, diaChi, ngayVaoLam, mucLuongGio, tenDangNhap, matKhau, vaiTro);
        ra.addFlashAttribute("thongBao", "Đã lưu nhân viên.");
        return "redirect:/nhan-su";
    }

    @PostMapping("/{id}/trang-thai")
    public String trangThai(@PathVariable Integer id, @RequestParam String trangThai, RedirectAttributes ra) {
        service.doiTrangThai(id, trangThai);
        ra.addFlashAttribute("thongBao", "Đã đổi trạng thái nhân viên (dữ liệu lịch sử được giữ nguyên).");
        return "redirect:/nhan-su";
    }

    @PostMapping("/ca/luu")
    public String themCa(@RequestParam Integer maNv,
                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayLam,
                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime gioBatDau,
                         @RequestParam String gioKetThuc, RedirectAttributes ra) {
        service.themCa(maNv, ngayLam, gioBatDau, gioKetThuc);
        ra.addFlashAttribute("thongBao", "Đã thêm ca làm việc.");
        return "redirect:/nhan-su";
    }

    @PostMapping("/ca/{id}/xoa")
    public String xoaCa(@PathVariable Integer id, RedirectAttributes ra) {
        service.xoaCa(id);
        ra.addFlashAttribute("thongBao", "Đã xóa ca làm việc.");
        return "redirect:/nhan-su";
    }
}
