package com.sanbong.controller;

import com.sanbong.entity.ThietBi;
import com.sanbong.repository.*;
import com.sanbong.service.KhoService;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/thiet-bi")
@RequiredArgsConstructor
public class ThietBiController {
    private final KhoService khoService;
    private final ThietBiRepo thietBiRepo;
    private final ChiTietThietBiRepo chiTietRepo;
    private final PhieuBaoTriRepo baoTriRepo;

    @GetMapping
    public String danhSach(@RequestParam(required = false) Integer chon, Model m) {
        m.addAttribute("dsTb", thietBiRepo.findAllByOrderByLoaiThietBiAscTenThietBiAsc());
        m.addAttribute("dsBaoTri", baoTriRepo.findAllByOrderByMaBaoTriDesc());
        if (chon != null) {
            ThietBi t = thietBiRepo.findById(chon).orElse(null);
            m.addAttribute("chon", t);
            if (t != null) m.addAttribute("chiTiet", chiTietRepo.findByThietBi_MaThietBiOrderByTenChiTietAsc(chon));
        }
        return "thiet-bi";
    }

    @PostMapping("/luu")
    public String luu(@RequestParam(required = false) Integer maThietBi, @RequestParam String tenThietBi,
                      @RequestParam(required = false) String loaiThietBi,
                      @RequestParam(required = false) Integer slDangDung, @RequestParam(required = false) Integer slTrongKho,
                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayNhap,
                      @RequestParam(required = false) String ghiChu, RedirectAttributes ra) {
        khoService.luuThietBi(maThietBi, tenThietBi, loaiThietBi, slDangDung, slTrongKho, ngayNhap, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã lưu thiết bị.");
        return "redirect:/thiet-bi";
    }

    @PostMapping("/{id}/chuyen")
    public String chuyen(@PathVariable Integer id, @RequestParam String tu, @RequestParam String den, @RequestParam int soLuong,
                         @RequestParam(required = false) String lyDo, RedirectAttributes ra) {
        khoService.chuyenTinhTrang(id, tu, den, soLuong, lyDo);
        ra.addFlashAttribute("thongBao", "Đã cập nhật số lượng theo tình trạng.");
        return "redirect:/thiet-bi";
    }

    @PostMapping("/bao-tri")
    public String baoTri(@RequestParam Integer maThietBi, @RequestParam int soLuong, @RequestParam String noiDung,
                         @RequestParam(required = false) Long chiPhi, RedirectAttributes ra) {
        khoService.taoBaoTri(maThietBi, soLuong, noiDung, chiPhi);
        ra.addFlashAttribute("thongBao", "Đã tạo phiếu bảo trì.");
        return "redirect:/thiet-bi";
    }

    @PostMapping("/bao-tri/{id}/hoan-thanh")
    public String hoanThanh(@PathVariable Integer id, @RequestParam(required = false) Long chiPhi, RedirectAttributes ra) {
        khoService.hoanThanhBaoTri(id, chiPhi);
        ra.addFlashAttribute("thongBao", "Đã hoàn thành bảo trì, thiết bị về kho.");
        return "redirect:/thiet-bi";
    }

    @PostMapping("/{id}/chi-tiet")
    public String themChiTiet(@PathVariable Integer id, @RequestParam String tenChiTiet, @RequestParam(required = false) Integer maSan,
                              @RequestParam(required = false) String tinhTrang, @RequestParam(required = false) String ghiChu,
                              RedirectAttributes ra) {
        khoService.luuChiTietThietBi(id, tenChiTiet, maSan, tinhTrang, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã thêm chi tiết thiết bị.");
        return "redirect:/thiet-bi?chon=" + id;
    }

    @PostMapping("/chi-tiet/{id}/tinh-trang")
    public String doiTinhTrang(@PathVariable Integer id, @RequestParam String tinhTrang, @RequestParam Integer maThietBi, RedirectAttributes ra) {
        khoService.doiTinhTrangChiTiet(id, tinhTrang);
        ra.addFlashAttribute("thongBao", "Đã cập nhật tình trạng.");
        return "redirect:/thiet-bi?chon=" + maThietBi;
    }
}
