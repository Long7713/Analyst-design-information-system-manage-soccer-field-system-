package com.sanbong.controller;

import com.sanbong.entity.NhaCungCap;
import com.sanbong.repository.*;
import com.sanbong.service.KhoService;
import com.sanbong.service.ThongKeService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/kho")
@RequiredArgsConstructor
public class KhoController {
    private final KhoService khoService;
    private final ThongKeService thongKe;
    private final PhieuNhapRepo phieuNhapRepo;
    private final NhaCungCapRepo nccRepo;
    private final SanPhamRepo sanPhamRepo;
    private final ThietBiRepo thietBiRepo;

    @GetMapping
    public String kho(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tu,
                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate den, Model m) {
        if (tu == null) tu = LocalDate.now().withDayOfMonth(1);
        if (den == null) den = LocalDate.now();
        m.addAttribute("tu", tu);
        m.addAttribute("den", den);
        m.addAttribute("baoCao", thongKe.baoCaoKho(tu, den));
        m.addAttribute("dsPhieu", phieuNhapRepo.findAllByOrderByMaPhieuNhapDesc());
        m.addAttribute("dsNcc", nccRepo.findAll());
        return "kho";
    }

    @GetMapping("/phieu-nhap/moi")
    public String phieuMoi(Model m) {
        m.addAttribute("dsNcc", nccRepo.findAll());
        m.addAttribute("dsSp", sanPhamRepo.findAllByOrderByLoaiSanPhamAscTenSanPhamAsc());
        m.addAttribute("dsTb", thietBiRepo.findAllByOrderByLoaiThietBiAscTenThietBiAsc());
        m.addAttribute("homNay", LocalDate.now());
        return "phieu-nhap-form";
    }

    @PostMapping("/phieu-nhap/luu")
    public String luuPhieu(@RequestParam(required = false) Integer maNcc,
                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhap,
                           @RequestParam(required = false) String ghiChu,
                           @RequestParam List<String> loai, @RequestParam List<Integer> maHang,
                           @RequestParam List<Integer> soLuong, @RequestParam List<Long> donGia,
                           @RequestParam String hanhDong, RedirectAttributes ra) {
        khoService.taoPhieuNhap(maNcc, ngayNhap, ghiChu, loai, maHang, soLuong, donGia, hanhDong);
        ra.addFlashAttribute("thongBao", "xac_nhan".equals(hanhDong) ? "Đã tạo và xác nhận phiếu nhập - kho đã được cộng." : "Đã lưu phiếu nhập.");
        return "redirect:/kho";
    }

    @PostMapping("/phieu-nhap/{id}/gui")
    public String gui(@PathVariable Integer id, RedirectAttributes ra) {
        khoService.guiXacNhan(id);
        ra.addFlashAttribute("thongBao", "Phiếu đã chuyển sang Chờ xác nhận (chưa cộng kho).");
        return "redirect:/kho";
    }

    @PostMapping("/phieu-nhap/{id}/xac-nhan")
    public String xacNhan(@PathVariable Integer id, RedirectAttributes ra) {
        khoService.xacNhanPhieu(id);
        ra.addFlashAttribute("thongBao", "Đã xác nhận phiếu nhập, số lượng đã được cộng vào kho.");
        return "redirect:/kho";
    }

    @PostMapping("/phieu-nhap/{id}/huy")
    public String huy(@PathVariable Integer id, RedirectAttributes ra) {
        khoService.huyPhieu(id);
        ra.addFlashAttribute("thongBao", "Đã hủy phiếu nhập.");
        return "redirect:/kho";
    }

    @PostMapping("/ncc/luu")
    public String luuNcc(NhaCungCap ncc, RedirectAttributes ra) {
        khoService.luuNcc(ncc);
        ra.addFlashAttribute("thongBao", "Đã lưu nhà cung cấp.");
        return "redirect:/kho";
    }
}
